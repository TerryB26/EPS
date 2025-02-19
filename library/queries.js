export const queryKeys = {
  GET_USERS: 'SELECT * FROM public."users"',
  GET_ROLES: 'SELECT * FROM public."roles"',
  GET_Departments: 'SELECT * FROM public."departments"',
  GET_DepDivisions: 'SELECT * FROM public."depdivision"',
  GET_JTitles: 'SELECT * FROM public."jobtitles"',
  GET_EMPTypes: 'SELECT * FROM public."employmenttypes"',
  GET_USER_BY_ID: 'SELECT * FROM public."User" WHERE id = $1',
  INSERT_ROLE: `
    INSERT INTO public."roles" ("RoleID", "RoleName", "CreatedOn", "UpdatedOn")
    VALUES (uuid_generate_v4(), $1, NOW(), NOW())
    RETURNING *;
  `,
};