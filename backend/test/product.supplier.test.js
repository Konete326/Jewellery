import assert from 'node:assert/strict';
import http from 'node:http';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { setupTestDatabase, teardownTestDatabase } from './testDatabase.js';
import { User } from '../src/modules/users/user.model.js';
import { Supplier } from '../src/modules/suppliers/supplier.model.js';
import { Product } from '../src/modules/products/product.model.js';
import { hashPassword } from '../src/modules/users/user.password.js';
import { ENV } from '../src/config/env.js';

process.env.NODE_ENV = 'test';

const runTests = async () => {
  const dbContext = await setupTestDatabase();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;

  const adminUser = await User.create({
    name: 'Product Supplier Admin',
    email: `prod_supp_admin_${Date.now()}@test.com`,
    password: hashPassword('Password123!'),
    role: 'admin',
    authProvider: 'local'
  });

  const adminToken = jwt.sign(
    { id: adminUser._id.toString(), email: adminUser.email, role: 'admin' },
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
      console.error(`[FAIL] ${name}`);
      console.error(err);
    }
  };

  const activeSupplier = await Supplier.create({
    name: `Lahore Bullion Exchange ${Date.now()}`,
    city: 'Lahore',
    phone: '03001234567',
    suppliedCategories: ['Gold', 'Silver'],
    status: 'active'
  });

  const archivedSupplier = await Supplier.create({
    name: `Old Rawalpindi Goldsmiths ${Date.now()}`,
    city: 'Rawalpindi',
    phone: '03119876543',
    suppliedCategories: ['Gold'],
    status: 'archived'
  });

  let createdProductWithoutSupplierId = null;
  let createdProductWithSupplierId = null;

  await testCase('1. POST /api/v1/products creates product without supplier (backward compatibility)', async () => {
    const res = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Classic Solitaire Ring',
        category: 'Rings',
        purity: '22K',
        netWeight: 4.5,
        price: 95000,
        stock: 2
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.supplierId, null);
    assert.strictEqual(body.data.supplierName, null);
    createdProductWithoutSupplierId = body.data._id;
  });

  await testCase('2. POST /api/v1/products creates product with valid active supplier', async () => {
    const res = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Royal Bridal Choker',
        category: 'Necklaces',
        purity: '22K',
        netWeight: 35.0,
        price: 850000,
        supplierId: activeSupplier._id.toString()
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.supplierId, activeSupplier._id.toString());
    assert.strictEqual(body.data.supplierName, activeSupplier.name);
    assert.ok(body.data.supplier);
    assert.strictEqual(body.data.supplier.city, 'Lahore');
    createdProductWithSupplierId = body.data._id;
  });

  await testCase('3. POST /api/v1/products fails on invalid hex supplier ID format', async () => {
    const res = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Invalid Supplier Ring',
        category: 'Rings',
        purity: '22K',
        netWeight: 5.0,
        price: 110000,
        supplierId: 'invalid-hex-id-123'
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes('Invalid supplier ID format'));
  });

  await testCase('4. POST /api/v1/products fails on non-existent supplier ID', async () => {
    const res = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Missing Supplier Bangle',
        category: 'Bangles',
        purity: '22K',
        netWeight: 12.0,
        price: 260000,
        supplierId: '6ae5dbb00b5c1321dcf956c9'
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 404);
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes('Supplier not found'));
  });

  await testCase('5. POST /api/v1/products blocks assigning archived supplier', async () => {
    const res = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Archived Sourced Earrings',
        category: 'Earrings',
        purity: '22K',
        netWeight: 6.0,
        price: 130000,
        supplierId: archivedSupplier._id.toString()
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes('archived supplier'));
  });

  await testCase('6. GET /api/v1/products and GET /:id exposes supplier metadata safely', async () => {
    const listRes = await fetch(`${baseUrl}/products`);
    const listBody = await listRes.json();
    assert.strictEqual(listRes.status, 200);
    const withSupplier = listBody.data.items.find((p) => p._id === createdProductWithSupplierId);
    assert.ok(withSupplier);
    assert.strictEqual(withSupplier.supplierId, activeSupplier._id.toString());
    assert.strictEqual(withSupplier.supplierName, activeSupplier.name);

    const withoutSupplier = listBody.data.items.find((p) => p._id === createdProductWithoutSupplierId);
    assert.ok(withoutSupplier);
    assert.strictEqual(withoutSupplier.supplierId, null);
    assert.strictEqual(withoutSupplier.supplierName, null);

    const singleRes = await fetch(`${baseUrl}/products/${createdProductWithSupplierId}`);
    const singleBody = await singleRes.json();
    assert.strictEqual(singleRes.status, 200);
    assert.strictEqual(singleBody.data.supplierId, activeSupplier._id.toString());
    assert.strictEqual(singleBody.data.supplierName, activeSupplier.name);
    assert.ok(singleBody.data.supplier);
  });

  await testCase('7. PUT /api/v1/products/:id updates other fields without corrupting supplier reference', async () => {
    const res = await fetch(`${baseUrl}/products/${createdProductWithSupplierId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        stock: 5,
        price: 890000
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.data.stock, 5);
    assert.strictEqual(body.data.supplierId, activeSupplier._id.toString());
    assert.strictEqual(body.data.supplierName, activeSupplier.name);
  });

  await testCase('8. PUT /api/v1/products/:id unlinks supplier when supplierId is set to null', async () => {
    const res = await fetch(`${baseUrl}/products/${createdProductWithSupplierId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        supplierId: null
      })
    });
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.data.supplierId, null);
    assert.strictEqual(body.data.supplierName, null);

    await fetch(`${baseUrl}/products/${createdProductWithSupplierId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        supplierId: activeSupplier._id.toString()
      })
    });
  });

  await testCase('9. Supplier archiving preserves existing product references in database', async () => {
    await fetch(`${baseUrl}/suppliers/${activeSupplier._id}/archive`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });

    const rawProduct = await Product.findById(createdProductWithSupplierId).lean();
    assert.ok(rawProduct);
    assert.strictEqual(rawProduct.supplierId.toString(), activeSupplier._id.toString());

    const fetchRes = await fetch(`${baseUrl}/products/${createdProductWithSupplierId}`);
    const fetchBody = await fetchRes.json();
    assert.strictEqual(fetchRes.status, 200);
    assert.strictEqual(fetchBody.data.supplierId, activeSupplier._id.toString());
    assert.strictEqual(fetchBody.data.supplierName, activeSupplier.name);
    assert.strictEqual(fetchBody.data.supplier.status, 'archived');
  });

  await testCase('10. Supplier restore collision: controlled 409 Conflict when active duplicate exists', async () => {
    const sharedName = `Sarafa Bullion Hub ${Date.now()}`;
    const sharedCity = 'Peshawar';

    const supA = await Supplier.create({
      name: sharedName,
      city: sharedCity,
      phone: '03001112233',
      suppliedCategories: ['Gold'],
      status: 'active'
    });

    await fetch(`${baseUrl}/suppliers/${supA._id}/archive`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const supB = await Supplier.create({
      name: sharedName,
      city: sharedCity,
      phone: '03004445566',
      suppliedCategories: ['Gold'],
      status: 'active'
    });

    const restoreCollisionRes = await fetch(`${baseUrl}/suppliers/${supA._id}/restore`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const collisionBody = await restoreCollisionRes.json();
    assert.strictEqual(restoreCollisionRes.status, 409);
    assert.strictEqual(collisionBody.success, false);
    assert.ok(/already exists in peshawar/i.test(collisionBody.message));

    await fetch(`${baseUrl}/suppliers/${supB._id}/archive`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const successfulRestoreRes = await fetch(`${baseUrl}/suppliers/${supA._id}/restore`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const successBody = await successfulRestoreRes.json();
    assert.strictEqual(successfulRestoreRes.status, 200);
    assert.strictEqual(successBody.success, true);
    assert.strictEqual(successBody.data.status, 'active');
  });

  await testCase('11. GET /api/v1/products?supplierId=<id> filters products by valid supplier', async () => {
    const s1 = await Supplier.create({
      name: `Sourcing Partner Alpha ${Date.now()}`,
      city: 'Karachi',
      phone: '03009991111',
      status: 'active'
    });
    const s2 = await Supplier.create({
      name: `Sourcing Partner Beta ${Date.now()}`,
      city: 'Karachi',
      phone: '03009992222',
      status: 'active'
    });

    await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Alpha Emerald Ring',
        category: 'Rings',
        purity: '22K',
        netWeight: 5.5,
        price: 120000,
        supplierId: s1._id.toString()
      })
    });

    await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Beta Diamond Choker',
        category: 'Necklaces',
        purity: '22K',
        netWeight: 22.0,
        price: 540000,
        supplierId: s2._id.toString()
      })
    });

    const resAlpha = await fetch(`${baseUrl}/products?supplierId=${s1._id.toString()}`);
    const bodyAlpha = await resAlpha.json();
    assert.strictEqual(resAlpha.status, 200);
    assert.strictEqual(bodyAlpha.success, true);
    assert.ok(bodyAlpha.data.items.length >= 1);
    bodyAlpha.data.items.forEach((item) => {
      assert.strictEqual(item.supplierId, s1._id.toString());
      assert.strictEqual(item.supplierName, s1.name);
    });

    const resBeta = await fetch(`${baseUrl}/products?supplierId=${s2._id.toString()}`);
    const bodyBeta = await resBeta.json();
    assert.strictEqual(resBeta.status, 200);
    assert.strictEqual(bodyBeta.success, true);
    assert.ok(bodyBeta.data.items.length >= 1);
    bodyBeta.data.items.forEach((item) => {
      assert.strictEqual(item.supplierId, s2._id.toString());
      assert.strictEqual(item.supplierName, s2.name);
    });
  });

  await testCase('12. Separation: Filtering by Supplier A excludes products belonging to Supplier B', async () => {
    const sA = await Supplier.create({
      name: `Firm Exclusivity A ${Date.now()}`,
      city: 'Lahore',
      phone: '03011110001',
      status: 'active'
    });
    const sB = await Supplier.create({
      name: `Firm Exclusivity B ${Date.now()}`,
      city: 'Lahore',
      phone: '03011110002',
      status: 'active'
    });

    const prodA = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Firm A Gold Chain',
        category: 'Necklaces',
        purity: '22K',
        netWeight: 14.0,
        price: 320000,
        supplierId: sA._id.toString()
      })
    });
    const bodyProdA = await prodA.json();

    const prodB = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Firm B Platinum Band',
        category: 'Rings',
        purity: '24K',
        netWeight: 7.0,
        price: 180000,
        supplierId: sB._id.toString()
      })
    });
    const bodyProdB = await prodB.json();

    const queryResA = await fetch(`${baseUrl}/products?supplierId=${sA._id.toString()}`);
    const queryBodyA = await queryResA.json();
    const idsInA = queryBodyA.data.items.map((it) => it._id);
    assert.ok(idsInA.includes(bodyProdA.data._id));
    assert.ok(!idsInA.includes(bodyProdB.data._id));

    const queryResB = await fetch(`${baseUrl}/products?supplierId=${sB._id.toString()}`);
    const queryBodyB = await queryResB.json();
    const idsInB = queryBodyB.data.items.map((it) => it._id);
    assert.ok(idsInB.includes(bodyProdB.data._id));
    assert.ok(!idsInB.includes(bodyProdA.data._id));
  });

  await testCase('13. Archived supplier filter: products linked to an archived supplier are retrievable', async () => {
    const sArchived = await Supplier.create({
      name: `Archived Guild ${Date.now()}`,
      city: 'Multan',
      phone: '03022223333',
      status: 'active'
    });

    const pRes = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Multan Antique Bangle',
        category: 'Bangles',
        purity: '22K',
        netWeight: 16.5,
        price: 390000,
        supplierId: sArchived._id.toString()
      })
    });
    const pBody = await pRes.json();
    assert.strictEqual(pRes.status, 201);

    await fetch(`${baseUrl}/suppliers/${sArchived._id}/archive`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const filterRes = await fetch(`${baseUrl}/products?supplierId=${sArchived._id.toString()}`);
    const filterBody = await filterRes.json();
    assert.strictEqual(filterRes.status, 200);
    const matched = filterBody.data.items.find((item) => item._id === pBody.data._id);
    assert.ok(matched);
    assert.strictEqual(matched.supplierId, sArchived._id.toString());
    assert.strictEqual(matched.supplierName, sArchived.name);
    assert.strictEqual(matched.supplier.status, 'archived');
  });

  await testCase('14. GET /api/v1/products?supplierId=bad-id returns 400 Bad Request', async () => {
    const res = await fetch(`${baseUrl}/products?supplierId=invalid-supplier-id-format`);
    const body = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes('Invalid supplier ID format'));
  });

  await testCase('15. No supplier filter preserves existing listing behavior (all products returned)', async () => {
    const res = await fetch(`${baseUrl}/products`);
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data.items));
    assert.ok(body.data.pagination.total >= 5);
  });

  await testCase('16. Combined filtering: supplierId with category, limit, and pagination', async () => {
    const sMulti = await Supplier.create({
      name: `Multi Craftsman Atelier ${Date.now()}`,
      city: 'Hyderabad',
      phone: '03044445555',
      status: 'active'
    });

    for (let i = 1; i <= 3; i++) {
      await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          title: `Hyderabad Ring Piece ${i}`,
          category: 'Rings',
          purity: '22K',
          netWeight: 4.0,
          price: 90000 + i * 1000,
          supplierId: sMulti._id.toString()
        })
      });
    }

    await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Hyderabad Necklace Piece',
        category: 'Necklaces',
        purity: '22K',
        netWeight: 25.0,
        price: 600000,
        supplierId: sMulti._id.toString()
      })
    });

    const combinedRes = await fetch(`${baseUrl}/products?supplierId=${sMulti._id.toString()}&category=Rings&page=1&limit=2`);
    const combinedBody = await combinedRes.json();
    assert.strictEqual(combinedRes.status, 200);
    assert.strictEqual(combinedBody.success, true);
    assert.strictEqual(combinedBody.data.items.length, 2);
    assert.strictEqual(combinedBody.data.pagination.total, 3);
    assert.strictEqual(combinedBody.data.pagination.page, 1);
    assert.strictEqual(combinedBody.data.pagination.limit, 2);
    combinedBody.data.items.forEach((item) => {
      assert.strictEqual(item.supplierId, sMulti._id.toString());
      assert.strictEqual(item.category, 'Rings');
    });
  });

  await new Promise((resolve) => server.close(resolve));
  await teardownTestDatabase(dbContext);

  console.log(`\n========================================`);
  console.log(`PRODUCT SUPPLIER TESTS TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
};

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});

