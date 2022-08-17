-- if database already exists, delete it
DROP DATABASE IF EXISTS employee_tracker_db;

-- create new database
CREATE DATABASE employee_tracker_db;

-- this is to tell MySQL that the code below refers to this database
USE employee_tracker_db;



-- create employees table
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    title VARCHAR(30) NOT NULL,
    department VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    manager VARCHAR(30)
);

-- create departments table
CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

-- create roles table
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL
);
