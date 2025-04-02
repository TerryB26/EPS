import { query } from '@/library/database';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;
  let status = 200;
  let response = {};
  const { roleID, roleName } = req.body;

  try {
    switch (action) {
        case 'new-request':
            /*create the request with reason and with or without attatchment */
            if (method === 'POST') {
            const insertRoleQuery = `
                INSERT INTO public."roles" ("roleid", "rolename", "createdon", "updatedon")
                VALUES ('${uuidv4()}', $1, NOW(), NOW())
                RETURNING *;
            `;
            const result = await query(insertRoleQuery, [roleName]);
            response = { message: 'Role added successfully', role: result.rows[0] };
            } else {
            res.setHeader('Allow', ['POST']);
            status = 405;
            response = { error: `Method ${method} Not Allowed` };
            }
        break;

        case 'update-request':
            /*update the status of the leave with, give a reason for status */
        break;


    }
  } catch (error) {
    status = 500;
    response = { error: error.message || 'Internal Server Error' };
  }

  res.status(status).json(response);
}