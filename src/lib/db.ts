import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || '';

export const sql = (strings: TemplateStringsArray, ...values: unknown[]) => {
  if (!databaseUrl) {
    throw new Error('No DATABASE_URL environment variable configured');
  }
  const neonSql = neon(databaseUrl);
  return neonSql(strings, ...values);
};

export const isNeonConfigured = () => {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'));
};
