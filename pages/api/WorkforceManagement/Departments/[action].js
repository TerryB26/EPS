import { query } from '@/library/database';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;
  let status = 200;
  let response = {};
  const { departmentID, departmentName, user } = req.body;

  try {
    switch (action) {
      case 'add-department':
        if (method === 'POST') {
          const insertDepartmentQuery = `
            INSERT INTO public."departments" ("departmentid", "departmentname", "createdon", "updatedon", "createdby", "updatedby")
            VALUES ('${uuidv4()}', $1, NOW(), NOW(), '${user.userid}', '${user.userid}')
            RETURNING *;
          `;
          const result = await query(insertDepartmentQuery, [departmentName]);
          response = { message: 'Department added successfully', department: result.rows[0] };
        } else {
          res.setHeader('Allow', ['POST']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

      case 'edit-department':
        if (method === 'POST') {
          const updateDepartmentQuery = `
            UPDATE public."departments"
            SET "departmentname" = $1, "updatedon" = NOW(), "updatedby" = '${user.userid}'
            WHERE "departmentid" = $2
            RETURNING *;
          `;
          const result = await query(updateDepartmentQuery, [departmentName, departmentID]);
          response = { message: 'Department updated successfully', department: result.rows[0] };
        } else {
          res.setHeader('Allow', ['POST']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

      case 'delete-department':
        if (method === 'DELETE') {
          const deleteDepartmentQuery = `
            DELETE FROM public."departments" WHERE "departmentid" = $1 RETURNING *;
          `;
          const result = await query(deleteDepartmentQuery, [departmentID]);
          response = { message: 'Department deleted successfully', department: result.rows[0] };
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