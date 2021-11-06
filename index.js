const db = require('./db/connection');
const inquirer = require('inquirer')
const consoleTable = require('console.table')
const sqlFunctions = require('./utils/sqlFunctions')

// DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');

    choiceSelection()
});

//application start
//prompted to view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const choiceSelection = () => {
    inquirer.prompt({
        type: 'list',
        name: 'choiceSelection',
        message: 'What would you like to do?',
        choices:[
          'View All Departments',
          'View All Roles',
          'View All Employees',
          'Add A Department',
          'Add A Role',
          'Add An Employee',
          'Update An Employee Role',
          'Nothing'
        ]
      })
      .then((data) => {
        switch (data.choiceSelection) {
            case "View All Departments":
                //view all departments;
                viewAllDepartments();
                break;
            case "View All Roles":
                //view all roles;
                viewRoles();
                break;
            case "View All Employees":
                //view all employees;
                break;
            case "Add A Department":
                //add a department;
                break;
            case "Add A Role":
                //add a role;
                break;
            case "Add An Employee":
                //add an employee;
                break;
            case "Update An Employee Role":
                //update an employee role;
                break;
            case "Nothing":
                //Nothing;
                 break;
        }
    })
}

//view all departments
//return formatted table showing department names and department ids
const viewAllDepartments = () => {
    let query = `SELECT * FROM departments`;
    db.query(query, function (err, res) {
      if (err) throw err;
      console.table(res);
      
      choiceSelection();
    });
}

//view all roles
//return table with the job title, role id, the department that role belongs to, and the salary for that role
function viewRoles() {
    let query = `SELECT  
                        roles.id AS "ID",
                        roles.title AS "Title",
                        roles.salary AS "Salary",
                        departments.name AS "Department"
                   FROM roles
                   LEFT JOIN departments
                     ON roles.department_id = departments.id`;
    db.query(query, function (err, res) {
      if (err) throw err;
      console.table(res);

      choiceSelection();
    });
  }