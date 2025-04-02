export const queryKeys = {
  GET_USERS: 'SELECT * FROM public."users"',
  GET_ROLES: 'SELECT * FROM public."roles"',
  GET_Departments: 'SELECT * FROM public."departments"',
  GET_DepDivisions: 'SELECT * FROM public."depdivision"',
  GET_JTitles: 'SELECT * FROM public."jobtitles"',
  GET_EMPTypes: 'SELECT * FROM public."employmenttypes"',
  GET_USER_BY_ID: 'SELECT * FROM public."User" WHERE id = $1',
  GET_FULL_EMP_DETAILS: 
  `
  SELECT 
    u.userid,e.employeeid, u."name", u.surname, u.email, u.phone, 
    u.dateofbirth, u.gender, u.idnumber, 
      r.rolename, 
     d.departmentname, 
     dd.depdivisioname,jt.jobtitlename,
     e.empcontractname, e.employeenumber,
     et.employmenttypename, 
    e.employedon, e.employmentenddate  
FROM public.users u
LEFT JOIN public.userroles ur ON u.userid = ur.userid
LEFT JOIN public.roles r ON ur.roleid = r.roleid
LEFT JOIN public.employees e ON u.userid = e.userid
LEFT JOIN public.employmenttypes et ON e.employmenttypeid = et.employmenttypeid
LEFT JOIN public.departments d ON e.departmentid = d.departmentid
LEFT JOIN public.depdivision dd ON e.depdivisionid = dd.depdivisionid
LEFT JOIN public.jobtitles jt ON e.jobtitleid = jt.jobtitleid;
  `,
  GET_SYSTEMDOCS: 'SELECT * FROM public."systemdocs"',
  GET_LEAVE_STATUSES: 'SELECT * FROM public.leavestatus',
};

/*public.eployeeleaverequests, public.leavereasons, public.leaveattatchments */