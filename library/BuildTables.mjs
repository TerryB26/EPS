import pkg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const { Pool } = pkg;

console.log("🚀 ~ Connecting to database with connection string:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createTables = async () => {
  const client = await pool.connect();
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
        ('${uuidv4()}', 'Jane', 'Smith', 'jane.smith@example.com', 'password123', '0987654321', '1990-02-02', NULL, NULL),
        ('${uuidv4()}', 'Alice', 'Johnson', 'alice.johnson@example.com', 'password123', '1112223333', '1985-03-03', NULL, NULL),
        ('${uuidv4()}', 'Bob', 'Brown', 'bob.brown@example.com', 'password123', '4445556666', '1975-04-04', NULL, NULL),
        ('${uuidv4()}', 'Charlie', 'Davis', 'charlie.davis@example.com', 'password123', '7778889999', '1995-05-05', NULL, NULL),
        ('${uuidv4()}', 'Diana', 'Evans', 'diana.evans@example.com', 'password123', '0001112222', '1988-06-06', NULL, NULL),
        ('${uuidv4()}', 'Eve', 'Foster', 'eve.foster@example.com', 'password123', '3334445555', '1992-07-07', NULL, NULL),
        ('${uuidv4()}', 'Frank', 'Green', 'frank.green@example.com', 'password123', '6667778888', '1983-08-08', NULL, NULL),
        ('${uuidv4()}', 'Grace', 'Harris', 'grace.harris@example.com', 'password123', '9990001111', '1991-09-09', NULL, NULL),
        ('${uuidv4()}', 'Hank', 'Ivy', 'hank.ivy@example.com', 'password123', '2223334444', '1987-10-10', NULL, NULL);

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
        ('${uuidv4()}', (SELECT UserID FROM Users WHERE Email = 'john.doe@example.com'), (SELECT DepartmentID FROM Departments WHERE DepartmentName = 'HR'), (SELECT EmploymentTypeID FROM EmploymentTypes WHERE EmploymentTypeName = 'Full-Time'), '2020-01-01', NULL, NULL),
        ('${uuidv4()}', (SELECT UserID FROM Users WHERE Email = 'jane.smith@example.com'), (SELECT DepartmentID FROM Departments WHERE DepartmentName = 'Engineering'), (SELECT EmploymentTypeID FROM EmploymentTypes WHERE EmploymentTypeName = 'Part-Time'), '2021-02-02', NULL, NULL);
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