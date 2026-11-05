import assert from 'node:assert/strict';
import http from 'node:http';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { setupTestDatabase, teardownTestDatabase } from './testDatabase.js';
import { User } from '../src/modules/users/user.model.js';
import { hashPassword } from '../src/modules/users/user.password.js';
import { ENV } from '../src/config/env.js';

process.env.NODE_ENV = 'test';

const runTests = async () => {
  const dbContext = await setupTestDatabase();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;
  const v1BaseUrl = `http://127.0.0.1:${port}/api/v1`;

  const customerA = await User.create({
    name: 'Patron Karachi',
    email: `patron_a_${Date.now()}@test.com`,
    password: hashPassword('Password123!'),
    role: 'customer',
    authProvider: 'local'
  });

  const customerB = await User.create({
    name: 'Patron Lahore',
    email: `patron_b_${Date.now()}@test.com`,
    password: hashPassword('Password123!'),
    role: 'customer',
    authProvider: 'local'
  });

  const tokenA = jwt.sign(
    { id: customerA._id.toString(), email: customerA.email, role: 'customer' },
    ENV.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const tokenB = jwt.sign(
    { id: customerB._id.toString(), email: customerB.email, role: 'customer' },
    ENV.JWT_SECRET,
    { expiresIn: '1h' }
  );

  let passed = 0;
  let failed = 0;

  const testCase = async (name, fn) => {
    try {
      await fn();
      passed++;
      console.log(`[PASS] ${name}`);
    } catch (err) {
      failed++;
      console.error(`[FAIL] ${name}: ${err.message}`);
    }
  };

  let addressIdA1 = null;
  let addressIdA2 = null;
  let addressIdB1 = null;

  await testCase('1. GET /api/v1/users/me/addresses without auth token returns 401', async () => {
    const res = await fetch(`${v1BaseUrl}/users/me/addresses`);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  await testCase('2. GET /api/v1/users/me/addresses returns empty array for new customer', async () => {
    const res = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.deepStrictEqual(body.data, []);
  });

  await testCase('3. POST /api/v1/users/me/addresses fails validation on missing required fields', async () => {
    const res = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        label: 'Home'
      })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(Array.isArray(body.errors), true);
  });

  await testCase('4. POST /api/v1/users/me/addresses fails validation on invalid phone numbers', async () => {
    const res = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        recipientName: 'Ali Khan',
        phone: '12345',
        addressLine: 'House 12, Street 4, Clifton'
      })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  await testCase('5. POST /api/v1/users/me/addresses fails on non-Pakistani international numbers', async () => {
    const res = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        recipientName: 'Ali Khan',
        phone: '+14155552671',
        addressLine: 'House 12, Street 4, Clifton'
      })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  await testCase('6. POST /api/v1/users/me/addresses saves address and normalizes phone number', async () => {
    const res = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        label: 'Home',
        recipientName: 'Fatima Ahmed',
        phone: '0300-1234567',
        addressLine: 'Apartment 4B, Creek Vistas, Phase 8 DHA',
        area: 'DHA Phase 8',
        city: 'Karachi',
        postalCode: '75500',
        isDefault: false
      })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.recipientName, 'Fatima Ahmed');
    assert.strictEqual(body.data.phone, '+923001234567');
    assert.strictEqual(body.data.isDefault, false);
    assert.ok(body.data._id);
    addressIdA1 = body.data._id;
  });

  await testCase('7. POST /api/v1/users/me/addresses with isDefault:true unsets existing default', async () => {
    const res = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        label: 'Atelier / Office',
        recipientName: 'Fatima Ahmed',
        phone: '+92 321 9876543',
        addressLine: 'Suite 201, Executive Tower, Clifton Block 4',
        area: 'Clifton',
        city: 'Karachi',
        isDefault: true
      })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.isDefault, true);
    assert.strictEqual(body.data.phone, '+923219876543');
    addressIdA2 = body.data._id;

    const listRes = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const listBody = await listRes.json();
    assert.strictEqual(listBody.data.length, 2);
    const firstInList = listBody.data[0];
    assert.strictEqual(firstInList._id, addressIdA2);
    assert.strictEqual(firstInList.isDefault, true);

    const oldAddr = listBody.data.find((a) => a._id === addressIdA1);
    assert.strictEqual(oldAddr.isDefault, false);
  });

  await testCase('8. PATCH /api/v1/users/me/addresses/:addressId updates address fields', async () => {
    const res = await fetch(`${v1BaseUrl}/users/me/addresses/${addressIdA1}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        label: 'Beach Residence',
        area: 'DHA Phase 6'
      })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.label, 'Beach Residence');
    assert.strictEqual(body.data.area, 'DHA Phase 6');
  });

  await testCase('9. PATCH /api/v1/users/me/addresses/:addressId setting isDefault:true switches default', async () => {
    const res = await fetch(`${v1BaseUrl}/users/me/addresses/${addressIdA1}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        isDefault: true
      })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.isDefault, true);

    const checkRes = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const checkBody = await checkRes.json();
    const addr2 = checkBody.data.find((a) => a._id === addressIdA2);
    assert.strictEqual(addr2.isDefault, false);
  });

  await testCase('10. PATCH /api/v1/users/me/addresses/:addressId fails on invalid hex id', async () => {
    const res = await fetch(`${v1BaseUrl}/users/me/addresses/not-an-id`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ label: 'New Label' })
    });
    assert.strictEqual(res.status, 400);
  });

  await testCase('11. Cross-user isolation: User A cannot edit User B address ID (returns 404)', async () => {
    const createB = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`
      },
      body: JSON.stringify({
        recipientName: 'Bilal Khan',
        phone: '03331112233',
        addressLine: 'Gulberg III, Main Boulevard',
        city: 'Lahore'
      })
    });
    const bData = await createB.json();
    addressIdB1 = bData.data._id;

    const exploitRes = await fetch(`${v1BaseUrl}/users/me/addresses/${addressIdB1}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ recipientName: 'Hijacked Name' })
    });
    assert.strictEqual(exploitRes.status, 404);
    const exploitBody = await exploitRes.json();
    assert.strictEqual(exploitBody.success, false);
    assert.strictEqual(exploitBody.message, 'Saved address not found');
  });

  await testCase('12. Cross-user isolation: User A cannot delete User B address ID (returns 404)', async () => {
    const delRes = await fetch(`${v1BaseUrl}/users/me/addresses/${addressIdB1}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(delRes.status, 404);

    const checkB = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const checkBBody = await checkB.json();
    assert.strictEqual(checkBBody.data.length, 1);
    assert.strictEqual(checkBBody.data[0]._id, addressIdB1);
    assert.strictEqual(checkBBody.data[0].recipientName, 'Bilal Khan');
  });

  await testCase('13. DELETE /api/v1/users/me/addresses/:addressId deletes address without auto-promoting another', async () => {
    const delRes = await fetch(`${v1BaseUrl}/users/me/addresses/${addressIdA1}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(delRes.status, 200);

    const listRes = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const listBody = await listRes.json();
    assert.strictEqual(listBody.data.length, 1);
    assert.strictEqual(listBody.data[0]._id, addressIdA2);
    assert.strictEqual(listBody.data[0].isDefault, false);
  });

  await testCase('14. Enforces 10 saved addresses maximum limit per customer', async () => {
    for (let i = 0; i < 9; i++) {
      const res = await fetch(`${v1BaseUrl}/users/me/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenA}`
        },
        body: JSON.stringify({
          label: `Address #${i + 2}`,
          recipientName: 'Fatima Ahmed',
          phone: '03001234567',
          addressLine: `Street ${i + 1}, Block ${i + 1}, Saddar`,
          city: 'Karachi'
        })
      });
      assert.strictEqual(res.status, 201);
    }

    const countRes = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const countBody = await countRes.json();
    assert.strictEqual(countBody.data.length, 10);

    const eleventhRes = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        label: '11th Address (Should Fail)',
        recipientName: 'Fatima Ahmed',
        phone: '03001234567',
        addressLine: 'Exceeding Limit Lane',
        city: 'Karachi'
      })
    });
    assert.strictEqual(eleventhRes.status, 400);
    const eleventhBody = await eleventhRes.json();
    assert.strictEqual(eleventhBody.success, false);
    assert.strictEqual(eleventhBody.message, 'Maximum 10 saved addresses allowed per customer');
  });

  await testCase('15. Backward compatibility: /api/users/me/addresses alias works seamlessly', async () => {
    const res = await fetch(`${baseUrl}/users/me/addresses`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.length, 1);
  });

  await testCase('16. Concurrency: Parallel address creation cannot bypass 10-address limit', async () => {
    const customerC = await User.create({
      name: 'Patron Concurrency C',
      email: `patron_c_${Date.now()}@test.com`,
      password: hashPassword('Password123!'),
      role: 'customer',
      authProvider: 'local'
    });

    const tokenC = jwt.sign(
      { id: customerC._id.toString(), email: customerC.email, role: 'customer' },
      ENV.JWT_SECRET,
      { expiresIn: '1h' }
    );

    for (let i = 0; i < 8; i++) {
      const res = await fetch(`${v1BaseUrl}/users/me/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenC}`
        },
        body: JSON.stringify({
          label: `Base Address #${i + 1}`,
          recipientName: 'Zainab Ahmed',
          phone: '03001234567',
          addressLine: `Baseline Lane ${i + 1}`,
          city: 'Karachi'
        })
      });
      assert.strictEqual(res.status, 201);
    }

    const initialCheck = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      headers: { Authorization: `Bearer ${tokenC}` }
    });
    const initialBody = await initialCheck.json();
    assert.strictEqual(initialBody.data.length, 8);

    const parallelCreates = Array.from({ length: 8 }, (_, i) =>
      fetch(`${v1BaseUrl}/users/me/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenC}`
        },
        body: JSON.stringify({
          label: `Concurrent Attempt #${i + 1}`,
          recipientName: 'Zainab Ahmed',
          phone: '03001234567',
          addressLine: `Burst Lane ${i + 1}`,
          city: 'Karachi'
        })
      })
    );

    const responses = await Promise.all(parallelCreates);
    const statuses = responses.map((r) => r.status);
    const createdCount = statuses.filter((s) => s === 201).length;
    const limitBlockedCount = statuses.filter((s) => s === 400).length;

    assert.strictEqual(createdCount, 2);
    assert.strictEqual(limitBlockedCount, 6);

    const finalCheck = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      headers: { Authorization: `Bearer ${tokenC}` }
    });
    const finalBody = await finalCheck.json();
    assert.strictEqual(finalBody.data.length, 10);

    const inDb = await User.findById(customerC._id);
    assert.strictEqual(inDb.addresses.length, 10);
  });

  await testCase('17. Concurrency: Parallel default-address updates never create multiple defaults', async () => {
    const checkRes = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const checkBody = await checkRes.json();
    const targetAddresses = checkBody.data.slice(0, 5);
    assert.strictEqual(targetAddresses.length, 5);

    const parallelUpdates = targetAddresses.map((addr) =>
      fetch(`${v1BaseUrl}/users/me/addresses/${addr._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenA}`
        },
        body: JSON.stringify({ isDefault: true })
      })
    );

    const responses = await Promise.all(parallelUpdates);
    const statuses = responses.map((r) => r.status);
    assert.strictEqual(statuses.every((s) => s === 200), true);

    const verifyRes = await fetch(`${v1BaseUrl}/users/me/addresses`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const verifyBody = await verifyRes.json();
    const defaults = verifyBody.data.filter((a) => a.isDefault === true);
    assert.strictEqual(defaults.length, 1);

    const inDb = await User.findById(customerA._id);
    const inDbDefaults = inDb.addresses.filter((a) => a.isDefault === true);
    assert.strictEqual(inDbDefaults.length, 1);
  });

  await testCase('18. Concurrency: Parallel creation with isDefault:true never leaves multiple defaults', async () => {
    const customerD = await User.create({
      name: 'Patron Concurrency D',
      email: `patron_d_${Date.now()}@test.com`,
      password: hashPassword('Password123!'),
      role: 'customer',
      authProvider: 'local'
    });

    const tokenD = jwt.sign(
      { id: customerD._id.toString(), email: customerD.email, role: 'customer' },
      ENV.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const parallelDefaultCreates = Array.from({ length: 5 }, (_, i) =>
      fetch(`${v1BaseUrl}/users/me/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenD}`
        },
        body: JSON.stringify({
          label: `Default Attempt #${i + 1}`,
          recipientName: 'Hafsa Tariq',
          phone: '03001234567',
          addressLine: `Default Lane ${i + 1}`,
          city: 'Karachi',
          isDefault: true
        })
      })
    );

    const responses = await Promise.all(parallelDefaultCreates);
    const statuses = responses.map((r) => r.status);
    assert.strictEqual(statuses.every((s) => s === 201), true);

    const inDb = await User.findById(customerD._id);
    const inDbDefaults = inDb.addresses.filter((a) => a.isDefault === true);
    assert.strictEqual(inDbDefaults.length, 1);
    assert.strictEqual(inDb.addresses.length, 5);
  });

  await new Promise((res) => server.close(res));
  await teardownTestDatabase(dbContext);

  console.log(`\n========================================`);
  console.log(`ADDRESS TESTS TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
};

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
