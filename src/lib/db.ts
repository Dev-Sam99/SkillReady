import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || '';

export const sql = neon(databaseUrl);

export const isNeonConfigured = () => {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'));
};
