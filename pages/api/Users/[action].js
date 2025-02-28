import { query } from '@/library/database';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;
  let status = 200;
  let response = {};
  const {
    firstName, lastName, email, phoneNumber, IDNumber, DOB, gender, jobTitle,
    department, division, employmentType, startDate, endDate, salary, bonus, role,fileName: empcontractname, EmployeeNumber: employeenumber
  } = req.body;

  const password = 'password1234';

  try {
    switch (action) {
      case 'add-user':
        if (method === 'POST') {
          try {
            await query('BEGIN');

            const insertUserQuery = `
              INSERT INTO public.users ("userid", "name", surname, email, "password", phone, dateofbirth, gender, createdon, updatedon, idnumber)
              VALUES ('${uuidv4()}', $1, $2, $3, $4, $5, $6, $7, NOW(), NOW(),  $8)
              RETURNING userid;
            `;
            const userResult = await query(insertUserQuery, [firstName, lastName, email, password, phoneNumber, DOB, gender, IDNumber]);
            const userId = userResult.rows[0].userid;

            const insertEmployeeQuery = `
              INSERT INTO public.employees (employeeid, userid, departmentid, depdivisionid, jobtitleid, employmenttypeid, employedon, employmentenddate, createdon, updatedon, empcontractname, employeenumber)
              VALUES ('${uuidv4()}', $1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8, $9);
            `;
            await query(insertEmployeeQuery, [userId, department, division, jobTitle, employmentType, startDate, endDate, empcontractname, employeenumber]);

            const insertUserRoleQuery = `
              INSERT INTO public.userroles (userroleid, userid, roleid, createdon, updatedon)
              VALUES ('${uuidv4()}', $1, $2, NOW(), NOW());
            `;
            await query(insertUserRoleQuery, [userId, role]);

            await query('COMMIT');
            response = { message: 'User added successfully' };
          } catch (error) {
            await query('ROLLBACK');
            throw error;
          }
        } else {
          res.setHeader('Allow', ['POST']);
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