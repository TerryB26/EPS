import { query } from '@/library/database';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;
  let status = 200;
  let response = {};
  const { depdivisionid, divisionName, departmentid } = req.body;

  try {
    switch (action) {
      case 'add-division':
        if (method === 'POST') {
          const insertDivisionQuery = `
            INSERT INTO public."depdivision" ("depdivisionid", "departmentid", "depdivisioname", "createdon", "updatedon")
            VALUES ('${uuidv4()}', $1, $2, NOW(), NOW())
            RETURNING *;
          `;
          const result = await query(insertDivisionQuery, [departmentid, divisionName]);
          response = { message: 'Division added successfully', division: result.rows[0] };
        } else {
          res.setHeader('Allow', ['POST']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

      case 'edit-division':
        if (method === 'POST') {
          const updateDivisionQuery = `
            UPDATE public."depdivision"
            SET "depdivisioname" = $1, "updatedon" = NOW()
            WHERE "depdivisionid" = $2 AND "departmentid" = $3
            RETURNING *;
          `;
          console.log("🚀 ~ handler ~ updateDivisionQuery:", updateDivisionQuery)
          const result = await query(updateDivisionQuery, [divisionName, depdivisionid, departmentid]);
          response = { message: 'Division updated successfully', division: result.rows[0] };
        } else {
          res.setHeader('Allow', ['POST']);
          status = 405;
          response = { error: `Method ${method} Not Allowed` };
        }
        break;

      case 'delete-division':
        if (method === 'DELETE') {
          const deleteDivisionQuery = `
            DELETE FROM public."depdivision" WHERE "depdivisionid" = $1;
          `;
          const result = await query(deleteDivisionQuery, [depdivisionid]);
          response = { message: 'Division deleted successfully', division: result.rows[0] };
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