import assert from 'node:assert/strict';
import http from 'node:http';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { setupTestDatabase, teardownTestDatabase } from './testDatabase.js';
import { User } from '../src/modules/users/user.model.js';
import { Supplier } from '../src/modules/suppliers/supplier.model.js';
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

  const adminUser = await User.create({
    name: 'Supplier Test Admin',
    email: `supp_admin_${Date.now()}@test.com`,
    password: hashPassword('Password123!'),
    role: 'admin',
    authProvider: 'local'
  });

  const customerUser = await User.create({
    name: 'Supplier Test Customer',
    email: `supp_cust_${Date.now()}@test.com`,
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

  let supplierId1 = null;
  let supplierId2 = null;

  await testCase('1. GET /api/v1/suppliers without auth token returns 401', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers`);
    assert.strictEqual(res.status, 401);
  });

  await testCase('2. GET /api/v1/suppliers with customer token returns 403 forbidden', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 403);
  });

  await testCase('3. POST /api/v1/suppliers with customer token returns 403 forbidden', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ name: 'Unauthorized Corp', phone: '03001234567' })
    });
    assert.strictEqual(res.status, 403);
  });

  await testCase('4. POST /api/v1/suppliers fails validation on missing required fields', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        contactPerson: 'Kashif Bhai'
      })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(Array.isArray(body.errors), true);
  });

  await testCase('5. POST /api/v1/suppliers creates supplier with valid fields', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Sarafa Bullion Refinery',
        contactPerson: 'Haji Abdul Sattar',
        phone: '021-35678901',
        whatsapp: '+923001234567',
        city: 'Karachi',
        address: 'Shop 14, Sarafa Market, Saddar',
        suppliedCategories: ['Gold', 'Silver'],
        notes: 'Primary 24K and 22K bullion ingot casting partner'
      })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.name, 'Sarafa Bullion Refinery');
    assert.strictEqual(body.data.status, 'active');
    assert.strictEqual(body.data.city, 'Karachi');
    assert.deepStrictEqual(body.data.suppliedCategories, ['Gold', 'Silver']);
    assert.ok(body.data._id);
    supplierId1 = body.data._id;
  });

  await testCase('6. POST /api/v1/suppliers rejects duplicate supplier name in same city', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'sarafa bullion refinery',
        phone: '03219998877',
        city: 'karachi'
      })
    });
    assert.strictEqual(res.status, 409);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes('already exists in Karachi'));
  });

  await testCase('7. POST /api/v1/suppliers allows distinct supplier with shared phone number', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Kohinoor Gemstone Importers',
        contactPerson: 'Kashif Sattar',
        phone: '021-35678901',
        whatsapp: '+923001234567',
        city: 'Karachi',
        suppliedCategories: ['Diamonds', 'Stones']
      })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.data.name, 'Kohinoor Gemstone Importers');
    supplierId2 = body.data._id;
  });

  await testCase('8. GET /api/v1/suppliers returns paginated list', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.items.length, 1);
    assert.strictEqual(body.data.pagination.page, 1);
    assert.strictEqual(body.data.pagination.limit, 1);
    assert.strictEqual(body.data.pagination.total, 2);
    assert.strictEqual(body.data.pagination.totalPages, 2);
    assert.strictEqual(body.data.pagination.hasNextPage, true);
  });

  await testCase('9. GET /api/v1/suppliers filters by search term', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers?search=Gemstone`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.items.length, 1);
    assert.strictEqual(body.data.items[0].name, 'Kohinoor Gemstone Importers');
  });

  await testCase('10. GET /api/v1/suppliers filters by supplied category', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers?category=Diamonds`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.items.length, 1);
    assert.strictEqual(body.data.items[0]._id, supplierId2);
  });

  await testCase('11. GET /api/v1/suppliers/:id returns supplier detail', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers/${supplierId1}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data._id, supplierId1);
    assert.strictEqual(body.data.name, 'Sarafa Bullion Refinery');
  });

  await testCase('12. GET /api/v1/suppliers/:id returns 400 on invalid hex ID and 404 on missing', async () => {
    const badHex = await fetch(`${v1BaseUrl}/suppliers/bad-id-123`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(badHex.status, 400);

    const nonExistent = await fetch(`${v1BaseUrl}/suppliers/6ae5d96143ec7c925f519eff`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(nonExistent.status, 404);
  });

  await testCase('13. PATCH /api/v1/suppliers/:id updates supplier fields', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers/${supplierId1}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        contactPerson: 'Haji Sattar & Sons',
        notes: 'Updated bullion testing certified LBMA'
      })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.contactPerson, 'Haji Sattar & Sons');
    assert.strictEqual(body.data.notes, 'Updated bullion testing certified LBMA');
  });

  await testCase('14. PATCH /api/v1/suppliers/:id/archive archives supplier', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers/${supplierId1}/archive`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.status, 'archived');

    const activeList = await fetch(`${v1BaseUrl}/suppliers?status=active`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const activeData = await activeList.json();
    assert.strictEqual(activeData.data.items.some((s) => s._id === supplierId1), false);
  });

  await testCase('15. PATCH /api/v1/suppliers/:id/restore restores archived supplier', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers/${supplierId1}/restore`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.status, 'active');
  });

  await testCase('16. DELETE /api/v1/suppliers/:id performs soft-archive without data loss', async () => {
    const res = await fetch(`${v1BaseUrl}/suppliers/${supplierId2}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.status, 'archived');

    const rawInDb = await Supplier.findById(supplierId2);
    assert.ok(rawInDb);
    assert.strictEqual(rawInDb.status, 'archived');
  });

  await testCase('17. GET /api/suppliers alias works seamlessly', async () => {
    const res = await fetch(`${baseUrl}/suppliers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  await testCase('18. Concurrency: Parallel duplicate supplier create requests reject all but one with 409 Conflict', async () => {
    const targetName = `Concurrency Ingot Lab ${Date.now()}`;
    const targetCity = 'Karachi';
    const createPayload = {
      name: targetName,
      city: targetCity,
      phone: '03001234567',
      suppliedCategories: ['Gold']
    };

    const parallelRequests = Array.from({ length: 6 }, () =>
      fetch(`${v1BaseUrl}/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(createPayload)
      })
    );

    const responses = await Promise.all(parallelRequests);
    const statuses = responses.map((r) => r.status);
    const createdCount = statuses.filter((s) => s === 201).length;
    const conflictCount = statuses.filter((s) => s === 409).length;

    assert.strictEqual(createdCount, 1);
    assert.strictEqual(conflictCount, 5);

    const inDb = await Supplier.countDocuments({
      normalizedName: targetName.trim().toLowerCase(),
      normalizedCity: targetCity.trim().toLowerCase()
    });
    assert.strictEqual(inDb, 1);
  });

  await testCase('19. Case-insensitive normalized uniqueness: mixed casing and whitespace reject duplicates', async () => {
    const targetName = `Unique Refinery ${Date.now()}`;
    const firstRes = await fetch(`${v1BaseUrl}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: targetName,
        city: 'Lahore',
        phone: '03111222333'
      })
    });
    assert.strictEqual(firstRes.status, 201);

    const dupRes = await fetch(`${v1BaseUrl}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: `  ${targetName.toUpperCase()}  `,
        city: '  LAHORE  ',
        phone: '03999888777'
      })
    });
    assert.strictEqual(dupRes.status, 409);
    const dupBody = await dupRes.json();
    assert.strictEqual(dupBody.success, false);
    assert.ok(dupBody.message.includes('already exists in LAHORE') || dupBody.message.includes('already exists in Lahore'));
  });

  await testCase('20. Concurrency: Parallel distinct suppliers with shared phone numbers all succeed', async () => {
    const sharedPhone = '03457788999';
    const payloads = [
      { name: `Shared Phone Lab A ${Date.now()}`, city: 'Karachi', phone: sharedPhone },
      { name: `Shared Phone Lab B ${Date.now()}`, city: 'Karachi', phone: sharedPhone },
      { name: `Shared Phone Lab C ${Date.now()}`, city: 'Lahore', phone: sharedPhone }
    ];

    const responses = await Promise.all(
      payloads.map((p) =>
        fetch(`${v1BaseUrl}/suppliers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(p)
        })
      )
    );

    const statuses = responses.map((r) => r.status);
    assert.deepStrictEqual(statuses, [201, 201, 201]);
  });

  await new Promise((res) => server.close(res));
  await teardownTestDatabase(dbContext);

  console.log(`\n========================================`);
  console.log(`SUPPLIER TESTS TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
};

runTests().catch((err) => {
  console.error('Fatal supplier test error:', err);
  process.exit(1);
});

