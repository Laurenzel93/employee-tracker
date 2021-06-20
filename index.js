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
connection.connect((err, res) => {
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
const roles = [];
const departments = [];
const managers = ["No Manager"];
const yesOrNo = ["Yes", "No"];



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

function viewDept() {
    connection.query("SELECT department.name AS 'Department', employee.first_name AS 'First Name', employee.last_name AS 'Last Name' FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department.name;", (err, res) => {
        if (err) throw err;
        console.log('\n', 'All departments: ');
        console.table('\n', res);
        init();
    });
}
function viewRole() {
    connection.query("SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS Title FROM employee JOIN role ON employee.role_id = role.id ORDER BY employee.last_name;", (err, res) => {
        if (err) throw err;
        console.log('\n', 'All roles: ');
        console.table('\n', res);
        init();
    });
}

function viewEmployee() {
    connection.query("SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', role.salary AS 'Salary (USD)', department.name AS 'Department', CONCAT(boss.first_name, ' ', boss.last_name) AS 'Manager' FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee boss ON employee.manager_id = boss.id ORDER BY employee.id;", (err, res) => {
        if (err) throw err;
        console.log('\n', 'All employees: ');
        console.table('\n', res);
        init();
    });
}