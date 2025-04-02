import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box, Stepper, Step, StepLabel, Typography, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import MySwal from 'sweetalert2';
import RequiredField from "@/components/General/RequiredField";
import PageHeader from '../General/PageHeader';
import { getDateOfBirthFromID, validateIDNumber, getGenderFromID, generateEmployeeNumber } from '@/utils/IDChecker';
import PropDebugger from '@/utils/Debugger';
import { FaFemale, FaMale } from "react-icons/fa";
import FileUpload from '@/components/General/Files/FileUpload';
import FormButtons from "@/components/General/FormButtons";

const validationObj = {
  firstName: yup.string().typeError("Please enter a valid first name.").required("First name is required"),
  lastName: yup.string().typeError("Please enter a valid last name.").required("Last name is required"),
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  phoneNumber: yup.string().typeError("Please enter a valid contact number.").required("Contact number is required"),
  IDNumber: yup.string().matches(/^\d{13}$/, "Please enter a valid 13-digit ID number").required("ID number is required"),
  DOB: yup.date().typeError("Please enter a valid date of birth").required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  jobTitle: yup.string().required("Job title is required"),
  department: yup.string().required("Department is required"),
  division: yup.string().required("Division is required"),
  employmentType: yup.string().required("Employment type is required"),
  startDate: yup.date().typeError("Please enter a valid start date").required("Start date is required"),
  salary: yup.number().typeError("Please enter a valid salary").required("Salary is required"),
  bonus: yup.number().typeError("Please enter a valid bonus").required("Bonus is required"),
  role: yup.string().required("Role is required"),
};

const validationSchema = yup.object(validationObj);

