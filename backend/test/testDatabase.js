import mongoose from 'mongoose';

const normalizeUri = (uri) => String(uri || '').trim().toLowerCase();

export const isSafeTestDatabase = (arg1, arg2) => {
  const uri = typeof arg1 === 'string' ? arg1 : (arg1?._connectionString || arg1?.client?.s?.url || '');
  const connection = typeof arg1 === 'object' && arg1 !== null ? arg1 : arg2;

  const targetUri = normalizeUri(uri || connection?._connectionString || connection?.client?.s?.url);
  const dbName = normalizeUri(connection?.name);
  const host = normalizeUri(connection?.host);

  if (!targetUri && !host && !dbName) {
    return false;
  }

  const prodUri = normalizeUri(process.env.MONGODB_URI);
  if (prodUri) {
    if (targetUri === prodUri || targetUri.startsWith(prodUri) || prodUri.startsWith(targetUri)) {
      return false;
    }
    try {
      const prodUrl = new URL(prodUri.replace('mongodb+srv://', 'https://').replace('mongodb://', 'http://'));
      const targetUrl = targetUri ? new URL(targetUri.replace('mongodb+srv://', 'https://').replace('mongodb://', 'http://')) : null;
      if (targetUrl && prodUrl.host && targetUrl.host === prodUrl.host) {
        const prodDb = prodUrl.pathname.replace(/^\//, '').split('?')[0];
        const targetDb = (targetUrl.pathname.replace(/^\//, '').split('?')[0] || dbName);
        if (prodDb && targetDb && prodDb === targetDb) {
          return false;
        }
      }
    } catch {}
  }

  if (targetUri.includes('mongodb-memory-server')) {
    return true;
  }

  const isLocal = targetUri.includes('127.0.0.1') || targetUri.includes('localhost') || host === '127.0.0.1' || host === 'localhost';
  if (isLocal && (dbName.includes('test') || targetUri.includes('test'))) {
    return true;
  }

  const configuredTestUri = normalizeUri(process.env.MONGO_URI_TEST);
  if (configuredTestUri && targetUri === configuredTestUri && configuredTestUri !== prodUri) {
    if (dbName.includes('test') || targetUri.includes('test') || host.includes('test')) {
      return true;
    }
  }

  return false;
};

export const assertSafeTestDatabase = (arg1, arg2) => {
  if (!isSafeTestDatabase(arg1, arg2)) {
    const connection = typeof arg1 === 'object' && arg1 !== null ? arg1 : arg2;
    const safeIdentifier = connection?.name || 'unknown';
    throw new Error(`SAFETY VIOLATION: Refusing to perform destructive operations on non-test database: "${safeIdentifier}". Automated tests must connect only to in-memory or dedicated databases containing "test".`);
  }
};

export const setupTestDatabase = async () => {
  process.env.NODE_ENV = 'test';

  if (process.env.MONGO_URI_TEST) {
    const testUri = process.env.MONGO_URI_TEST;
    assertSafeTestDatabase(testUri, null);
    const conn = await mongoose.connect(testUri);
    assertSafeTestDatabase(testUri, conn.connection);
    return { uri: testUri, connection: conn.connection, mongod: null };
  }

  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    assertSafeTestDatabase(uri, conn.connection);
    return { uri, connection: conn.connection, mongod };
  } catch (err) {
    throw new Error(`Test database initialization failed: ${err.message}. Provide MONGO_URI_TEST or ensure mongodb-memory-server binary is accessible.`);
  }
};

export const teardownTestDatabase = async (setupResult) => {
  if (!setupResult) return;
  const { uri, connection, mongod } = setupResult;

  if (connection && connection.readyState === 1) {
    assertSafeTestDatabase(uri, connection);
    await connection.dropDatabase();
    await mongoose.disconnect();
  }

  if (mongod) {
    await mongod.stop();
  }
};
