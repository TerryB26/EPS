import { Pool } from 'pg';
import { queryKeys } from './queries';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const query = async (key, params) => {
  const text = queryKeys[key];
  if (!text) {
    throw new Error(`Query key "${key}" not found`);
  }
  const res = await pool.query(text, params);
  return res;
};