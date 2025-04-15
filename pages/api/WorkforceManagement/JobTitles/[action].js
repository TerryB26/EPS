import { query } from '@/library/database';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;
  let status = 200;
  let response = {};
  const { jobtitleid, jobTitle: jobtitlename, user } = req.body;

  const table = 'public."jobtitles"';

  try {
    switch (action) {
      case 'add-jobTitle':
        if (method === 'POST') {
          const insertjobTitleQuery = `
            INSERT INTO ${table} ("jobtitleid", "jobtitlename", "createdon", "updatedon", "createdby", "updatedby")
            VALUES ('${uuidv4()}', $1, NOW(), NOW()), '${user.userid}', '${user.userid}')
            RETURNING *;
          `;
          const result = await query(insertjobTitleQuery, [jobtitlename]);
          response = { message: 'Job title added successfully', jobTitle: result.rows[0] };
        } else {
          res.setHeader('Allow', ['POST']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

      case 'edit-jobTitle':
        if (method === 'POST') {
          const updatejobTitleQuery = `
            UPDATE ${table}
            SET "jobtitlename" = $1, "updatedon" = NOW(), "updatedby" = '${user.userid}'
            WHERE "jobtitleid" = $2
            RETURNING *;
          `;
          const result = await query(updatejobTitleQuery, [jobtitlename, jobtitleid]);
          response = { message: 'Job title updated successfully', jobTitle: result.rows[0] };
        } else {
          res.setHeader('Allow', ['POST']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

      case 'delete-jobTitle':
        if (method === 'DELETE') {
          const deletejobTitleQuery = `
            DELETE FROM ${table} WHERE "jobtitleid" = $1 RETURNING *;
          `;
          const result = await query(deletejobTitleQuery, [jobtitleid]);
          response = { message: 'Job title deleted successfully', jobTitle: result.rows[0] };
        } else {
          res.setHeader('Allow', ['DELETE']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

      default:
        status = 400;
        response = { error: 'Invalid action' };
        break;
    }
  } catch (error) {
    status = 500;
    response = { error: error.message || 'Internal Server Error' };
  }

  res.status(status).json(response);
}