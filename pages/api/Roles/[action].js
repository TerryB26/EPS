import { query } from '@/library/database';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;
  let status = 200;
  let response = {};
  const { roleID, roleName, user } = req.body;

  try {
    switch (action) {
      case 'add-role':
        if (method === 'POST') {
          const insertRoleQuery = `
            INSERT INTO public."roles" ("roleid", "rolename", "createdon", "updatedon", "createdby", "updatedby")
            VALUES ('${uuidv4()}', $1, NOW(), NOW(), '${user.userid}', '${user.userid}')
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

        case 'edit-role':
        if (method === 'POST') {
          const updateRoleQuery = `
            UPDATE public."roles"
            SET "rolename" = $1, "updatedon" = NOW(), "updatedby" = '${user.userid}'
            WHERE "roleid" = $2
            RETURNING *;
          `;
          const result = await query(updateRoleQuery, [roleName, roleID]);
          response = { message: 'Role updated successfully', role: result.rows[0] };
        } else {
          res.setHeader('Allow', ['POST']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

      case 'delete-role':
        if (method === 'DELETE') {
          const deleteRoleQuery = `
            DELETE FROM public."roles" WHERE "roleid" = $1 RETURNING *;
          `;
          const result = await query(deleteRoleQuery, [roleID]);
          response = { message: 'Role deleted successfully', role: result.rows[0] };
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