const AddUsersForm = ({ handleClose,fetchUsers, closeAccordion, routeName }) => {
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [jobTitles, setJobTitles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [userRoles, setuserRoles] = useState([]);
  const [triggerFileUpload, setTriggerFileUpload] = useState(false); 
  const handleClearForm = () => {
    resetForm();
  };

  useEffect(() => {
    const endpoints = [
      { url: 'api/WorkforceManagement/JobTitles/', setter: setJobTitles },
      { url: 'api/WorkforceManagement/Departments/', setter: setDepartments },
      { url: 'api/WorkforceManagement/Departments/Divisions/', setter: setDivisions },
      { url: 'api/WorkforceManagement/EmploymentType/', setter: setEmploymentTypes },
      { url: 'api/Roles/', setter: setuserRoles }
    ];
  
    const fetchData = async () => {
      try {
        const responses = await Promise.all(endpoints.map(endpoint => axios.get(endpoint.url)));
        responses.forEach((response, index) => {
          endpoints[index].setter(response.data);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const steps = ['Employee Details', 'Recruitment Department Details', 'Employment Details', 'Benefits Details'];

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, setFieldValue, resetForm } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      IDNumber: "",
      DOB: "",
      gender: "",
      jobTitle: "",
      department: "",
      division: "",
      employmentType: "",
      startDate: null,
      endDate: null,
      salary: "",
      bonus: "",
      role: "",
      fileName: "",
      EmployeeNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitting(true);
      let url = "api/Users/add-user";

      axios({
        url,
        method: "POST",
        data: { ...values }
      }).then((res) => {
        setSubmitting(false);
        handleClose();
        fetchUsers();
        MySwal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User added successfully',
          timer: 1000,
          showConfirmButton: false,
        });
        resetForm();
        setTriggerFileUpload(true);
      }).catch(e => {
        setSubmitting(false);
        MySwal.fire({
          icon: 'error',
          html: `${e?.response?.data ? e?.response?.data : e}`,
        });
      });
    },
  });

  const handleFileUpload = (file) => {
    setFieldValue('fileName', file.name);
  };

  const handleIDNumberChange = (e) => {
    handleChange(e);
    const idNumber = e.target.value;
    if (validateIDNumber(idNumber)) {
      const dob = getDateOfBirthFromID(idNumber);
      const gender = getGenderFromID(idNumber);
      const EmployeeNumber = generateEmployeeNumber(idNumber);
      setFieldValue('DOB', dob.toISOString().split('T')[0]);
      setFieldValue('gender', gender);
      setFieldValue('EmployeeNumber', EmployeeNumber);
    } else {
      setFieldValue('DOB', '');
      setFieldValue('gender', '');
      setFieldValue('EmployeeNumber', '');
    }
  };

  const filteredDivisions = divisions.filter(division => division.departmentid === values.department);

  const stepContents = [
    <Box mb={2} mt={8} key="step1">
      <Grid container spacing={2} mb={4}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label={<RequiredField title="First Name" />}
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.firstName && Boolean(errors.firstName)}
            helperText={touched.firstName && errors.firstName}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label={<RequiredField title="Last Name" />}
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.lastName && Boolean(errors.lastName)}
            helperText={touched.lastName && errors.lastName}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label={<RequiredField title="Email" />}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="phoneNumber"
            name="phoneNumber"
            label={<RequiredField title="Contact Number" />}
            value={values.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phoneNumber && Boolean(errors.phoneNumber)}
            helperText={touched.phoneNumber && errors.phoneNumber}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="IDNumber"
            name="IDNumber"
            label={<RequiredField title="ID Number" />}
            value={values.IDNumber}
            onChange={handleIDNumberChange} // Use custom handleChange
            onBlur={handleBlur}
            error={touched.IDNumber && Boolean(errors.IDNumber)}
            helperText={touched.IDNumber && errors.IDNumber}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="DOB"
            name="DOB"
            label={<RequiredField title="Date OF Birth" isRequired={false} />}
            value={values.DOB}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={true}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="role-label" shrink><RequiredField title="Role" /></InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.role && Boolean(errors.role)}
            >
              {userRoles.map((role) => (
                <MenuItem key={role.roleid} value={role.roleid}>
                  {role.rolename}
                </MenuItem>
              ))}
            </Select>
            {touched.role && errors.role && (
              <Typography color="error" variant="caption">
                {errors.role}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={6} display="flex" alignItems="center">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: `2px solid ${values.gender === 'Male' ? "#1976D2" : "#808080"}`,
              backgroundColor: 'transparent',
              marginRight: '10px'
            }}
          >
            <FaMale size={24} color={values.gender === 'Male' ? "#1976D2" : "#808080"} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: `2px solid ${values.gender === 'Female' ? "#1976D2" : "#808080"}`,
              backgroundColor: 'transparent'
            }}
          >
            <FaFemale size={24} color={values.gender === 'Female' ? "#1976D2" : "#808080"} />
          </Box>
        </Grid>
      </Grid>
    </Box>,

    <Box mb={2} mt={8} key="step2">
      <Grid container spacing={2} mb={4}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <RequiredField title="Job Title" boldTitle={true}/>
            <Select
              id="jobTitle"
              name="jobTitle"
              value={values.jobTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.jobTitle && Boolean(errors.jobTitle)}
            >
              {jobTitles.map((jobTitle) => (
                <MenuItem key={jobTitle.jobtitleid} value={jobTitle.jobtitleid}>
                  {jobTitle.jobtitlename}
                </MenuItem>
              ))}
            </Select>
            {touched.jobTitle && errors.jobTitle && (
              <Typography color="error" variant="caption">
                {errors.jobTitle}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
          <RequiredField title="Department" boldTitle={true}/>
            <Select
              labelId="department-label"
              id="department"
              name="department"
              value={values.department}
              onChange={(e) => {
                handleChange(e);
                setFieldValue('division', ''); 
              }}
              onBlur={handleBlur}
              error={touched.department && Boolean(errors.department)}
            >
              {departments.map((department) => (
                <MenuItem key={department.departmentid} value={department.departmentid}>
                  {department.departmentname}
                </MenuItem>
              ))}
            </Select>
            {touched.department && errors.department && (
              <Typography color="error" variant="caption">
                {errors.department}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={6}>
          <FormControl fullWidth>
          <RequiredField title="Division" boldTitle={true}/>
            <Select
              labelId="division-label"
              id="division"
              name="division"
              value={values.division}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.division && Boolean(errors.division)}
              disabled={!values.department} // Disable if no department is selected
            >
              {filteredDivisions.map((division) => (
                <MenuItem key={division.depdivisionid} value={division.depdivisionid}>
                  {division.depdivisioname}
                </MenuItem>
              ))}
            </Select>
            {touched.division && errors.division && (
              <Typography color="error" variant="caption">
                {errors.division}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <RequiredField title="Employment Type" boldTitle={true}/>
            <Select
              labelId="employmentType-label"
              id="employmentType"
              name="employmentType"
              value={values.employmentType}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.employmentType && Boolean(errors.employmentType)}
            >
              {employmentTypes.map((employmentType) => (
                <MenuItem key={employmentType.employmenttypeid} value={employmentType.employmenttypeid}>
                  {employmentType.employmenttypename}
                </MenuItem>
              ))}
            </Select>
            {touched.employmentType && errors.employmentType && (
              <Typography color="error" variant="caption">
                {errors.employmentType}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box>,

    <Box mb={2} mt={8} key="step3">
      <Grid container spacing={2} mb={4} sx={{ display: "flex", justifyContent: "space-between" }}>
        <Grid item xs={12} md={6} sx={{ flexGrow: 1, pr: 2 }}>
        <FormControl fullWidth> 
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={<RequiredField title="Start Date" boldTitle={true} />}
              value={values.startDate}
              onChange={(newValue) => setFieldValue('startDate', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  sx={{ width: "100%" }} // Ensure it expands
                  onBlur={handleBlur}
                  error={touched.startDate && Boolean(errors.startDate)}
                  helperText={touched.startDate && errors.startDate}
                />
              )}
            />
          </LocalizationProvider>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6} sx={{ flexGrow: 1, pl: 2 }}>
        <FormControl fullWidth> 
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={<RequiredField title="End Date" boldTitle={true}/>}
              value={values.endDate}
              onChange={(newValue) => setFieldValue('endDate', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  sx={{ width: "100%" }}
                  onBlur={handleBlur}
                  error={touched.endDate && Boolean(errors.endDate)}
                  helperText={touched.endDate && errors.endDate}
                />
              )}
            />
          </LocalizationProvider>
          </FormControl>
        </Grid>
      </Grid>

      <Grid mt={4}>
        <FileUpload allowMultiple={false} onFileUpload={handleFileUpload} triggerFileUpload={triggerFileUpload} ApiUrl="/api/EmpContracts/upload" EmployeeNumber={values.EmployeeNumber}/>
      </Grid>
    </Box>,


    <Box mb={2} mt={8} key="step4">
    <Grid container spacing={2} mb={4}>
    <Grid item xs={6}>
        <TextField
          fullWidth
          id="salary"
          name="salary"
          label={<RequiredField title="Salary" boldTitle={true}/>}
          value={values.salary}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.salary && Boolean(errors.salary)}
          helperText={touched.salary && errors.salary}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          id="bonus"
          name="bonus"
          label={<RequiredField title="Bonus" boldTitle={true}/>}
          value={values.bonus}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.bonus && Boolean(errors.bonus)}
          helperText={touched.bonus && errors.bonus}
        />
      </Grid>
    </Grid>

    </Box>
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div>
  <PropDebugger propsToDebug={{ values, errors }} />
  <Box mt={2}>
      <form onSubmit={handleSubmit}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <PageHeader routeName={steps[activeStep]} />
        {stepContents[activeStep]}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          {activeStep === steps.length - 1 ? (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <FormButtons
                handleClose={handleClose}
                handleClearForm={handleClearForm}
                submitting={submitting}
                showStepperBack={true}
                handleBack={handleBack}
                activeStep={activeStep}
              />
            </Box>
          ) : (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                sx={{ minWidth: 100 }}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                variant="contained"
                color="primary"
                sx={{ minWidth: 100 }}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>
      </form>
  </Box>
</div>
  );
};

export default AddUsersForm;