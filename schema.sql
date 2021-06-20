DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;
USE employeeDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,

  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  manager_id INT,
  role_id INT,
  
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name)
VALUES  ("Administrative Operations"), 
        ("Marketing"), 
        ("Sales"), 
        ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES  ("Administrative Assistant", 38000, 1), 
        ("Sales Representative", 55000, 3), 
        ("Marketing Specialist", 50000, 2), 
        ("HR Representative", 45000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Harry", "Potter", 1, null),
        ("Ron", "Weasley", 2, 1),
        ("Hermione", "Granger", 3, 1),
        ("Draco", "Malfoy", 4, 1);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
