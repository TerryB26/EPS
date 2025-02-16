import { query } from '@/library/database';
import { queryKeys } from '@/library/queries';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await query(queryKeys.GET_ROLES);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}