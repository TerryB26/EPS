import { query } from '@/library/database';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;
  let status = 200;
  let response = {};
  const { employmenttypeid, employmentType: employmenttypename,user  } = req.body;
  const table = 'public."employmenttypes"';

  try {
    switch (action) {
      case 'add-employmentType':
        if (method === 'POST') {
          const insertemploymentTypeQuery = `
            INSERT INTO ${table} ("employmenttypeid", "employmenttypename", "createdon", "updatedon","createdby","updatedby")
            VALUES ('${uuidv4()}', $1, NOW(), NOW(), '${user.userid}', '${user.userid}')
            RETURNING *;
          `;
          const result = await query(insertemploymentTypeQuery, [employmenttypename]);
          response = { message: 'Employment type added successfully', employmentType: result.rows[0] };
        } else {
          res.setHeader('Allow', ['POST']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

      case 'edit-employmentType':
        if (method === 'POST') {
          const updateemploymentTypeQuery = `
            UPDATE ${table}
            SET "employmenttypename" = $1, "updatedon" = NOW(), "updatedby" = '${user.userid}'
            WHERE "employmenttypeid" = $2
            RETURNING *;
          `;
          const result = await query(updateemploymentTypeQuery, [employmenttypename, employmenttypeid]);
          response = { message: 'Employment type updated successfully', employmentType: result.rows[0] };
        } else {
          res.setHeader('Allow', ['POST']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

      case 'delete-employmentType':
        if (method === 'DELETE') {
          const deleteemploymentTypeQuery = `
            DELETE FROM ${table} WHERE "employmenttypeid" = $1 RETURNING *;
          `;
          const result = await query(deleteemploymentTypeQuery, [employmenttypeid]);
          response = { message: 'Employment type deleted successfully', employmentType: result.rows[0] };
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