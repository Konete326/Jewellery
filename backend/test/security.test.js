import assert from 'node:assert/strict';
import http from 'node:http';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { setupTestDatabase, teardownTestDatabase, assertSafeTestDatabase, isSafeTestDatabase } from './testDatabase.js';
import { User } from '../src/modules/users/user.model.js';
import { Order } from '../src/modules/orders/order.model.js';
import { hashPassword, needsRehash } from '../src/modules/users/user.password.js';
import { ENV, parseTrustProxy } from '../src/config/env.js';
import { userAdminService } from '../src/modules/users/user.admin.service.js';

process.env.NODE_ENV = 'test';
process.env.TEST_AUTH_RATE_LIMIT = '10';
process.env.TEST_ORDER_RATE_LIMIT = '15';
process.env.TEST_TRACKING_RATE_LIMIT = '15';

const runTests = async () => {
  const dbContext = await setupTestDatabase();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;
  const v1BaseUrl = `http://127.0.0.1:${port}/api/v1`;

  const adminUser = await User.create({
    name: 'Security Test Admin',
    email: `test_admin_${Date.now()}@test.com`,
    password: hashPassword('Password123!'),
    role: 'admin',
    authProvider: 'local'
  });

  const customerUser = await User.create({
    name: 'Security Test Customer',
    email: `test_customer_${Date.now()}@test.com`,
    password: hashPassword('Password123!'),
    role: 'customer',
    authProvider: 'local'
  });

  const staffUser = await User.create({
    name: 'Security Test Staff',
    email: `test_staff_${Date.now()}@test.com`,
    password: hashPassword('Password123!'),
    role: 'staff',
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

  const staffToken = jwt.sign(
    { id: staffUser._id.toString(), email: staffUser.email, role: 'staff' },
    ENV.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const expiredToken = jwt.sign(
    { id: customerUser._id.toString(), email: customerUser.email, role: 'customer' },
    ENV.JWT_SECRET,
    { expiresIn: '-1s' }
  );

  const results = [];

  const testCase = async (name, fn) => {
    try {
      await fn();
      results.push({ name, status: 'VERIFIED PASS' });
      console.log(`[PASS] ${name}`);
    } catch (err) {
      results.push({ name, status: 'VERIFIED FAIL', error: err.message });
      console.error(`[FAIL] ${name}: ${err.message}`);
    }
  };

  await testCase('1. Test database isolation active & verified safe', async () => {
    assert.strictEqual(isSafeTestDatabase(dbContext.uri, dbContext.connection), true);
    assert.doesNotThrow(() => assertSafeTestDatabase(dbContext.connection));
  });

  await testCase('2. Production database safety guard blocks non-test connection strings', async () => {
    const fakeProdConn = {
      name: 'khalil_and_sons',
      host: 'cluster0.mongodb.net',
      _connectionString: 'mongodb+srv://admin:pass@cluster0.mongodb.net/khalil_and_sons'
    };
    assert.throws(
      () => assertSafeTestDatabase(fakeProdConn),
      /SAFETY VIOLATION/
    );
  });

  await testCase('2b. Production database safety guard blocks production URI even with test substring', async () => {
    const originalProd = process.env.MONGODB_URI;
    const testCases = [
      { uri: 'mongodb+srv://admin:pass@cluster0.mongodb.net/test_production_db', name: 'test_production_db', host: 'cluster0.mongodb.net' },
      { uri: 'mongodb+srv://admin:pass@test-cluster.mongodb.net/khalil_prod', name: 'khalil_prod', host: 'test-cluster.mongodb.net' },
      { uri: 'mongodb+srv://test_user:pass@cluster0.mongodb.net/khalil_prod', name: 'khalil_prod', host: 'cluster0.mongodb.net' }
    ];
    for (const tc of testCases) {
      process.env.MONGODB_URI = tc.uri;
      const fakeConn = { name: tc.name, host: tc.host, _connectionString: tc.uri };
      assert.strictEqual(isSafeTestDatabase(tc.uri, fakeConn), false);
      assert.throws(() => assertSafeTestDatabase(tc.uri, fakeConn), /SAFETY VIOLATION/);
    }
    process.env.MONGODB_URI = originalProd;
  });

  await testCase('2c. Safety guard blocks unknown remote URIs and missing URIs', async () => {
    assert.strictEqual(isSafeTestDatabase('', null), false);
    assert.throws(() => assertSafeTestDatabase('', null), /SAFETY VIOLATION/);
    const unknownRemote = { name: 'external_db', host: 'random-host.com', _connectionString: 'mongodb+srv://user:pass@random-host.com/external_db' };
    assert.strictEqual(isSafeTestDatabase(unknownRemote._connectionString, unknownRemote), false);
    assert.throws(() => assertSafeTestDatabase(unknownRemote), /SAFETY VIOLATION/);
  });

  await testCase('2d. TRUST_PROXY configuration safely parses unset, numeric, boolean, and subnet values', async () => {
    assert.strictEqual(parseTrustProxy(undefined), false);
    assert.strictEqual(parseTrustProxy(null), false);
    assert.strictEqual(parseTrustProxy(''), false);
    assert.strictEqual(parseTrustProxy('0'), false);
    assert.strictEqual(parseTrustProxy('false'), false);
    assert.strictEqual(parseTrustProxy('1'), 1);
    assert.strictEqual(parseTrustProxy('2'), 2);
    assert.strictEqual(parseTrustProxy('true'), true);
    assert.strictEqual(parseTrustProxy('loopback'), 'loopback');
    assert.strictEqual(parseTrustProxy('127.0.0.1, 10.0.0.0/8'), '127.0.0.1, 10.0.0.0/8');
  });

  await testCase('2e. Dedicated test database safety: local without test is blocked and MONGO_URI_TEST matching prod is blocked', async () => {
    const localNonTest = { name: 'khalil_and_sons', host: 'localhost', _connectionString: 'mongodb://localhost:27017/khalil_and_sons' };
    assert.strictEqual(isSafeTestDatabase(localNonTest._connectionString, localNonTest), false);
    assert.throws(() => assertSafeTestDatabase(localNonTest), /SAFETY VIOLATION/);

    const origTest = process.env.MONGO_URI_TEST;
    const origProd = process.env.MONGODB_URI;
    process.env.MONGODB_URI = 'mongodb+srv://admin:pass@cluster0.mongodb.net/khalil_test';
    process.env.MONGO_URI_TEST = 'mongodb+srv://admin:pass@cluster0.mongodb.net/khalil_test';
    assert.strictEqual(isSafeTestDatabase(process.env.MONGO_URI_TEST), false);
    assert.throws(() => assertSafeTestDatabase(process.env.MONGO_URI_TEST), /SAFETY VIOLATION/);
    process.env.MONGO_URI_TEST = origTest;
    process.env.MONGODB_URI = origProd;
  });

  await testCase('2f. Rate limiting identity spoofing test: TRUST_PROXY=true trusts client headers, whereas FALSE and numeric hop protect identity', async () => {
    const directReq = await fetch(`${baseUrl}/health`, {
      headers: { 'X-Forwarded-For': '198.51.100.123' }
    });
    assert.strictEqual(directReq.status, 200);

    const testAppDefault = (await import('express')).default();
    testAppDefault.set('trust proxy', parseTrustProxy(undefined));
    testAppDefault.get('/ip-test', (req, res) => res.json({ ip: req.ip }));
    const srvDefault = http.createServer(testAppDefault);
    await new Promise((res) => srvDefault.listen(0, res));
    const portDefault = srvDefault.address().port;
    const resDefault = await fetch(`http://127.0.0.1:${portDefault}/ip-test`, {
      headers: { 'X-Forwarded-For': '203.0.113.195' }
    });
    const dataDefault = await resDefault.json();
    assert.strictEqual(dataDefault.ip.includes('127.0.0.1'), true);
    assert.notStrictEqual(dataDefault.ip, '203.0.113.195');
    await new Promise((res) => srvDefault.close(res));

    const testAppFalse = (await import('express')).default();
    testAppFalse.set('trust proxy', false);
    testAppFalse.get('/ip-test', (req, res) => res.json({ ip: req.ip }));
    const srvFalse = http.createServer(testAppFalse);
    await new Promise((res) => srvFalse.listen(0, res));
    const portFalse = srvFalse.address().port;
    const resFalse = await fetch(`http://127.0.0.1:${portFalse}/ip-test`, {
      headers: { 'X-Forwarded-For': '203.0.113.195' }
    });
    const dataFalse = await resFalse.json();
    assert.strictEqual(dataFalse.ip.includes('127.0.0.1'), true);
    assert.notStrictEqual(dataFalse.ip, '203.0.113.195');
    await new Promise((res) => srvFalse.close(res));

    const testAppHop = (await import('express')).default();
    testAppHop.set('trust proxy', 1);
    testAppHop.get('/ip-test', (req, res) => res.json({ ip: req.ip }));
    const srvHop = http.createServer(testAppHop);
    await new Promise((res) => srvHop.listen(0, res));
    const portHop = srvHop.address().port;
    const resHop = await fetch(`http://127.0.0.1:${portHop}/ip-test`, {
      headers: { 'X-Forwarded-For': '198.51.100.1, 203.0.113.195' }
    });
    const dataHop = await resHop.json();
    assert.strictEqual(dataHop.ip, '203.0.113.195');
    await new Promise((res) => srvHop.close(res));

    const testAppTrue = (await import('express')).default();
    testAppTrue.set('trust proxy', true);
    testAppTrue.get('/ip-test', (req, res) => res.json({ ip: req.ip }));
    const srvTrue = http.createServer(testAppTrue);
    await new Promise((res) => srvTrue.listen(0, res));
    const portTrue = srvTrue.address().port;
    const resTrue = await fetch(`http://127.0.0.1:${portTrue}/ip-test`, {
      headers: { 'X-Forwarded-For': '203.0.113.195' }
    });
    const dataTrue = await resTrue.json();
    assert.strictEqual(dataTrue.ip, '203.0.113.195');
    await new Promise((res) => srvTrue.close(res));
  });

  await testCase('3. Public rates endpoint works without token on /api and /api/v1 (200)', async () => {
    const res = await fetch(`${baseUrl}/rates`);
    assert.strictEqual(res.status, 200);
    const resV1 = await fetch(`${v1BaseUrl}/rates`);
    assert.strictEqual(resV1.status, 200);
  });

  await testCase('4. Public categories endpoint works without token (200)', async () => {
    const res = await fetch(`${baseUrl}/categories`);
    assert.strictEqual(res.status, 200);
    const resV1 = await fetch(`${v1BaseUrl}/categories`);
    assert.strictEqual(resV1.status, 200);
  });

  await testCase('5. Public inquiry submission works with validation (201)', async () => {
    const res = await fetch(`${baseUrl}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Test Patron',
        email: 'patron@example.com',
        phone: '+923001234567',
        subject: 'Bespoke Inquiries Testing',
        message: 'Requesting valuation estimate for heirloom ring.'
      })
    });
    assert.strictEqual(res.status, 201);
  });

  await testCase('6. Request admin API without token returns 401', async () => {
    const res = await fetch(`${baseUrl}/users`);
    assert.strictEqual(res.status, 401);
  });

  await testCase('7. Request admin API with invalid token returns 401', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      headers: { Authorization: 'Bearer invalid_signature_token_xyz' }
    });
    assert.strictEqual(res.status, 401);
  });

  await testCase('8. Request admin API with expired token returns 401', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      headers: { Authorization: `Bearer ${expiredToken}` }
    });
    assert.strictEqual(res.status, 401);
  });

  await testCase('9. Customer requesting admin API returns 403', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 403);
  });

  await testCase('10. Staff requesting admin-only operation returns 403', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      headers: { Authorization: `Bearer ${staffToken}` }
    });
    assert.strictEqual(res.status, 403);
  });

  await testCase('11. Admin requesting authorized operation is Allowed (200)', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
  });

  await testCase('12. Unauthenticated role update returns 401', async () => {
    const res = await fetch(`${baseUrl}/users/${customerUser._id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin' })
    });
    assert.strictEqual(res.status, 401);
  });

  await testCase('13. Customer role escalation returns 403', async () => {
    const res = await fetch(`${baseUrl}/users/${customerUser._id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ role: 'admin' })
    });
    assert.strictEqual(res.status, 403);
  });

  await testCase('14. Customer accessing another user wishlist returns 403', async () => {
    const res = await fetch(`${baseUrl}/users/wishlist/someoneelse@example.com`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 403);
  });

  await testCase('15. Customer accessing own wishlist is Allowed (200)', async () => {
    const res = await fetch(`${baseUrl}/users/wishlist/${encodeURIComponent(customerUser.email)}`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 200);
  });

  await testCase('16. Profile /me endpoint returns authenticated user (200)', async () => {
    const res = await fetch(`${baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.email, customerUser.email);
  });

  await testCase('17. Role escalation protection blocks demoting last remaining admin', async () => {
    const totalAdmins = await User.countDocuments({ role: 'admin', isActive: true });
    if (totalAdmins === 1) {
      await assert.rejects(
        async () => {
          await userAdminService.updateUserRole(adminUser._id, 'customer', adminUser);
        },
        /Cannot/
      );
    } else {
      assert.ok(totalAdmins >= 1);
    }
  });

  await testCase('18. Normal login request succeeds without premature blocking', async () => {
    const res = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: customerUser.email,
        password: 'Password123!'
      })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.token);
  });

  await testCase('18b. Registration payload role:admin is discarded and defaults to customer', async () => {
    const maliciousPayload = {
      name: 'Malicious Registration Patron',
      email: `malicious_${Date.now()}@test.com`,
      password: 'Password123!',
      role: 'admin'
    };
    const res = await fetch(`${v1BaseUrl}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(maliciousPayload)
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.user.role, 'customer');

    const createdUser = await User.findOne({ email: maliciousPayload.email.toLowerCase() });
    assert.ok(createdUser);
    assert.strictEqual(createdUser.role, 'customer');
  });

  await testCase('18c. Legacy 1,000-iteration PBKDF2 hash verifies and allows login', async () => {
    const crypto = await import('crypto');
    const salt = crypto.randomBytes(16).toString('hex');
    const legacyHash = crypto.pbkdf2Sync('LegacyPass123!', salt, 1000, 64, 'sha512').toString('hex');
    const legacyCombined = `${salt}:${legacyHash}`;

    const legacyUser = await User.create({
      name: 'Legacy User',
      email: `legacy_${Date.now()}@test.com`,
      password: legacyCombined,
      role: 'customer',
      authProvider: 'local'
    });

    const res = await fetch(`${v1BaseUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: legacyUser.email, password: 'LegacyPass123!' })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data?.token);
  });

  await testCase('18d. Successful login migrates legacy hash to 220,000 iterations in DB', async () => {
    const crypto = await import('crypto');
    const salt = crypto.randomBytes(16).toString('hex');
    const legacyHash = crypto.pbkdf2Sync('UpgradePass123!', salt, 1000, 64, 'sha512').toString('hex');
    const legacyCombined = `${salt}:${legacyHash}`;
    const email = `upgrade_${Date.now()}@test.com`;

    const user = await User.create({
      name: 'Upgrade User',
      email,
      password: legacyCombined,
      role: 'customer',
      authProvider: 'local'
    });

    assert.strictEqual(needsRehash(user.password), true);

    const loginRes = await fetch(`${v1BaseUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'UpgradePass123!' })
    });
    assert.strictEqual(loginRes.status, 200);

    const updatedUser = await User.findOne({ email });
    assert.strictEqual(needsRehash(updatedUser.password), false);
    assert.match(updatedUser.password, /^pbkdf2:sha512:220000:[a-f0-9]{32}:[a-f0-9]{128}$/);

    const nextLogin = await fetch(`${v1BaseUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'UpgradePass123!' })
    });
    assert.strictEqual(nextLogin.status, 200);
  });

  await testCase('18e. New user registration automatically uses 220,000 iterations in canonical format', async () => {
    const email = `newreg_${Date.now()}@test.com`;
    const regRes = await fetch(`${v1BaseUrl}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Reg User', email, password: 'NewSecurePass123!' })
    });
    assert.strictEqual(regRes.status, 201);

    const registeredUser = await User.findOne({ email });
    assert.match(registeredUser.password, /^pbkdf2:sha512:220000:[a-f0-9]{32}:[a-f0-9]{128}$/);
    assert.strictEqual(needsRehash(registeredUser.password), false);
  });

  await testCase('19. Rate limiting triggers HTTP 429 when threshold exceeded', async () => {
    let blockedRes = null;
    for (let i = 0; i < 15; i++) {
      const res = await fetch(`${v1BaseUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'rate_test@test.com', password: 'bad' })
      });
      if (res.status === 429) {
        blockedRes = res;
        break;
      }
    }

    assert.ok(blockedRes, 'Expected rate limiter to return 429');
    assert.strictEqual(blockedRes.status, 429);
    const blockedBody = await blockedRes.json();
    assert.strictEqual(blockedBody.success, false);
    assert.strictEqual(blockedBody.statusCode, 429);
    assert.match(blockedBody.message, /Too many/);
  });

  let sizedOrderId = null;
  let sizedOrderNumber = null;

  await testCase('19b. Order creation with structured jewellery size preserves size', async () => {
    const res = await fetch(`${v1BaseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          name: 'Sarah Tariq',
          email: 'sarah.tariq@test.com',
          phone: '03331122334',
          shippingAddress: 'Phase 6, DHA, Karachi',
          city: 'Karachi'
        },
        items: [
          {
            title: '22K Kundan Kara / Bangle',
            category: 'Bangle',
            purity: '22K',
            size: '2.6',
            quantity: 2,
            price: 380000
          }
        ],
        totalAmount: 760000,
        advancePaid: 200000
      })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.items[0].size, '2.6');
    sizedOrderId = body.data._id;
    sizedOrderNumber = body.data.orderNumber;
  });

  await testCase('19c. Size-less legacy order creation defaults size to empty string without breaking', async () => {
    const res = await fetch(`${v1BaseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          name: 'Legacy Buyer',
          email: 'legacy.buyer@test.com',
          phone: '03211234567',
          shippingAddress: 'Saddar, Karachi',
          city: 'Karachi'
        },
        items: [
          {
            title: '22K Gold Coin 10g',
            category: 'Bullion',
            purity: '24K',
            quantity: 1,
            price: 280000
          }
        ],
        totalAmount: 280000
      })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.items[0].size, '');
  });

  await testCase('19d. Order creation with temporary [Size: ...] in title preserves title and extracts size', async () => {
    const res = await fetch(`${v1BaseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          name: 'Mariam Ali',
          email: 'mariam.ali@test.com',
          phone: '03457788990',
          shippingAddress: 'Clifton, Karachi',
          city: 'Karachi'
        },
        items: [
          {
            title: 'Artisanal Solitaire Ring [Size: 14]',
            category: 'Ring',
            purity: '21K',
            quantity: 1,
            price: 165000
          }
        ],
        totalAmount: 165000,
        customerNote: 'Need gift wrapping and box certification'
      })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.items[0].size, '14');
    assert.strictEqual(body.data.items[0].title, 'Artisanal Solitaire Ring [Size: 14]');
  });

  await testCase('19e. Order creation with invalid size type returns 400 validation error', async () => {
    const res = await fetch(`${v1BaseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          name: 'Invalid Test User',
          phone: '03001234567'
        },
        items: [
          {
            title: 'Gold Ring',
            size: 12345,
            quantity: 1,
            price: 50000
          }
        ],
        totalAmount: 50000
      })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.message, 'Validation failed');
  });

  await testCase('19f. Order retrieval returns size in admin details and customer tracking response', async () => {
    assert.ok(sizedOrderId && sizedOrderNumber, 'Expected sized order to exist from 19b');

    const adminRes = await fetch(`${v1BaseUrl}/orders/${sizedOrderId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(adminRes.status, 200);
    const adminBody = await adminRes.json();
    assert.strictEqual(adminBody.data.items[0].size, '2.6');

    const trackRes = await fetch(`${v1BaseUrl}/orders/number/${sizedOrderNumber}`, {
      headers: { 'x-order-phone': '03331122334' }
    });
    assert.strictEqual(trackRes.status, 200);
    const trackBody = await trackRes.json();
    assert.strictEqual(trackBody.data.items[0].size, '2.6');
  });

  await testCase('20. Order creation route rate limiting returns 429 when limit exceeded', async () => {
    let blockedOrder = null;
    for (let i = 0; i < 20; i++) {
      const res = await fetch(`${v1BaseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: 'Spam Bot',
            email: 'bot@spam.com',
            phone: '03001234567',
            shippingAddress: 'Nowhere'
          },
          items: [{ title: 'Gold Ring', quantity: 1, price: 50000 }]
        })
      });
      if (res.status === 429) {
        blockedOrder = res;
        break;
      }
    }

    assert.ok(blockedOrder, 'Expected order rate limiter to return 429');
    assert.strictEqual(blockedOrder.status, 429);
    const orderBody = await blockedOrder.json();
    assert.strictEqual(orderBody.success, false);
    assert.strictEqual(orderBody.statusCode, 429);
  });

  await testCase('21. Public browsing remains unblocked even after auth rate limits hit', async () => {
    const ratesRes = await fetch(`${baseUrl}/rates`);
    assert.strictEqual(ratesRes.status, 200);

    const categoriesRes = await fetch(`${baseUrl}/categories`);
    assert.strictEqual(categoriesRes.status, 200);
  });

  await testCase('22. Order tracking with non-existent order number returns 404', async () => {
    const res = await fetch(`${v1BaseUrl}/orders/number/KS-NONEXISTENT-9999?phone=03333213613`);
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.match(body.message, /not found/i);
  });

  await testCase('23. Order tracking without phone parameter returns 400 verification error', async () => {
    const testOrder = await Order.create({
      orderNumber: `KS-TEST-${Date.now()}-1111`,
      customer: {
        name: 'Fatima Zahra',
        email: 'fatima@test.com',
        phone: '03333213613',
        shippingAddress: 'House 123, Street 4, Clifton, Karachi',
        city: 'Karachi'
      },
      items: [{ title: '22K Bridal Necklace', quantity: 1, price: 450000, purity: '22K' }],
      totalAmount: 450000,
      orderStatus: 'Confirmed',
      paymentStatus: 'Paid'
    });

    const res = await fetch(`${v1BaseUrl}/orders/number/${testOrder.orderNumber}`);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.match(body.message, /Verification required/i);
  });

  await testCase('24. Order tracking with incorrect phone returns 403 forbidden', async () => {
    const testOrder = await Order.create({
      orderNumber: `KS-TEST-${Date.now()}-2222`,
      customer: {
        name: 'Bilal Ahmed',
        email: 'bilal@test.com',
        phone: '03001234567',
        shippingAddress: 'Apartment 5B, Saddar, Karachi',
        city: 'Karachi'
      },
      items: [{ title: '22K Gold Bangle', quantity: 1, price: 200000 }],
      totalAmount: 200000
    });

    const res = await fetch(`${v1BaseUrl}/orders/number/${testOrder.orderNumber}?phone=03219999999`);
    assert.strictEqual(res.status, 403);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.match(body.message, /Verification failed/i);
  });

  await testCase('24b. Order tracking rejects near-match phone numbers sharing identical suffix', async () => {
    const testOrder = await Order.create({
      orderNumber: `KS-TEST-${Date.now()}-2222b`,
      customer: {
        name: 'Zainab Bibi',
        email: 'zainab@test.com',
        phone: '03333213613',
        shippingAddress: 'Defence Phase 5, Karachi',
        city: 'Karachi'
      },
      items: [{ title: '22K Gold Chain', quantity: 1, price: 150000 }],
      totalAmount: 150000
    });

    const res = await fetch(`${v1BaseUrl}/orders/number/${testOrder.orderNumber}?phone=03003213613`);
    assert.strictEqual(res.status, 403);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.match(body.message, /Verification failed/i);
  });

  await testCase('24c. Order tracking rejects incomplete or truncated phone numbers', async () => {
    const testOrder = await Order.create({
      orderNumber: `KS-TEST-${Date.now()}-2222c`,
      customer: {
        name: 'Hamza Tariq',
        email: 'hamza@test.com',
        phone: '03333213613',
        shippingAddress: 'Gulshan-e-Iqbal, Karachi',
        city: 'Karachi'
      },
      items: [{ title: 'Gold Pendant', quantity: 1, price: 90000 }],
      totalAmount: 90000
    });

    const res = await fetch(`${v1BaseUrl}/orders/number/${testOrder.orderNumber}?phone=033332136`);
    assert.strictEqual(res.status, 403);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.match(body.message, /Verification failed/i);
  });

  await testCase('25. Order tracking with matching phone returns 200 with masked PII', async () => {
    const testOrder = await Order.create({
      orderNumber: `KS-TEST-${Date.now()}-3333`,
      customer: {
        name: 'Ayesha Khan',
        email: 'ayesha.private@test.com',
        phone: '+92 333 3213613',
        shippingAddress: 'Secret House 42, Private Lane, Karachi',
        city: 'Karachi'
      },
      items: [{ title: 'Artisanal Solitaire Ring', quantity: 1, price: 180000, purity: '22K' }],
      totalAmount: 180000,
      orderStatus: 'Confirmed'
    });

    const res = await fetch(`${v1BaseUrl}/orders/number/${testOrder.orderNumber}?phone=03333213613`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    const data = body.data;

    assert.strictEqual(data.orderNumber, testOrder.orderNumber);
    assert.strictEqual(data.orderStatus, 'Confirmed');
    assert.strictEqual(data.customer.city, 'Karachi');

    assert.strictEqual(data.customer.shippingAddress, undefined);
    assert.strictEqual(data.customer.email, undefined);
    assert.match(data.customer.phone, /(0333|9233)\*\*\*\*613/);
    assert.match(data.customer.name, /A\*{2,4}a K\*{2,4}n/);
  });

  await testCase('25b. Order tracking via x-order-phone header returns 200 and shields phone from URL/logs', async () => {
    const testOrder = await Order.create({
      orderNumber: `KS-TEST-${Date.now()}-3333b`,
      customer: {
        name: 'Nida Farooq',
        email: 'nida.farooq@test.com',
        phone: '03451234567',
        shippingAddress: 'Bath Island, Clifton, Karachi',
        city: 'Karachi'
      },
      items: [{ title: 'Diamond Stud Earrings', quantity: 1, price: 320000, purity: '18K' }],
      totalAmount: 320000,
      orderStatus: 'Processing'
    });

    const res = await fetch(`${v1BaseUrl}/orders/number/${testOrder.orderNumber}`, {
      headers: { 'x-order-phone': '+92 345 1234567' }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    const data = body.data;

    assert.strictEqual(data.orderNumber, testOrder.orderNumber);
    assert.strictEqual(data.orderStatus, 'Processing');
    assert.strictEqual(data.customer.shippingAddress, undefined);
    assert.strictEqual(data.customer.email, undefined);
    assert.match(data.customer.phone, /(0345|9234)\*\*\*\*567/);
  });

  await testCase('26. Order tracking by authenticated administrator bypasses phone check & returns full details', async () => {
    const testOrder = await Order.create({
      orderNumber: `KS-TEST-${Date.now()}-4444`,
      customer: {
        name: 'VIP Client',
        email: 'vip@patron.com',
        phone: '03451122334',
        shippingAddress: 'Governor House Road, Karachi',
        city: 'Karachi'
      },
      items: [{ title: 'Royal Kundan Set', quantity: 1, price: 1200000 }],
      totalAmount: 1200000
    });

    const res = await fetch(`${v1BaseUrl}/orders/number/${testOrder.orderNumber}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.customer.name, 'VIP Client');
    assert.strictEqual(body.data.customer.shippingAddress, 'Governor House Road, Karachi');
    assert.strictEqual(body.data.customer.phone, '03451122334');
  });

  await testCase('27. Order tracking endpoint rate limiting returns 429 after repeated requests', async () => {
    const dummyNum = 'KS-RATE-TEST-5555';
    let blockedRes = null;
    for (let i = 0; i < 20; i++) {
      const res = await fetch(`${v1BaseUrl}/orders/number/${dummyNum}?phone=03001234567`);
      if (res.status === 429) {
        blockedRes = res;
        break;
      }
    }

    assert.ok(blockedRes, 'Expected tracking rate limiter to return 429');
    assert.strictEqual(blockedRes.status, 429);
    const body = await blockedRes.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.statusCode, 429);
    assert.match(body.message, /Too many order tracking attempts/i);
  });

  await new Promise((resolve) => server.close(resolve));
  await teardownTestDatabase(dbContext);

  const failedCount = results.filter((r) => r.status === 'VERIFIED FAIL').length;
  console.log(`\n========================================`);
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${results.length - failedCount} | FAILED: ${failedCount}`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
