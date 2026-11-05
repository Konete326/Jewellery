import assert from 'node:assert/strict';
import http from 'node:http';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { setupTestDatabase, teardownTestDatabase } from './testDatabase.js';
import { User } from '../src/modules/users/user.model.js';
import { Order } from '../src/modules/orders/order.model.js';
import { Payment, normalizePaymentReference } from '../src/modules/orders/payment.model.js';
import { auditLegacyPaymentReferences } from '../src/modules/orders/payment.audit.js';
import { PaymentAccount } from '../src/modules/payment-accounts/paymentAccount.model.js';
import { Rate } from '../src/modules/rates/rate.model.js';
import { calculateAllRates } from '../src/modules/rates/rate.calculator.js';
import { hashPassword } from '../src/modules/users/user.password.js';
import { setTestTransporter, sendCustomerOrderStatusEmail, sendCustomerPaymentApprovedEmail } from '../src/modules/orders/order.mailer.js';
import { calculateItemNetWeight, evaluateRateLock } from '../src/modules/orders/order.lock.js';
import { ENV } from '../src/config/env.js';

process.env.NODE_ENV = 'test';
process.env.TEST_ORDER_RATE_LIMIT = '200';

const runTests = async () => {
  const dbContext = await setupTestDatabase();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;

  const adminUser = await User.create({
    name: 'Order Payment Admin',
    email: `order_payment_admin_${Date.now()}@test.com`,
    password: hashPassword('Password123!'),
    role: 'admin',
    authProvider: 'local'
  });

  const customerUser = await User.create({
    name: 'Order Payment Customer',
    email: `order_payment_cust_${Date.now()}@test.com`,
    password: hashPassword('Password123!'),
    role: 'customer',
    authProvider: 'local'
  });

  const adminToken = jwt.sign(
    { id: adminUser._id.toString(), email: adminUser.email, role: 'admin' },
    ENV.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const customerToken = jwt.sign(
    { id: customerUser._id.toString(), email: customerUser.email, role: 'customer' },
    ENV.JWT_SECRET,
    { expiresIn: '1h' }
  );

  let passed = 0;
  let failed = 0;

  const capturedEmails = [];
  setTestTransporter({
    sendMail: async (opts) => {
      capturedEmails.push(opts);
      return { messageId: `msg-${Date.now()}` };
    }
  });

  const testCase = async (name, fn) => {
    try {
      await fn();
      passed++;
      console.log(`[PASS] ${name}`);
    } catch (err) {
      failed++;
      console.error(`[FAIL] ${name}`);
      console.error(err);
    }
  };

  const activeBankHBL = await PaymentAccount.create({
    bankName: 'Habib Bank Limited (HBL)',
    accountTitle: 'Khalil & Sons Jewellers',
    accountNumber: '00427901234567',
    iban: 'PK36HABB0000427901234567',
    accountType: 'Current Account',
    isActive: true,
    isDefault: true
  });

  const activeBankMeezan = await PaymentAccount.create({
    bankName: 'Meezan Bank Limited',
    accountTitle: 'Khalil & Sons Bullion Atelier',
    accountNumber: '01020304050607',
    iban: 'PK88MEZN0001020304050607',
    accountType: 'Islamic Business Account',
    isActive: true,
    isDefault: false
  });

  const inactiveBankStandard = await PaymentAccount.create({
    bankName: 'Standard Chartered Bank',
    accountTitle: 'Khalil & Sons Inactive',
    accountNumber: '99887766554433',
    iban: 'PK12SCBL0000998877665544',
    accountType: 'Corporate Account',
    isActive: false,
    isDefault: false
  });

  let testOrder = null;
  let payment1Id = null;
  let payment2Id = null;
  let payment3Id = null;

  await testCase('1. Order creation stores immutable gold rate snapshot & calculates 90% threshold', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        customer: {
          name: 'Ahmed Tariq',
          phone: '03001234567',
          city: 'Karachi'
        },
        items: [
          {
            title: '22K Traditional Bridal Choker',
            purity: '22K',
            quantity: 1,
            price: 500000
          }
        ],
        totalAmount: 500000,
        pureGoldValue: 400000,
        goldRateLock: {
          snapshotRate: 419000,
          karat: '22K'
        }
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.success, true);
    testOrder = body.data;
    assert.ok(testOrder._id);
    assert.strictEqual(testOrder.fulfillmentType, 'Showroom Pickup');
    assert.strictEqual(testOrder.goldRateLock.isLocked, false);
    assert.strictEqual(testOrder.goldRateLock.snapshotRate, 419000);
    assert.strictEqual(testOrder.goldRateLock.pureGoldValue, 400000);
    assert.strictEqual(testOrder.goldRateLock.minAdvanceRequired, 360000);
  });

  await testCase('2. Inactive bank account payment submission is rejected with 400 Bad Request', async () => {
    const res = await fetch(`${baseUrl}/orders/${testOrder._id}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        amount: 150000,
        bankAccount: inactiveBankStandard._id.toString(),
        paymentReference: 'TRX-INACTIVE-001'
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(body.success, false);
    assert.ok(/inactive/i.test(body.message));
  });

  await testCase('3. Pending payment recorded on active bank account without confirming order or locking rate', async () => {
    const res = await fetch(`${baseUrl}/orders/${testOrder._id}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        amount: 200000,
        bankAccount: activeBankHBL._id.toString(),
        paymentReference: 'HBL-ADV-987654',
        paymentType: 'Advance'
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.success, true);
    payment1Id = body.data._id;
    assert.strictEqual(body.data.status, 'Pending');
    assert.strictEqual(body.data.amount, 200000);
    assert.strictEqual(body.data.bankAccountSnapshot.bankName, 'Habib Bank Limited (HBL)');

    const orderRes = await fetch(`${baseUrl}/orders/${testOrder._id}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const currentOrder = (await orderRes.json()).data;
    assert.strictEqual(currentOrder.advancePaid, 0);
    assert.strictEqual(currentOrder.orderStatus, 'Pending');
    assert.strictEqual(currentOrder.goldRateLock.isLocked, false);
  });

  await testCase('4. Non-admin customer cannot approve payment (403 Forbidden)', async () => {
    const res = await fetch(`${baseUrl}/orders/${testOrder._id}/payments/${payment1Id}/approve`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${customerToken}`
      }
    });
    assert.strictEqual(res.status, 403);
  });

  await testCase('5. Admin approves Payment 1 (generates receipt, partial advance, rate remains unlocked under 90%)', async () => {
    const res = await fetch(`${baseUrl}/orders/${testOrder._id}/payments/${payment1Id}/approve`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.payment.status, 'Approved');
    assert.ok(body.data.payment.receiptNumber.startsWith('KS-RCP-'));
    assert.strictEqual(body.data.order.advancePaid, 200000);
    assert.strictEqual(body.data.order.balanceDue, 300000);
    assert.strictEqual(body.data.order.paymentStatus, 'Partial');
    assert.strictEqual(body.data.order.orderStatus, 'Confirmed');
    assert.strictEqual(body.data.order.goldRateLock.isLocked, false);
  });

  await testCase('6. Multiple payments on one order: Submits Payment 2 to a distinct second bank account', async () => {
    const res = await fetch(`${baseUrl}/orders/${testOrder._id}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        amount: 180000,
        bankAccount: activeBankMeezan._id.toString(),
        paymentReference: 'MEEZAN-ADV-112233',
        paymentType: 'Advance'
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 201);
    payment2Id = body.data._id;
    assert.strictEqual(body.data.bankAccountSnapshot.bankName, 'Meezan Bank Limited');
  });

  await testCase('7. Payment rejection: Admin rejects invalid payment 3 with reason (not added to advance)', async () => {
    const submitRes = await fetch(`${baseUrl}/orders/${testOrder._id}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        amount: 50000,
        bankAccount: activeBankHBL._id.toString(),
        paymentReference: 'FAKE-SLIP-999'
      })
    });
    payment3Id = (await submitRes.json()).data._id;

    const rejectRes = await fetch(`${baseUrl}/orders/${testOrder._id}/payments/${payment3Id}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        reason: 'Bank transfer slip unverified with bank statement'
      })
    });
    const body = await rejectRes.json();
    assert.strictEqual(rejectRes.status, 200);
    assert.strictEqual(body.data.payment.status, 'Rejected');
    assert.strictEqual(body.data.payment.rejectionReason, 'Bank transfer slip unverified with bank statement');
    assert.strictEqual(body.data.order.advancePaid, 200000);
  });

  await testCase('8. 90% threshold and gold rate lock: Approving Payment 2 locks rate at order creation snapshot', async () => {
    const res = await fetch(`${baseUrl}/orders/${testOrder._id}/payments/${payment2Id}/approve`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.data.order.advancePaid, 380000);
    assert.strictEqual(body.data.order.goldRateLock.isLocked, true);
    assert.strictEqual(body.data.order.goldRateLock.lockedRate, 419000);
    assert.ok(body.data.order.goldRateLock.lockedAt);
  });

  await testCase('9. Rate preservation: Locked rate remains fixed even if live market Sarafa rates change', async () => {
    const spikedRates = calculateAllRates(520000, 7500);
    await Rate.deleteMany({});
    await Rate.create({
      gold: spikedRates.gold,
      silver: spikedRates.silver,
      marketSource: 'Test Live Spike',
      isManualOverride: false,
      lastSyncedAt: new Date()
    });

    const orderRes = await fetch(`${baseUrl}/orders/${testOrder._id}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const currentOrder = (await orderRes.json()).data;
    assert.strictEqual(currentOrder.goldRateLock.isLocked, true);
    assert.strictEqual(currentOrder.goldRateLock.lockedRate, 419000);
    assert.notStrictEqual(currentOrder.goldRateLock.lockedRate, 476667);
  });

  await testCase('10. Order receipts endpoint accurately reflects order, bank, amount and approval details', async () => {
    const res = await fetch(`${baseUrl}/orders/${testOrder._id}/receipts`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    const receipts = body.data;
    assert.strictEqual(receipts.length, 2);
    assert.strictEqual(receipts[0].orderNumber, testOrder.orderNumber);
    assert.strictEqual(receipts[0].customer.name, 'Ahmed Tariq');
    assert.strictEqual(receipts[0].approval.status, 'Approved');
    assert.ok(receipts[0].bankAccount.bankName);
  });

  await testCase('11. Bank account ledger endpoint returns accurate received, pending & rejected sums', async () => {
    const res = await fetch(`${baseUrl}/payment-accounts/${activeBankHBL._id}/ledger`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    const ledger = body.data;
    assert.strictEqual(ledger.summary.receivedAmount, 200000);
    assert.strictEqual(ledger.summary.rejectedAmount, 50000);
    assert.strictEqual(ledger.summary.pendingAmount, 0);
    assert.strictEqual(ledger.summary.countApproved, 1);
    assert.strictEqual(ledger.summary.countRejected, 1);
    assert.strictEqual(ledger.summary.totalTransactions, 2);
    assert.strictEqual(ledger.account.bankName, 'Habib Bank Limited (HBL)');
  });

  await testCase('12. Existing orders backward compatibility: Orders without payment ledger work without errors', async () => {
    const legacyOrder = await Order.create({
      orderNumber: `KS-LEGACY-${Date.now()}`,
      customer: {
        name: 'Legacy Patron',
        phone: '03339998877'
      },
      items: [
        {
          title: 'Legacy Gold Ring',
          quantity: 1,
          price: 75000
        }
      ],
      totalAmount: 75000,
      advancePaid: 25000,
      balanceDue: 50000,
      paymentStatus: 'Partial',
      orderStatus: 'Processing'
    });

    const getRes = await fetch(`${baseUrl}/orders/${legacyOrder._id}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(getRes.status, 200);
    const fetchedLegacy = (await getRes.json()).data;
    assert.strictEqual(fetchedLegacy.advancePaid, 25000);
    assert.strictEqual(fetchedLegacy.balanceDue, 50000);
    assert.strictEqual(fetchedLegacy.goldRateLock.isLocked, false);

    const paymentsRes = await fetch(`${baseUrl}/orders/${legacyOrder._id}/payments`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(paymentsRes.status, 200);
    assert.deepStrictEqual((await paymentsRes.json()).data, []);
  });

  await testCase('13. Gold rate lock accuracy: pure gold value calculated from actual net weight and purity rate (gross - stone weight)', async () => {
    const baseRates = calculateAllRates(419000, 7500);
    await Rate.deleteMany({});
    await Rate.create({
      gold: baseRates.gold,
      silver: baseRates.silver,
      marketSource: 'Test Sarafa',
      isManualOverride: false,
      lastSyncedAt: new Date()
    });

    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        customer: {
          name: 'Bespoke Patron',
          email: 'bespoke_patron@test.com',
          phone: '03001122334',
          city: 'Karachi'
        },
        items: [
          {
            title: '22K Kundan Choker',
            purity: '22K',
            grossWeight: 14,
            stoneWeight: 2,
            quantity: 1,
            price: 600000
          }
        ],
        totalAmount: 600000
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 201);
    const order = body.data;
    assert.strictEqual(order.items[0].grossWeight, 14);
    assert.strictEqual(order.items[0].stoneWeight, 2);
    assert.strictEqual(order.goldRateLock.pureGoldValue, 395148);
    assert.strictEqual(order.goldRateLock.minAdvanceRequired, 355633);
    assert.strictEqual(order.goldRateLock.isLocked, false);
  });

  await testCase('14. Missing weight/purity data rejects rate-lock (threshold = 0, isLocked = false, no fabricated 85% fallback)', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        customer: {
          name: 'Weightless Patron',
          email: 'weightless@test.com',
          phone: '03009988776',
          city: 'Karachi'
        },
        items: [
          {
            title: 'Mystery Custom Piece',
            quantity: 1,
            price: 300000
          }
        ],
        totalAmount: 300000
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 201);
    const order = body.data;
    assert.strictEqual(order.goldRateLock.pureGoldValue, 0);
    assert.strictEqual(order.goldRateLock.minAdvanceRequired, 0);
    assert.notStrictEqual(order.goldRateLock.pureGoldValue, 255000);

    const payRes = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        amount: 300000,
        bankAccount: activeBankHBL._id.toString(),
        paymentReference: 'FULL-ADV-100'
      })
    });
    const payData = (await payRes.json()).data;
    const approveRes = await fetch(`${baseUrl}/orders/${order._id}/payments/${payData._id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const approvedBody = await approveRes.json();
    assert.strictEqual(approvedBody.data.order.goldRateLock.isLocked, false);
  });

  await testCase('15. Exact 90% threshold guard: 89.99% advance does NOT lock, exact 90% advance DOES lock', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        customer: {
          name: 'Threshold Tester',
          email: 'threshold@test.com',
          phone: '03005544332',
          city: 'Karachi'
        },
        items: [
          {
            title: 'Gold Bangle',
            purity: '22K',
            quantity: 1,
            price: 150000
          }
        ],
        totalAmount: 150000,
        pureGoldValue: 100000
      })
    });
    const order = (await res.json()).data;
    assert.strictEqual(order.goldRateLock.pureGoldValue, 100000);
    assert.strictEqual(order.goldRateLock.minAdvanceRequired, 90000);

    const pay1Res = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        amount: 89990,
        bankAccount: activeBankHBL._id.toString(),
        paymentReference: 'ADV-8999'
      })
    });
    const pay1 = (await pay1Res.json()).data;
    const app1Res = await fetch(`${baseUrl}/orders/${order._id}/payments/${pay1._id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const app1Order = (await app1Res.json()).data.order;
    assert.strictEqual(app1Order.advancePaid, 89990);
    assert.strictEqual(app1Order.goldRateLock.isLocked, false);

    const pay2Res = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        amount: 10,
        bankAccount: activeBankHBL._id.toString(),
        paymentReference: 'ADV-0010'
      })
    });
    const pay2 = (await pay2Res.json()).data;
    const app2Res = await fetch(`${baseUrl}/orders/${order._id}/payments/${pay2._id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const app2Order = (await app2Res.json()).data.order;
    assert.strictEqual(app2Order.advancePaid, 90000);
    assert.strictEqual(app2Order.goldRateLock.isLocked, true);
  });

  await testCase('16. Pending and rejected payments do not count towards rate lock threshold', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        customer: {
          name: 'Count Tester',
          email: 'counter@test.com',
          phone: '03004433221',
          city: 'Karachi'
        },
        items: [{ title: '22K Chain', purity: '22K', quantity: 1, price: 300000 }],
        totalAmount: 300000,
        pureGoldValue: 200000
      })
    });
    const order = (await res.json()).data;
    assert.strictEqual(order.goldRateLock.minAdvanceRequired, 180000);

    const p1 = (await (await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ amount: 100000, bankAccount: activeBankHBL._id.toString(), paymentReference: 'TX-APPROVED' })
    })).json()).data;
    await fetch(`${baseUrl}/orders/${order._id}/payments/${p1._id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ amount: 100000, bankAccount: activeBankHBL._id.toString(), paymentReference: 'TX-PENDING' })
    });

    const p3 = (await (await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ amount: 100000, bankAccount: activeBankHBL._id.toString(), paymentReference: 'TX-REJECTED' })
    })).json()).data;
    await fetch(`${baseUrl}/orders/${order._id}/payments/${p3._id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ reason: 'Unverified' })
    });

    const checkRes = await fetch(`${baseUrl}/orders/${order._id}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const current = (await checkRes.json()).data;
    assert.strictEqual(current.advancePaid, 100000);
    assert.strictEqual(current.goldRateLock.isLocked, false);
  });

  await testCase('17. Order-date rate preservation: lockedRate strictly freezes at order creation snapshot rate', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Freeze Patron', email: 'freeze@test.com', phone: '03001239999' },
        items: [{ title: '22K Ring', purity: '22K', netWeight: 10, quantity: 1, price: 400000 }],
        totalAmount: 400000
      })
    });
    const order = (await res.json()).data;
    const initialSnapshotRate = order.goldRateLock.snapshotRate;
    assert.ok(initialSnapshotRate > 0);

    const spiked = calculateAllRates(600000, 8000);
    await Rate.deleteMany({});
    await Rate.create({ gold: spiked.gold, silver: spiked.silver, marketSource: 'Spike DB', lastSyncedAt: new Date() });

    const payRes = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ amount: order.goldRateLock.minAdvanceRequired, bankAccount: activeBankHBL._id.toString() })
    });
    const pay = (await payRes.json()).data;
    const appRes = await fetch(`${baseUrl}/orders/${order._id}/payments/${pay._id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const finalOrder = (await appRes.json()).data.order;
    assert.strictEqual(finalOrder.goldRateLock.isLocked, true);
    assert.strictEqual(finalOrder.goldRateLock.lockedRate, initialSnapshotRate);
    assert.notStrictEqual(finalOrder.goldRateLock.lockedRate, 600000);
  });

  await testCase('18. Customer email notifications: Payment approved email contains safe receipt, locked rate, pickup notice and NO internal data', async () => {
    capturedEmails.length = 0;
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Email Patron', email: 'email_patron@test.com', phone: '03001237777' },
        items: [{ title: '22K Pendant', purity: '22K', netWeight: 5, quantity: 1, price: 200000 }],
        totalAmount: 200000,
        internalNotes: 'SECRET ADMIN NOTE: VIP VIP'
      })
    });
    const order = (await res.json()).data;

    const payRes = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ amount: order.goldRateLock.minAdvanceRequired, bankAccount: activeBankHBL._id.toString() })
    });
    const pay = (await payRes.json()).data;

    capturedEmails.length = 0;
    await fetch(`${baseUrl}/orders/${order._id}/payments/${pay._id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const paymentEmail = capturedEmails.find((e) => /Payment Approved/i.test(e.subject));
    assert.ok(paymentEmail);
    assert.strictEqual(paymentEmail.to, 'email_patron@test.com');
    assert.ok(/Saddar, Karachi/i.test(paymentEmail.html));
    assert.ok(/courier or delivery/i.test(paymentEmail.html));
    assert.ok(/KS-RCP-/i.test(paymentEmail.html));
    assert.strictEqual(/SECRET ADMIN NOTE/i.test(paymentEmail.html), false);
    assert.strictEqual(/order_payment_admin/i.test(paymentEmail.html), false);
  });

  await testCase('19. Customer email notifications: Payment rejected email contains customer-safe explanation and NO internal rejection notes', async () => {
    capturedEmails.length = 0;
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Reject Patron', email: 'reject_patron@test.com', phone: '03001236666' },
        items: [{ title: '22K Ring', quantity: 1, price: 50000 }],
        totalAmount: 50000
      })
    });
    const order = (await res.json()).data;

    const payRes = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ amount: 25000, bankAccount: activeBankHBL._id.toString() })
    });
    const pay = (await payRes.json()).data;

    capturedEmails.length = 0;
    await fetch(`${baseUrl}/orders/${order._id}/payments/${pay._id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ reason: 'INTERNAL: FRAUD_SUSPECTED_STAFF_CONFIDENTIAL' })
    });

    const rejectEmail = capturedEmails.find((e) => /Payment Verification Update/i.test(e.subject));
    assert.ok(rejectEmail);
    assert.strictEqual(rejectEmail.to, 'reject_patron@test.com');
    assert.strictEqual(/FRAUD_SUSPECTED_STAFF_CONFIDENTIAL/i.test(rejectEmail.html), false);
    assert.ok(/could not be matched with bank statements/i.test(rejectEmail.html));
  });

  await testCase('20. Customer email notifications: Order status transitions (Processing, Ready, Delivered)', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Status Patron', email: 'status_patron@test.com', phone: '03001235555' },
        items: [{ title: '22K Necklace', quantity: 1, price: 150000 }],
        totalAmount: 150000
      })
    });
    const order = (await res.json()).data;

    capturedEmails.length = 0;
    await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Processing' })
    });
    const procEmail = capturedEmails.find((e) => /Processing/i.test(e.subject));
    assert.ok(procEmail);
    assert.ok(/atelier/i.test(procEmail.html));

    capturedEmails.length = 0;
    await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Ready' })
    });
    const readyEmail = capturedEmails.find((e) => /Ready for Collection/i.test(e.subject));
    assert.ok(readyEmail);
    assert.ok(/Saddar Karachi/i.test(readyEmail.html));
    assert.ok(/No courier/i.test(readyEmail.html));

    capturedEmails.length = 0;
    await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Delivered' })
    });
    const delivEmail = capturedEmails.find((e) => /Order Collected/i.test(e.subject));
    assert.ok(delivEmail);
    assert.ok(/Thank you for visiting/i.test(delivEmail.html));
  });

  await testCase('21. Email delivery resilience: Email failure does NOT fail payment approval or order update', async () => {
    setTestTransporter({
      sendMail: async () => {
        throw new Error('SMTP connection timed out');
      }
    });

    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Resilience Patron', email: 'resilience@test.com', phone: '03001234444' },
        items: [{ title: '22K Anklet', quantity: 1, price: 80000 }],
        totalAmount: 80000
      })
    });
    const order = (await res.json()).data;

    const payRes = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ amount: 40000, bankAccount: activeBankHBL._id.toString() })
    });
    const pay = (await payRes.json()).data;

    const appRes = await fetch(`${baseUrl}/orders/${order._id}/payments/${pay._id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(appRes.status, 200);
    const appBody = await appRes.json();
    assert.strictEqual(appBody.data.order.advancePaid, 40000);

    const updateRes = await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Processing' })
    });
    assert.strictEqual(updateRes.status, 200);
  });

  await testCase('22. Duplicate notification protection: Re-triggering same event does not send duplicate emails', async () => {
    capturedEmails.length = 0;
    setTestTransporter({
      sendMail: async (opts) => {
        capturedEmails.push(opts);
        return { messageId: `msg-${Date.now()}` };
      }
    });

    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Duplicate Patron', email: 'dup_patron@test.com', phone: '03001233333' },
        items: [{ title: '22K Bracelet', quantity: 1, price: 90000 }],
        totalAmount: 90000
      })
    });
    const order = (await res.json()).data;

    const r1 = await sendCustomerOrderStatusEmail({ order, newStatus: 'Ready' });
    assert.strictEqual(r1.delivered, true);
    assert.strictEqual(capturedEmails.length, 1);

    const r2 = await sendCustomerOrderStatusEmail({ order, newStatus: 'Ready' });
    assert.strictEqual(r2.delivered, false);
    assert.strictEqual(r2.duplicate, true);
    assert.strictEqual(capturedEmails.length, 1);
  });

  await testCase('23. Duplicate approval guard: Approving an already approved payment returns 400 Bad Request', async () => {
    const res = await fetch(`${baseUrl}/orders/${testOrder._id}/payments/${payment1Id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const body = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(body.success, false);
    assert.ok(/already been approved/i.test(body.message));
  });

  await testCase('24. Duplicate rejection guard: Rejecting an already rejected payment returns 400 Bad Request', async () => {
    const res = await fetch(`${baseUrl}/orders/${testOrder._id}/payments/${payment3Id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ reason: 'Duplicate rejection attempt' })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(body.success, false);
    assert.ok(/already been rejected/i.test(body.message));
  });

  await testCase('25. Cross-status integrity: Cannot approve rejected payment or reject approved payment', async () => {
    const appOnRej = await fetch(`${baseUrl}/orders/${testOrder._id}/payments/${payment3Id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(appOnRej.status, 400);

    const rejOnApp = await fetch(`${baseUrl}/orders/${testOrder._id}/payments/${payment1Id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ reason: 'Invalid reject' })
    });
    assert.strictEqual(rejOnApp.status, 400);
  });

  await testCase('25b. Race-condition guard: Concurrent approval and rejection requests resolve deterministically without corrupting order state', async () => {
    const oRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Race Test Patron', email: 'racetest@test.com', phone: '03007776655' },
        items: [{ title: '22K Bangles', purity: '22K', netWeight: 10, quantity: 1, price: 300000 }],
        totalAmount: 300000
      })
    });
    const order = (await oRes.json()).data;
    const ref = `RACE-PAY-${Date.now()}`;

    const pRes = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        bankAccount: activeBankHBL._id,
        amount: 100000,
        paymentReference: ref
      })
    });
    const payment = (await pRes.json()).data;

    const emailCountBefore = capturedEmails.length;

    const parallelRequests = [
      fetch(`${baseUrl}/orders/${order._id}/payments/${payment._id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` }
      }),
      fetch(`${baseUrl}/orders/${order._id}/payments/${payment._id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` }
      }),
      fetch(`${baseUrl}/orders/${order._id}/payments/${payment._id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ reason: 'Concurrent reject' })
      }),
      fetch(`${baseUrl}/orders/${order._id}/payments/${payment._id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ reason: 'Concurrent reject duplicate' })
      })
    ];

    const responses = await Promise.all(parallelRequests);
    const statuses = responses.map((r) => r.status);
    const successes = statuses.filter((s) => s === 200).length;
    const conflicts = statuses.filter((s) => s === 400).length;

    assert.strictEqual(successes, 1);
    assert.strictEqual(conflicts, 3);

    for (const r of responses) {
      if (r.status === 400) {
        const body = await r.json();
        assert.strictEqual(body.success, false);
        assert.ok(
          /already been approved|already been rejected|Cannot approve a rejected payment|Cannot reject an already approved payment/i.test(
            body.message
          )
        );
      }
    }

    const emailCountAfter = capturedEmails.length;
    const freshOrder = await Order.findById(order._id);
    const freshPayment = await Payment.findById(payment._id);
    assert.ok(freshPayment.status === 'Approved' || freshPayment.status === 'Rejected');

    if (freshPayment.status === 'Approved') {
      assert.strictEqual(emailCountAfter - emailCountBefore, 2);
      assert.strictEqual(freshOrder.advancePaid, 100000);
      assert.strictEqual(freshOrder.balanceDue, 200000);
    } else {
      assert.strictEqual(emailCountAfter - emailCountBefore, 1);
      assert.strictEqual(freshOrder.advancePaid, 0);
      assert.strictEqual(freshOrder.balanceDue, 300000);
    }
  });

  await testCase('25c. Concurrent multi-payment approval on same order: Parallel approval of distinct payments serializes order recalculation and reflects exact combined totals and rate lock', async () => {
    const oRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Multi Payment Patron', email: 'multipay@test.com', phone: '03004443322' },
        items: [{ title: '22K Royal Bangle Set', purity: '22K', netWeight: 15, quantity: 1, price: 500000 }],
        totalAmount: 500000,
        pureGoldValue: 400000,
        goldRateLock: {
          snapshotRate: 419000,
          karat: '22K'
        }
      })
    });
    const order = (await oRes.json()).data;
    assert.strictEqual(order.goldRateLock.minAdvanceRequired, 360000);
    assert.strictEqual(order.goldRateLock.isLocked, false);

    const p1Res = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        bankAccount: activeBankHBL._id,
        amount: 200000,
        paymentReference: `MULTI-PAY-A-${Date.now()}`
      })
    });
    const pay1 = (await p1Res.json()).data;

    const p2Res = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        bankAccount: activeBankMeezan._id,
        amount: 200000,
        paymentReference: `MULTI-PAY-B-${Date.now()}`
      })
    });
    const pay2 = (await p2Res.json()).data;

    const [app1Res, app2Res] = await Promise.all([
      fetch(`${baseUrl}/orders/${order._id}/payments/${pay1._id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` }
      }),
      fetch(`${baseUrl}/orders/${order._id}/payments/${pay2._id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` }
      })
    ]);

    assert.strictEqual(app1Res.status, 200);
    assert.strictEqual(app2Res.status, 200);

    const freshOrder = await Order.findById(order._id);
    const dbPay1 = await Payment.findById(pay1._id);
    const dbPay2 = await Payment.findById(pay2._id);

    assert.strictEqual(dbPay1.status, 'Approved');
    assert.strictEqual(dbPay2.status, 'Approved');
    assert.strictEqual(freshOrder.advancePaid, 400000);
    assert.strictEqual(freshOrder.balanceDue, 100000);
    assert.strictEqual(freshOrder.paymentStatus, 'Partial');
    assert.strictEqual(freshOrder.orderStatus, 'Confirmed');

    assert.strictEqual(freshOrder.goldRateLock.minAdvanceRequired, 360000);
    assert.strictEqual(freshOrder.goldRateLock.isLocked, true);
    assert.strictEqual(freshOrder.goldRateLock.lockedRate, 419000);
    assert.ok(freshOrder.goldRateLock.lockedAt);
  });

  await testCase('25d. Lifecycle integrity: Rejected payment preserves Pending order status whereas first approved payment confirms order', async () => {
    const oRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Status Patron', email: 'statuspatron@test.com', phone: '03008889900' },
        items: [{ title: '22K Chain', purity: '22K', netWeight: 5, quantity: 1, price: 100000 }],
        totalAmount: 100000
      })
    });
    const order = (await oRes.json()).data;
    assert.strictEqual(order.orderStatus, 'Pending');

    const p1Res = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        bankAccount: activeBankHBL._id,
        amount: 25000,
        paymentReference: `REJ-ORDER-${Date.now()}`
      })
    });
    const pay1 = (await p1Res.json()).data;

    const rejRes = await fetch(`${baseUrl}/orders/${order._id}/payments/${pay1._id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ reason: 'Invalid bank receipt' })
    });
    const rejData = (await rejRes.json()).data;
    assert.strictEqual(rejRes.status, 200);
    assert.strictEqual(rejData.order.orderStatus, 'Pending');

    const dbOrderAfterRejection = await Order.findById(order._id);
    assert.strictEqual(dbOrderAfterRejection.orderStatus, 'Pending');
    assert.strictEqual(dbOrderAfterRejection.advancePaid, 0);

    const p2Res = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        bankAccount: activeBankHBL._id,
        amount: 30000,
        paymentReference: `APP-ORDER-${Date.now()}`
      })
    });
    const pay2 = (await p2Res.json()).data;

    const appRes = await fetch(`${baseUrl}/orders/${order._id}/payments/${pay2._id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const appData = (await appRes.json()).data;
    assert.strictEqual(appRes.status, 200);
    assert.strictEqual(appData.order.orderStatus, 'Confirmed');

    const dbOrderAfterApproval = await Order.findById(order._id);
    assert.strictEqual(dbOrderAfterApproval.orderStatus, 'Confirmed');
    assert.strictEqual(dbOrderAfterApproval.advancePaid, 30000);
  });

  await testCase('26. Valid lifecycle transitions: Order progresses through preparation and ready-for-pickup', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Lifecycle Patron', email: 'lifecycle@test.com', phone: '03001112233' },
        items: [{ title: '22K Polki Bangle', purity: '22K', netWeight: 12, quantity: 1, price: 450000 }],
        totalAmount: 450000
      })
    });
    const order = (await res.json()).data;
    assert.strictEqual(order.orderStatus, 'Pending');

    const toConf = await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Confirmed' })
    });
    assert.strictEqual(toConf.status, 200);
    assert.strictEqual((await toConf.json()).data.orderStatus, 'Confirmed');

    const toProc = await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Processing' })
    });
    assert.strictEqual(toProc.status, 200);
    assert.strictEqual((await toProc.json()).data.orderStatus, 'Processing');

    const toReady = await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Ready' })
    });
    assert.strictEqual(toReady.status, 200);
    assert.strictEqual((await toReady.json()).data.orderStatus, 'Ready');
  });

  await testCase('27. Showroom collection: Order collected from showroom records pickup timestamp and verifier', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Showroom Patron', email: 'showroom@test.com', phone: '03002223344' },
        items: [{ title: '22K Solitaire Ring', purity: '22K', netWeight: 8, quantity: 1, price: 280000 }],
        totalAmount: 280000
      })
    });
    const order = (await res.json()).data;

    await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Confirmed' })
    });
    await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Processing' })
    });
    await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Ready' })
    });

    capturedEmails.length = 0;
    const unauthCollect = await fetch(`${baseUrl}/orders/${order._id}/collect`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ collectedBy: 'Unauthorized Customer' })
    });
    assert.strictEqual(unauthCollect.status, 403);

    const collectRes = await fetch(`${baseUrl}/orders/${order._id}/collect`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        collectedBy: 'Showroom Patron (Self)',
        notes: 'Original CNIC verified, payment settled, gift box handed over'
      })
    });
    assert.strictEqual(collectRes.status, 200);
    const collectedOrder = (await collectRes.json()).data;
    assert.strictEqual(collectedOrder.orderStatus, 'Delivered');
    assert.ok(collectedOrder.collectionRecord.collectedAt);
    assert.strictEqual(collectedOrder.collectionRecord.collectedBy, 'Showroom Patron (Self)');
    assert.ok(collectedOrder.collectionRecord.verifiedBy);

    const dupCollectRes = await fetch(`${baseUrl}/orders/${order._id}/collect`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ collectedBy: 'Duplicate Attempt' })
    });
    assert.strictEqual(dupCollectRes.status, 400);
    assert.ok(/already been collected/i.test((await dupCollectRes.json()).message));

    const delivEmail = capturedEmails.find((e) => /Order Collected/i.test(e.subject));
    assert.ok(delivEmail);
    assert.strictEqual(delivEmail.to, 'showroom@test.com');
  });

  await testCase('28. Invalid lifecycle transitions blocked: Cannot skip states or alter terminal states', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Invalid Patron', email: 'invalid@test.com', phone: '03003334455' },
        items: [{ title: '22K Jhumka', purity: '22K', netWeight: 10, quantity: 1, price: 320000 }],
        totalAmount: 320000
      })
    });
    const order = (await res.json()).data;

    const skipRes = await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Delivered' })
    });
    assert.strictEqual(skipRes.status, 400);

    const prematureCollect = await fetch(`${baseUrl}/orders/${order._id}/collect`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ collectedBy: 'Test' })
    });
    assert.strictEqual(prematureCollect.status, 400);

    await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Cancelled' })
    });

    const alterCancelled = await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: 'Processing' })
    });
    assert.strictEqual(alterCancelled.status, 400);
  });

  await testCase('29. Unauthorized access guards: Customer cannot view payments or receipts of another customer', async () => {
    const otherCustomer = await User.create({
      name: 'Other Customer',
      email: `other_cust_${Date.now()}@test.com`,
      password: hashPassword('Password123!'),
      role: 'customer',
      authProvider: 'local'
    });
    const otherToken = jwt.sign(
      { id: otherCustomer._id.toString(), email: otherCustomer.email, role: 'customer' },
      ENV.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Owner Customer', email: customerUser.email, phone: '03004445566' },
        items: [{ title: '22K Ring', quantity: 1, price: 100000 }],
        totalAmount: 100000
      })
    });
    const order = (await res.json()).data;

    const payRes = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      headers: { Authorization: `Bearer ${otherToken}` }
    });
    assert.strictEqual(payRes.status, 403);

    const rcpRes = await fetch(`${baseUrl}/orders/${order._id}/receipts`, {
      headers: { Authorization: `Bearer ${otherToken}` }
    });
    assert.strictEqual(rcpRes.status, 403);

    const ownPay = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(ownPay.status, 200);

    const ownRcp = await fetch(`${baseUrl}/orders/${order._id}/receipts`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(ownRcp.status, 200);
  });

  await testCase('30. Data leak protection: Customer view does not expose internal notes, logs or staff email', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        customer: { name: 'Privacy Patron', email: customerUser.email, phone: '03005556677' },
        items: [{ title: '22K Bangles', quantity: 1, price: 300000 }],
        totalAmount: 300000,
        internalNotes: 'TOP SECRET INTERNAL AUDIT NOTE 9999'
      })
    });
    const order = (await res.json()).data;

    const paySubmit = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        amount: 300000,
        bankAccount: activeBankHBL._id.toString(),
        notes: 'STAFF PRIVATE NOTE'
      })
    });
    const pay = (await paySubmit.json()).data;

    await fetch(`${baseUrl}/orders/${order._id}/payments/${pay._id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const custOrderRes = await fetch(`${baseUrl}/orders/${order._id}`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const custOrder = (await custOrderRes.json()).data;
    assert.strictEqual(custOrder.internalNotes, undefined);
    assert.strictEqual(custOrder.notificationLog, undefined);

    const custPayRes = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const custPayments = (await custPayRes.json()).data;
    assert.strictEqual(custPayments[0].approvedBy, undefined);
    assert.strictEqual(custPayments[0].notes, undefined);

    const custRcpRes = await fetch(`${baseUrl}/orders/${order._id}/receipts`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const custReceipts = (await custRcpRes.json()).data;
    assert.strictEqual(custReceipts[0].approval.approvedBy, undefined);
  });

  await testCase('31. Accounting integrity: Order with approved payments cannot be deleted', async () => {
    const deleteRes = await fetch(`${baseUrl}/orders/${testOrder._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(deleteRes.status, 400);
    const body = await deleteRes.json();
    assert.strictEqual(body.success, false);
    assert.ok(/approved payments/i.test(body.message));
  });

  await testCase('32. Rate snapshot immutability on update: Order update cannot modify original rate snapshot', async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Immutable Patron', email: 'immutable@test.com', phone: '03009991122' },
        items: [{ title: '22K Bangles', purity: '22K', netWeight: 10, quantity: 1, price: 350000 }],
        totalAmount: 350000
      })
    });
    const order = (await res.json()).data;
    const originalSnapshotRate = order.goldRateLock.snapshotRate;
    assert.ok(originalSnapshotRate > 0);

    const updateRes = await fetch(`${baseUrl}/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        goldRateLock: {
          snapshotRate: 999999
        }
      })
    });
    const updated = (await updateRes.json()).data;
    assert.strictEqual(updated.goldRateLock.snapshotRate, originalSnapshotRate);
    assert.notStrictEqual(updated.goldRateLock.snapshotRate, 999999);
  });

  await testCase('33. Duplicate bank transaction reference guard: Duplicate reference in same order fails (Pending/Approved/Rejected)', async () => {
    const oRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Ref Patron', email: 'ref_patron@test.com', phone: '03001239999' },
        items: [{ title: '22K Ring', purity: '22K', netWeight: 5, quantity: 1, price: 100000 }],
        totalAmount: 100000
      })
    });
    const order = (await oRes.json()).data;

    const p1Res = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        bankAccount: activeBankHBL._id,
        amount: 20000,
        paymentReference: 'TRX-UNIQUE-001'
      })
    });
    assert.strictEqual(p1Res.status, 201);
    const p1 = (await p1Res.json()).data;

    const dupRes = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        bankAccount: activeBankHBL._id,
        amount: 15000,
        paymentReference: 'TRX-UNIQUE-001'
      })
    });
    assert.strictEqual(dupRes.status, 400);
    const dupBody = await dupRes.json();
    assert.ok(/already been submitted/i.test(dupBody.message));

    const caseInsensitiveRes = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        bankAccount: activeBankHBL._id,
        amount: 15000,
        paymentReference: 'trx-unique-001'
      })
    });
    assert.strictEqual(caseInsensitiveRes.status, 400);

    const rejRes = await fetch(`${baseUrl}/orders/${order._id}/payments/${p1._id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ reason: 'Unverified transaction slip' })
    });
    assert.strictEqual(rejRes.status, 200);

    const afterRejRes = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        bankAccount: activeBankHBL._id,
        amount: 25000,
        paymentReference: 'TRX-UNIQUE-001'
      })
    });
    assert.strictEqual(afterRejRes.status, 400);
    const afterRejBody = await afterRejRes.json();
    assert.ok(/already been submitted/i.test(afterRejBody.message));

    const storedPayment = await Payment.findById(p1._id);
    assert.strictEqual(storedPayment.paymentReference, 'TRX-UNIQUE-001');
  });

  await testCase('34. Concurrency guard: Parallel duplicate payment reference submissions allow only one and reject duplicates with 400', async () => {
    const oRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Concurrent Patron', email: 'concurrent@test.com', phone: '03009998877' },
        items: [{ title: '22K Chain', purity: '22K', netWeight: 8, quantity: 1, price: 150000 }],
        totalAmount: 150000
      })
    });
    const order = (await oRes.json()).data;
    const ref = `CONCUR-TRX-${Date.now()}`;

    const requests = Array.from({ length: 5 }, () =>
      fetch(`${baseUrl}/orders/${order._id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
        body: JSON.stringify({
          bankAccount: activeBankHBL._id,
          amount: 20000,
          paymentReference: ref
        })
      })
    );

    const responses = await Promise.all(requests);
    const statuses = responses.map((r) => r.status);
    const successes = statuses.filter((s) => s === 201).length;
    const failures = statuses.filter((s) => s === 400).length;

    assert.strictEqual(successes, 1);
    assert.strictEqual(failures, 4);

    const dbPayments = await Payment.find({ orderId: order._id, paymentReference: ref.toUpperCase() });
    assert.strictEqual(dbPayments.length, 1);
    assert.strictEqual(dbPayments[0].paymentReference, ref.toUpperCase());
  });

  await testCase('35. Notification audit: Missing customer email records safe skipped status and reason in notificationLog', async () => {
    const oRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { name: 'No Email Patron', email: '', phone: '03001235555' },
        items: [{ title: '22K Pendant', purity: '22K', netWeight: 3, quantity: 1, price: 60000 }],
        totalAmount: 60000
      })
    });
    const order = (await oRes.json()).data;
    assert.strictEqual(order.customer.email, '');

    const notifResult = await sendCustomerOrderStatusEmail({ order, newStatus: 'Ready' });
    assert.strictEqual(notifResult.delivered, false);
    assert.strictEqual(notifResult.status, 'skipped');
    assert.strictEqual(notifResult.reason, 'missing_recipient');

    const refreshed = await Order.findById(order._id);
    assert.ok(refreshed.notificationLog.length >= 1);
    const lastEntry = refreshed.notificationLog[refreshed.notificationLog.length - 1];
    assert.strictEqual(lastEntry.status, 'skipped');
    assert.strictEqual(lastEntry.reason, 'missing_recipient');
    assert.strictEqual(lastEntry.recipient, '');
    assert.strictEqual(lastEntry.recipient, '');
  });

  await testCase('36. Notification audit: SMTP failure records failed status and smtp_error reason in notificationLog', async () => {
    setTestTransporter({
      sendMail: async () => {
        throw new Error('SMTP connection refused');
      }
    });

    const oRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'SMTP Fail Patron', email: 'smtp_fail_patron@test.com', phone: '03007776655' },
        items: [{ title: '22K Locket', purity: '22K', netWeight: 4, quantity: 1, price: 80000 }],
        totalAmount: 80000
      })
    });
    const order = (await oRes.json()).data;

    const notifResult = await sendCustomerOrderStatusEmail({ order, newStatus: 'Ready' });
    assert.strictEqual(notifResult.delivered, false);
    assert.strictEqual(notifResult.status, 'failed');
    assert.strictEqual(notifResult.reason, 'smtp_error');

    const refreshed = await Order.findById(order._id);
    assert.ok(refreshed.notificationLog.length >= 1);
    const lastEntry = refreshed.notificationLog[refreshed.notificationLog.length - 1];
    assert.strictEqual(lastEntry.status, 'failed');
    assert.strictEqual(lastEntry.reason, 'smtp_error');
    assert.strictEqual(lastEntry.recipient, 'smtp_fail_patron@test.com');
  });

  await testCase('37. 1.5mm Stone rule verification: Stones <=1.5mm count in gold weight; stones >1.5mm deduct from gross weight', async () => {
    const under15 = calculateItemNetWeight({ grossWeight: 10, stoneWeight: 2, stoneSizeMm: 1.2 });
    assert.strictEqual(under15, 10);

    const exact15 = calculateItemNetWeight({ grossWeight: 10, stoneWeight: 2, stoneSizeMm: 1.5 });
    assert.strictEqual(exact15, 10);

    const over15 = calculateItemNetWeight({ grossWeight: 10, stoneWeight: 2, stoneSizeMm: 2.5 });
    assert.strictEqual(over15, 8);
  });

  await testCase('38. 90% threshold sensitivity: Exact 90% locks gold rate; 89.99% does NOT lock rate', async () => {
    const lockSpec = { pureGoldValue: 100000, minAdvanceRequired: 90000, snapshotRate: 419000 };

    const belowThreshold = evaluateRateLock(lockSpec, 89990);
    assert.strictEqual(belowThreshold.isLocked, false);
    assert.strictEqual(belowThreshold.lockedRate, 0);

    const exactThreshold = evaluateRateLock(lockSpec, 90000);
    assert.strictEqual(exactThreshold.isLocked, true);
    assert.strictEqual(exactThreshold.lockedRate, 419000);
  });

  await testCase('39. Missing required calculation data (weight/purity) blocks gold rate lock from activating', async () => {
    const missingWeight = evaluateRateLock({ pureGoldValue: 0, minAdvanceRequired: 0, snapshotRate: 419000 }, 100000);
    assert.strictEqual(missingWeight.isLocked, false);

    const missingMin = evaluateRateLock({ pureGoldValue: 100000, minAdvanceRequired: 0, snapshotRate: 419000 }, 100000);
    assert.strictEqual(missingMin.isLocked, false);
  });

  await testCase('40. Reference normalization: lowercase input is stored as uppercase and DB unique constraint enforces normalized value', async () => {
    const oRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customer: { name: 'Normalize Patron', email: 'normalize@test.com', phone: '03002223333' },
        items: [{ title: '22K Earrings', purity: '22K', netWeight: 3, quantity: 1, price: 60000 }],
        totalAmount: 60000
      })
    });
    const order = (await oRes.json()).data;

    const p1Res = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        bankAccount: activeBankHBL._id,
        amount: 15000,
        paymentReference: 'norm-trx-lowercase-999'
      })
    });
    assert.strictEqual(p1Res.status, 201);
    const p1 = (await p1Res.json()).data;

    assert.strictEqual(p1.paymentReference, 'NORM-TRX-LOWERCASE-999');

    const storedRaw = await Payment.findById(p1._id).lean();
    assert.strictEqual(storedRaw.paymentReference, 'NORM-TRX-LOWERCASE-999');

    const dupUpperRes = await fetch(`${baseUrl}/orders/${order._id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        bankAccount: activeBankHBL._id,
        amount: 15000,
        paymentReference: 'NORM-TRX-LOWERCASE-999'
      })
    });
    assert.strictEqual(dupUpperRes.status, 400);
    const dupBody = await dupUpperRes.json();
    assert.ok(/already been submitted/i.test(dupBody.message));
  });

  await testCase('41. Schema-level setter: direct model instantiations, property assignments, and create() normalize reference', async () => {
    const rawDoc = new Payment({
      orderId: testOrder._id,
      orderNumber: testOrder.orderNumber,
      customer: { name: 'Direct Patron', phone: '03001112233' },
      amount: 10000,
      bankAccount: activeBankHBL._id,
      bankAccountSnapshot: { bankName: 'HBL' },
      paymentReference: '   lowercase-untrimmed-ref-001   '
    });
    assert.strictEqual(rawDoc.paymentReference, 'LOWERCASE-UNTRIMMED-REF-001');

    rawDoc.paymentReference = '   another-mixed-ref-002   ';
    assert.strictEqual(rawDoc.paymentReference, 'ANOTHER-MIXED-REF-002');

    const created = await Payment.create({
      orderId: testOrder._id,
      orderNumber: testOrder.orderNumber,
      customer: { name: 'Direct Patron', phone: '03001112233' },
      amount: 12000,
      bankAccount: activeBankHBL._id,
      bankAccountSnapshot: { bankName: 'HBL' },
      paymentReference: '   direct-created-trx-003   '
    });
    assert.strictEqual(created.paymentReference, 'DIRECT-CREATED-TRX-003');

    const queried = await Payment.findById(created._id).lean();
    assert.strictEqual(queried.paymentReference, 'DIRECT-CREATED-TRX-003');

    let duplicateThrew = false;
    try {
      await Payment.create({
        orderId: testOrder._id,
        orderNumber: testOrder.orderNumber,
        customer: { name: 'Direct Patron', phone: '03001112233' },
        amount: 12000,
        bankAccount: activeBankHBL._id,
        bankAccountSnapshot: { bankName: 'HBL' },
        paymentReference: 'direct-created-trx-003'
      });
    } catch (err) {
      duplicateThrew = err.code === 11000;
    }
    assert.strictEqual(duplicateThrew, true);
  });

  await testCase('42. Legacy payment reference audit: dry-run accurately categorizes whitespace, mixed-case, empty, and duplicates without mutation', async () => {
    const dummyOrderId1 = '6ae711111111111111111111';
    const dummyOrderId2 = '6ae722222222222222222222';

    const fixtureRecords = [
      {
        _id: 'pay01',
        orderId: dummyOrderId1,
        orderNumber: 'KS-ORD-01',
        paymentReference: 'TRX-CLEAN-01',
        status: 'Approved'
      },
      {
        _id: 'pay02',
        orderId: dummyOrderId1,
        orderNumber: 'KS-ORD-01',
        paymentReference: 'trx-mixed-case-02',
        status: 'Approved'
      },
      {
        _id: 'pay03',
        orderId: dummyOrderId1,
        orderNumber: 'KS-ORD-01',
        paymentReference: '   TRX-WHITESPACE-03   ',
        status: 'Pending'
      },
      {
        _id: 'pay04',
        orderId: dummyOrderId1,
        orderNumber: 'KS-ORD-01',
        paymentReference: '',
        status: 'Pending'
      },
      {
        _id: 'pay05',
        orderId: dummyOrderId2,
        orderNumber: 'KS-ORD-02',
        paymentReference: 'DUP-REF-100',
        status: 'Approved'
      },
      {
        _id: 'pay06',
        orderId: dummyOrderId2,
        orderNumber: 'KS-ORD-02',
        paymentReference: 'dup-ref-100',
        status: 'Pending'
      }
    ];

    const auditResult = await auditLegacyPaymentReferences(fixtureRecords);
    assert.strictEqual(auditResult.dryRun, true);
    assert.strictEqual(auditResult.totalRecords, 6);
    assert.strictEqual(auditResult.emptyOrMissingCount, 1);
    assert.strictEqual(auditResult.emptyOrMissing[0].paymentId, 'pay04');

    assert.strictEqual(auditResult.whitespaceIssuesCount, 1);
    assert.strictEqual(auditResult.whitespaceIssues[0].paymentId, 'pay03');

    assert.strictEqual(auditResult.mixedCaseIssuesCount, 2);
    const mixedIds = auditResult.mixedCaseIssues.map((r) => r.paymentId);
    assert.ok(mixedIds.includes('pay02'));
    assert.ok(mixedIds.includes('pay06'));

    assert.strictEqual(auditResult.duplicateGroupsCount, 1);
    const dupGroup = auditResult.duplicateGroups[0];
    assert.strictEqual(dupGroup.orderId, dummyOrderId2);
    assert.strictEqual(dupGroup.normalizedReference, 'DUP-REF-100');
    assert.strictEqual(dupGroup.count, 2);
    assert.strictEqual(dupGroup.hasCaseConflict, true);

    assert.strictEqual(fixtureRecords[1].paymentReference, 'trx-mixed-case-02');
    assert.strictEqual(fixtureRecords[2].paymentReference, '   TRX-WHITESPACE-03   ');
  });

  await testCase('43. Legacy payment reference audit: dry-run queries database and preserves all stored documents', async () => {
    const auditRes = await auditLegacyPaymentReferences({});
    assert.strictEqual(auditRes.dryRun, true);
    assert.ok(typeof auditRes.totalRecords === 'number');
    assert.ok(auditRes.totalRecords > 0);
    assert.ok(Array.isArray(auditRes.duplicateGroups));
    assert.ok(Array.isArray(auditRes.emptyOrMissing));
    assert.ok(Array.isArray(auditRes.whitespaceIssues));
    assert.ok(Array.isArray(auditRes.mixedCaseIssues));
  });

  await new Promise((resolve) => server.close(resolve));
  await teardownTestDatabase(dbContext);

  console.log(`\n========================================`);
  console.log(`ORDER PAYMENT TESTS TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
};

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
