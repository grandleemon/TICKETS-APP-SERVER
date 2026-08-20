import 'dotenv/config';

const developmentDatabase = process.env.POSTGRES_DATABASE;
const testDatabase = process.env.POSTGRES_TEST_DATABASE;

if (!testDatabase) {
  throw new Error('POSTGRES_TEST_DATABASE is not configured');
}

if (testDatabase === developmentDatabase) {
  throw new Error('Test database must differ from development database');
}

process.env.NODE_ENV = 'test';
process.env.POSTGRES_DATABASE = testDatabase;
