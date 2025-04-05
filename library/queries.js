export const queryKeys = {
  GET_USERS: 'SELECT * FROM public."users"',
  GET_ROLES: 'SELECT * FROM public."roles"',
  GET_Departments: 'SELECT * FROM public."departments"',
  GET_DepDivisions: 'SELECT * FROM public."depdivision"',
  GET_JTitles: 'SELECT * FROM public."jobtitles"',
  GET_EMPTypes: 'SELECT * FROM public."employmenttypes"',
  GET_USER_BY_ID: 'SELECT * FROM public."User" WHERE id = $1',
  GET_FULL_EMP_DETAILS: `
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
  GET_LEAVE_STATUSES: "SELECT * FROM public.leavestatus",
  GET_LEAVE_REQUESTS: `
  SELECT 
    lr.leaverequestid, 
    lr.statusid, 
    lr.leaveduration, 
    TO_CHAR(lr.fromdate, 'DD FMMonth YYYY') AS from_date, 
    TO_CHAR(lr.tilldate, 'DD FMMonth YYYY') AS till_date, 
    TO_CHAR(lr.createdon, 'DD FMMonth YYYY') AS request_createdon, 
    lr.createdby AS request_createdby, 
    TO_CHAR(lr.updatedon, 'DD FMMonth YYYY') AS request_updatedon, 
    lr.updatedby AS request_updatedby,
    lrs.leavereasonid, 
    lrs.employeereason, 
    lrs.leaveresponse, 
    TO_CHAR(lrs.createdon, 'DD FMMonth YYYY') AS reason_createdon, 
    lrs.createdby AS reason_createdby, 
    TO_CHAR(lrs.updatedon, 'DD FMMonth YYYY') AS reason_updatedon, 
    lrs.updatedby AS reason_updatedby,
    u."name", 
    u.surname, 
    u.email, 
    e.employeenumber, 
    lrt.requesttype AS leave_type_name, 
    ls.status AS leave_status,
    la.filename AS attachment_filename
  FROM public.leaverequests lr
  LEFT JOIN public.leavereasons lrs 
    ON lr.leaverequestid = lrs.leaverequestid
  LEFT JOIN public.employees e 
    ON lr.employeeid = e.employeeid
  LEFT JOIN public.users u 
    ON e.userid = u.userid
  LEFT JOIN public.leaverequesttypes lrt 
    ON lr.requesttypeid = lrt.requesttypeid
  LEFT JOIN public.leavestatus ls 
    ON lr.statusid = ls.leaveid
  LEFT JOIN public.leaveattatchments la
    ON lr.leaverequestid = la.leaverequestid;
`,
  GET_LEAVE_ATTATCHMENTS: "SELECT * FROM public.leaveattatchments",
  GET_LEAVE_REQ_TYPES: "SELECT * FROM public.leaverequesttypes",
};
