const db = require("../db/connection")
const inquirer = require('inquirer')



//view all employees
//return a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

//add a department
//prompted to enter the name of the department and that department is added to the database

//add a role
//prompted to enter the name, salary, and department for the role and that role is added to the database

//add an employee
//prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
// const emp = Emp.getAll()
// const managerChoice = emp.map(({id, first_name, last_name}) => ({
//     name: `${first_name} ${last_name}`,
//     value: id
// }))

// const managerId = await inquirer.prompt({
//     type: 'list',
//     name: 'addEmployee',
//     message: 'Select which employee you wish to add. If none, click none.',
//     choices:managerChoice
// })

// db.query("set into employee  ?, ?, ?, ?", [first_name,last_name,role_id,managerId])
//update an employee role
//prompted to select an employee to update and their new role and this information is updated in the database
