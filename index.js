const inquirer = require('inquirer');
const mysql = require('mysql');
const consoleTable = require('console.table');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password123',
    database: 'employeeDB'
});
connection.connect((err, response) => {
    if (err) throw err;
});

const options = [
    "View department",
    "View role",
    "View employee",
    "Add new department",
    "Add new role",
    "Add new employee",
    "Update role",
    "Exit"
];

// Function to recognize new roles added by user
let roles = [];
const allRoles = function () {
    connection.query('SELECT * FROM role;',
        function (err, response) {
            if (err) throw err
            for (let i = 0; i < response.length; i++) {
                roles.push(response[i].title);
            }
        })
    return roles
};

//Starting questions
function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: options
        },
    ])
        .then(function (choice) {
            if (choice.action === "View department") {
                viewDept();
            } else if (choice.action === "View role") {
                viewRole();
            } else if (choice.action === "View employee") {
                viewEmployee();
            } else if (choice.action === "Add new department") {
                addDept();
            } else if (choice.action === "Add new role") {
                addRole();
            } else if (choice.action === "Add new employee") {
                addEmployee();
            } else if (choice.action === "Update role") {
                updateRole();
            } else if (choice.action === "Exit") {
                console.log("Goodbye");
                connection.end();
                return;
            }
        })
}
init();

// Allows user to view a department
function viewDept() {
    connection.query("SELECT department.name AS 'Department', employee.first_name AS 'First Name', employee.last_name AS 'Last Name' FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department.name;", (err, response) => {
        if (err) throw err;
        console.table('\n', response);
        init();
    });
}

// Allows user to view a role
function viewRole() {
    connection.query("SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS Title FROM employee JOIN role ON employee.role_id = role.id ORDER BY employee.last_name;", (err, response) => {
        if (err) throw err;
        console.table('\n', response);
        init();
    });
}

// Allows user to view an employee
function viewEmployee() {
    connection.query("SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', role.salary AS 'Salary (USD)', department.name AS 'Department', CONCAT(boss.first_name, ' ', boss.last_name) AS 'Manager' FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee boss ON employee.manager_id = boss.id ORDER BY employee.id;", (err, response) => {
        if (err) throw err;
        console.table('\n', response);
        init();
    });
}

//Adds a Department
function addDept() {
    inquirer.prompt([
        {
            message: 'What is the name of your new department?',
            name: 'newDeptName',
            type: 'input'
        }
    ]).then(data => {
        connection.query('INSERT INTO department SET ?',
            {
                name: data.newDeptName
            },
            err => {
                if (err) throw err
                console.table(data)
                init();
            })
    })
};

//Adds a Role
function addRole() {
    inquirer.prompt([
        {
            message: 'What is the name of your new role?',
            name: 'newRoleName',
            type: 'input'
        },
        {
            name: 'salary',
            message: 'What will the salary be?',
            type: 'input'
        }
    ])

        .then(data => {
            connection.query('INSERT INTO role SET ?',
                {
                    title: data.newRoleName,
                    salary: data.salary
                },
                err => {
                    if (err) throw err
                    console.table(data)
                    init();
                })
        })
};

//Adds an Employee
function addEmployee() {
    inquirer.prompt([
        {
            message: 'What is the first name of your new employee?',
            name: 'newFirstName',
            type: 'input'
        },
        {
            message: 'What is the last name of your new employee',
            name: 'newLastName',
            type: 'input'
        },
        {
            name: 'role',
            message: 'What will be the role of the new employee?',
            type: 'list',
            choices: allRoles()
        }
    ]).then(data => {
        let roleID = allRoles().indexOf(data.role) + 1;
        connection.query('INSERT INTO employee SET ?',
            {
                first_name: data.newFirstName,
                last_name: data.newLastName,
                role_id: roleID
            },
            err => {
                if (err) throw err
                console.table(data)
                init();
            })
    })
};