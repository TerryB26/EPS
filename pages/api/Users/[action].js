import { query } from '@/library/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;
  let status = 200;
  let response = {};
  const {
    firstName, lastName, email, phoneNumber, IDNumber, DOB, gender, jobTitle, user,
    department, division, employmentType, startDate, endDate, salary: basicsalary, bonus, role,fileName: empcontractname, EmployeeNumber: employeenumber, leavetypes
  } = req.body;

  const plainPassword = '1234';

  try {
    switch (action) {
      case 'add-user':
        if (method === 'POST') {
          try {
            await query('BEGIN');

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

            // Insert into users table
            const insertUserQuery = `
              INSERT INTO public.users ("userid", "name", surname, email, "password", phone, dateofbirth, gender, createdon, updatedon, idnumber, createdby, updatedby)
              VALUES ('${uuidv4()}', $1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8, '${user.userid}', '${user.userid}')
              RETURNING userid;
            `;
            const userResult = await query(insertUserQuery, [firstName, lastName, email, hashedPassword, phoneNumber, DOB, gender, IDNumber]);
            const userId = userResult.rows[0].userid;

            // Insert into employees table and retrieve employeeid
            const insertEmployeeQuery = `
              INSERT INTO public.employees (employeeid, userid, departmentid, depdivisionid, jobtitleid, employmenttypeid, employedon, employmentenddate, createdon, updatedon, empcontractname, employeenumber, createdby, updatedby)
              VALUES ('${uuidv4()}', $1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8, $9, '${user.userid}', '${user.userid}')
              RETURNING employeeid;
            `;
            const employeeResult = await query(insertEmployeeQuery, [userId, department, division, jobTitle, employmentType, startDate, endDate, empcontractname, employeenumber]);
            const employeeId = employeeResult.rows[0].employeeid;

            // Insert into userroles table
            const insertUserRoleQuery = `
              INSERT INTO public.userroles (userroleid, userid, roleid, createdon, updatedon, createdby, updatedby)
              VALUES ('${uuidv4()}', $1, $2, NOW(), NOW(), '${user.userid}', '${user.userid}');
            `;
            await query(insertUserRoleQuery, [userId, role]);

            // Insert into salaries table
            const insertEmployeeSalaryQuery = `
              INSERT INTO public.salaries (empsalaryid, employeeid, basicsalary, createdon, updatedon, createdby, updatedby)
              VALUES ('${uuidv4()}', $1, $2, NOW(), NOW(), '${user.userid}', '${user.userid}');
            `;
            await query(insertEmployeeSalaryQuery, [employeeId, basicsalary]);

            // Insert into employeeleavebalance table
            if (Array.isArray(leavetypes)) {
              for (const leave of leavetypes) {
                const insertLeaveBalanceQuery = `
                  INSERT INTO public.employeeleavebalance (empleavebalanceid, leavetypeid, remainingbalance, employeeid)
                  VALUES ('${uuidv4()}', $1, $2, $3);
                `;
                await query(insertLeaveBalanceQuery, [leave.requesttypeid, leave.balance, employeeId]);
              }
            }

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