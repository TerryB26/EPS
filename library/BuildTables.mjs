import pkg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const { Pool } = pkg;

console.log("🚀 ~ Connecting to database with host:", process.env.DBHOST);

const pool = new Pool({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  database: process.env.DBNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createTables = async () => {
  const client = await pool.connect();
  console.log("🚀 ~ createTables ~ client:", client)
  try {
    const queryText = `
      CREATE TABLE IF NOT EXISTS Users (
        UserID UUID PRIMARY KEY,
        Name VARCHAR(100),
        Surname VARCHAR(100),
        Email VARCHAR(100) UNIQUE NOT NULL,
        Password VARCHAR(100) NOT NULL,
        Phone VARCHAR(15),
        DateOfBirth DATE,
        CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CreatedBy UUID,
        UpdatedBy UUID
      );

      CREATE TABLE IF NOT EXISTS Roles (
        RoleID UUID PRIMARY KEY,
        RoleName VARCHAR(100) NOT NULL,
        CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CreatedBy UUID,
        UpdatedBy UUID
      );

      CREATE TABLE IF NOT EXISTS UserRoles (
        UserRoleID UUID PRIMARY KEY,
        UserID UUID REFERENCES Users(UserID),
        RoleID UUID REFERENCES Roles(RoleID),
        CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CreatedBy UUID,
        UpdatedBy UUID
      );

      CREATE TABLE IF NOT EXISTS Departments (
        DepartmentID UUID PRIMARY KEY,
        DepartmentName VARCHAR(100) NOT NULL,
        CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CreatedBy UUID,
        UpdatedBy UUID
      );

      CREATE TABLE IF NOT EXISTS DepDivision (
        DepDivisionID UUID PRIMARY KEY,
        DepartmentID UUID REFERENCES Departments(DepartmentID),
        DepDivisioName VARCHAR(100) NOT NULL,
        CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CreatedBy UUID,
        UpdatedBy UUID
      );

      CREATE TABLE IF NOT EXISTS EmploymentTypes (
        EmploymentTypeID UUID PRIMARY KEY,
        EmploymentTypeName VARCHAR(100) NOT NULL,
        CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CreatedBy UUID,
        UpdatedBy UUID
      );
      
      CREATE TABLE IF NOT EXISTS JobTitles (
        JobTitleID UUID PRIMARY KEY,
        JobTitleName VARCHAR(100) NOT NULL,
        CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CreatedBy UUID,
        UpdatedBy UUID
      );

      CREATE TABLE IF NOT EXISTS Employees (
        EmployeeID UUID PRIMARY KEY,
        UserID UUID REFERENCES Users(UserID),
        DepartmentID UUID REFERENCES Departments(DepartmentID),
        EmploymentTypeID UUID REFERENCES EmploymentTypes(EmploymentTypeID),
        EmployedOn DATE,
        CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CreatedBy UUID,
        UpdatedBy UUID
      );
    `;
    await client.query(queryText);
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    client.release();
  }
};

const seedTables = async () => {
  const client = await pool.connect();
  try {
    const queryText = `
      INSERT INTO Users (UserID, Name, Surname, Email, Password, Phone, DateOfBirth, CreatedBy, UpdatedBy)
      VALUES 
        ('${uuidv4()}', 'John', 'Doe', 'john.doe@example.com', 'password123', '1234567890', '1980-01-01', NULL, NULL),
        ('${uuidv4()}', 'Jane', 'Smith', 'jane.smith@example.com', 'password123', '0987654321', '1990-02-02', NULL, NULL);

      INSERT INTO Roles (RoleID, RoleName, CreatedBy, UpdatedBy)
      VALUES 
        ('${uuidv4()}', 'Admin', NULL, NULL),
        ('${uuidv4()}', 'User', NULL, NULL);

      INSERT INTO Departments (DepartmentID, DepartmentName, CreatedBy, UpdatedBy)
      VALUES 
        ('${uuidv4()}', 'HR', NULL, NULL),
        ('${uuidv4()}', 'Engineering', NULL, NULL);

      INSERT INTO EmploymentTypes (EmploymentTypeID, EmploymentTypeName, CreatedBy, UpdatedBy)
      VALUES 
        ('${uuidv4()}', 'Full-Time', NULL, NULL),
        ('${uuidv4()}', 'Part-Time', NULL, NULL);

      INSERT INTO JobTitles (JobTitleID, JobTitleName, CreatedBy, UpdatedBy)
      VALUES 
        ('${uuidv4()}', 'Manager', NULL, NULL),
        ('${uuidv4()}', 'Developer', NULL, NULL);

      INSERT INTO Employees (EmployeeID, UserID, DepartmentID, EmploymentTypeID, EmployedOn, CreatedBy, UpdatedBy)
      VALUES 
        ('${uuidv4()}', (SELECT UserID FROM Users WHERE Email = 'john.doe@example.com'), (SELECT DepartmentID FROM Departments WHERE DepartmentName = 'HR'), (SELECT EmploymentTypeID FROM EmploymentTypes WHERE EmploymentTypeName = 'Full-Time'), '2020-01-01', NULL, NULL);
    `;
    await client.query(queryText);
    console.log("Tables seeded successfully");
  } catch (error) {
    console.error("Error seeding tables:", error);
  } finally {
    client.release();
  }
};

createTables()
  .then(() => seedTables())
  .catch((error) => console.error("Error in createTables or seedTables script:", error));