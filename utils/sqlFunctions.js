const db = require('../db/connection');
const inquirer = require('inquirer')
const consoleTable = require('console.table')

//application start
//prompted to view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee's role
const choiceSelection = () => {
    inquirer.prompt({
        type: 'list',
        name: 'choiceSelection',
        message: 'What would you like to do?',
        choices:[
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "View Employees By Department",
          "View Employees By Manager",
          "View A Department's Budget",
          "Add A Department",
          "Add A Role",
          "Add An Employee",
          "Update An Employee's Role",
          "Update An Employee's Manager",
          "Delete An Employee",
          "Delete A Role",
          "Delete A Department",
          "Nothing"
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
                viewAllRoles();
                break;
            case "View All Employees":
                //view all employees;
                viewAllEmployees();
                break;
            case "View Employees By Department":
                //view employees by department;
                viewEmployeesByDepartment();
                break;
            case "View Employees By Manager":
                //view employees by manager;
                viewEmployeesByManager();
                break;
            case "View A Department's Budget":
                //view a department's budget;
                viewDepartmentBudget();
                break;
            case "Add A Department":
                //add a department;
                addDepartment();
                break;
            case "Add A Role":
                //add a role;
                addRole();
                break;
            case "Add An Employee":
                //add an employee;
                addEmployee();
                break;
            case "Update An Employee's Role":
                //update an employee's role;
                updateEmployeeRole();
                break;
            case "Update An Employee's Manager":
                //update an employee's manager;
                updateEmployeeManager();
                break;
            case "Delete An Employee":
                //delete an employee;
                deleteAnEmployee();
                break;
            case "Delete A Role":
                //delete a role;
                deleteRole();
                break;
            case "Delete A Department":
                //delete a department;
                deleteDepartment();
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
        console.log("===================================================================");
        console.table(res);
      
        choiceSelection();
    });
}

//view all roles
//return table with the job title, role id, the department that role belongs to, and the salary for that role
const viewAllRoles = () => {
    const sql = `SELECT  
                roles.id AS "ID",
                roles.title AS "Title",
                roles.salary AS "Salary",
                departments.name AS "Department"
                FROM roles
                LEFT JOIN departments
                ON roles.department_id = departments.id`;
    db.query(sql, function (err, res) {
        if (err) throw err;
        console.log("===================================================================");
        console.table(res);
    
        choiceSelection();
    });
}

//view all employees
//return a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
const viewAllEmployees = () => {
    const sql = `SELECT employee.id AS id, 
                employee.first_name, 
                employee.last_name, 
                roles.title, 
                departments.name AS department, 
                roles.salary,
                CONCAT (manager.first_name, " ",manager.last_name) AS manager
                FROM employee
                LEFT JOIN roles ON employee.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    db.query(sql, function (err, res) {
        if (err) throw err;
        console.log("===================================================================");
        console.table(res);

        choiceSelection();
    });
}

const viewEmployeesByDepartment = () => {
    db.query(`SELECT * FROM departments`, (err, res) => {
        if (err) {
            console.log(err);
        }
        const department = res.map(({ id, name }) => ({name: name, value: id}))
        
        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: "Please select the department.",
                choices: department 
            }
        ])
        .then(departmentInput => {
            const dept = departmentInput.dept
            console.log(dept)
            
            db.query(`Select CONCAT (first_name, " ", last_name) AS name 
                    From employee
                    LEFT JOIN roles ON roles.id = employee.role_id
                    LEFT JOIN departments ON departments.id = roles.department_id
                    WHERE departments.id = ?`, dept, (err, res) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log("===================================================================");
                        console.table(res)
      
                        choiceSelection();            
                    })
        });
    });
};

const viewEmployeesByManager = () => {
    db.query(`SELECT * FROM employee WHERE manager_id IS NULL`, (err, res) => {
        if (err) {
            console.log(err);
        }
        const managers = res.map(({ id, first_name, last_name }) => ({name: first_name + " " + last_name, value: id}))
        managers.push({name:"None" , value: null})
        inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: "Select manager",
                choices: managers 
            }
        ])
        .then(managerAnswer => {
            const manager = managerAnswer.manager
            params = manager

            db.query(`Select CONCAT (first_name, " ", last_name) AS name From employee WHERE manager_id = ?`, params, (err, res) => {
                if(err) {
                    console.log(err);
                }
                console.log("===================================================================");
                console.table(res);
    
                choiceSelection();
            })
        });
    });
};

const viewDepartmentBudget = () => {
    db.query(`SELECT * FROM departments`, (err, res) => {
        if(err) {
            console.log(err);
        }
        const departments = res.map(({id, name}) => ({ name: name, value: id }));
        
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Select department budget',
                choices: departments
            }
        ])
        .then(departmentInput => {
            const dept = departmentInput.department;
            
            db.query(`SELECT SUM(salary) AS budget FROM roles WHERE department_id = ?`, dept, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log("===================================================================");
                console.table(res);
    
                choiceSelection(); 
            });
        });
    });
};

//add a department
//prompted to enter the name of the department and that department is added to the database
const addDepartment = () => {
    inquirer
    .prompt({
            type: 'input',
            name: 'department',
            message: "Enter department name",
            validate: departmentInput => {
                if (departmentInput) {
                    return true;
                } else {
                    console.log("Please enter department name!")
                }
            } 
    })
    .then(data => {
        db.query(`INSERT INTO departments (name) VALUES (?)`, data.department, (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log("===================================================================");
            console.log("Department added!");

            choiceSelection();
        })
    })
};

//add a role
//prompted to enter the name, salary, and department for the role and that role is added to the database
const addRole = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'role',
            message: "Enter role name",
            validate: roleInput => {
                if (roleInput) {
                    return true;
                } else {
                    console.log("Please enter role name!")
                }
           } 
        },
        {
            type: 'input',
            name: 'salary',
            message: "Enter role salary",
            validate: salaryInput => {
                if (salaryInput) {
                    return true;
                } else {
                    console.log("Please enter role salary!");
                }
           } 
        }
    ])
        .then(data => {
            const params = [data.role, data.salary]
            
            db.query(`SELECT * FROM departments`, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log(res)
                const departments = res.map(({id, name}) => ({name: name, value: id}));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: "Enter role department",
                        choices: departments
                    }
                ])
                .then(departmentInput => {
                    const department = departmentInput.department;
                    params.push(department);

                    db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, params, (err, res) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log("===================================================================");
                        console.log("Role added!");
            
                        choiceSelection();
                });
            });
        });
    });
};

//add an employee
//prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
const addEmployee = () => {
    
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Enter employee's first name",
            validate: firstNameInput => {
                if (firstNameInput) {
                    return true;
                } else {
                    console.log("Please enter employee's first name!");
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Enter employee's last name",
            validate: lastNameInput => {
                if (lastNameInput) {
                    return true;
                } else {
                    console.log("Please enter employee's last name!");
                }
            }
        }
    ])
    .then(response => {
        const params = [response.firstName, response.lastName]

        // query function for employee roles
        db.query(`SELECT roles.id, roles.title FROM roles`, (err, res) => {
            if (err) {
                console.log(err);
            }

            const roles = res.map(({ id, title}) => ({ name: title, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "Enter employee's role",
                    choices: roles
                }
            ])
            .then(roleInput => {
                const role = roleInput.role
                params.push(role);

                db.query(`SELECT * FROM employee WHERE manager_id IS NULL`, (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    const managers = res.map(({ id, first_name, last_name }) => ({name: first_name + " " + last_name, value: id}))
                    managers.push({name:"None" , value: null})
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Enter employee's manager",
                            choices: managers 
                        }
                    ])
                    .then(managerInput => {
                        const manager = managerInput.manager
                        params.push(manager);

                        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                                Values (?, ?, ?, ?)`, params, (err, res) => {
                                        if (err) {
                                            console.log(err);
                                }
                            console.log("===================================================================");
                            console.log("Employee added!")

                            choiceSelection();
                        })
                    });
                });
            });
        });
    });  
};

//update an employee's role
//prompted to select an employee to update and their new role and this information is updated in the database
const updateEmployeeRole = () => {
    
    db.query(`SELECT * FROM employee`, (err, res) => {
        if(err) {
            console.log(err);
        }
        const employees = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select employee to update',
                choices: employees
            }
        ])
        .then(employeeInput => {
            const emp = employeeInput.employee;
            const params = []

            params.push(emp);
            
            db.query(`SELECT * FROM roles`, (err,res) => {
                if(err) {
                    console.log(err)
                }
                const roles = res.map(({id, title}) => ({name: title, value: id}))

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roles',
                        message: 'Select new role',
                        choices: roles
                    }
                ])
                .then(roleInput => {
                    const role = roleInput.roles;
                    params.push(role);
                    
                    // change order of params in order to insert proper values into employee
                    params[0] = role;
                    params[1] = emp;

                    db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, params, (err, res) => {
                        if(err) {
                        console.log(err)
                        }
                        console.log("===================================================================");
                        console.log("Employee role updated!");
            
                        choiceSelection();    
                    })
                })
            })
        }) 
    })
};

//update employee manager
//prompt user to select which manager should manage selected employee
const updateEmployeeManager = () => {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if(err) {
            console.log(err);
        }
        const employees = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select employee to update',
                choices: employees
            }
        ])
        .then(employeeInput => {
            const emp = employeeInput.employee;
            const params = []

            params.push(emp);
            
            db.query(`SELECT * FROM employee WHERE manager_id IS NULL and id <>?`, params, (err, res) => {
                if (err) {
                    console.log(err);
                }
                const managers = res.map(({ id, first_name, last_name }) => ({name: first_name + " " + last_name, value: id}))
                managers.push({name:"None" , value: null})
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Enter employee's new manager",
                        choices: managers 
                    }
                ])
                .then(managerInput => {
                    const manager = managerInput.manager
                    params.push(manager);

                    params[0] = manager;
                    params[1] = emp;

                    db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, params, (err, res) => {
                        if(err) {
                            console.log(err);
                        }
                        console.log("===================================================================");
                        console.log("Employee manager updated!");
            
                        choiceSelection(); 
                    })
                });
            });  
        });
    });  
};

const deleteAnEmployee = () => {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if(err) {
            console.log(err);
        }
        const employees = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select employee to delete',
                choices: employees
            }
        ])
        .then(employeeInput => {
            const emp = employeeInput.employee;
            const params = []

            params.push(emp);
            
            db.query(`DELETE FROM employee WHERE id = ?`, emp, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log("===================================================================");
                console.log("Employee deleted!");
            
                choiceSelection(); 
            });
        });
    });
};

const deleteRole = () => {
    db.query(`SELECT * FROM roles`, (err, res) => {
        if(err) {
            console.log(err);
        }
        const roles = res.map(({ id, title }) => ({ name:title ,value: id }));
        
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Select role to delete',
                choices: roles
            }
        ])
        .then(roleAnswer => {
            const role = roleAnswer.role;
            
            db.query(`DELETE FROM roles WHERE id = ? `, role, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log("===================================================================");
                console.log("Role successfully deleted!");          
                
                choiceSelection();
            });
        });
    });
};

const deleteDepartment = () => {
    db.query(`SELECT * FROM departments`, (err, res) => {
        if(err) {
            console.log(err);
        }
        const departments = res.map(({ id, name }) => ({ name: name, value: id }));
        
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Select department to delete',
                choices: departments
            }
        ])
        .then(departmentInput => {
            const dept = departmentInput.department;
            
            db.query(`DELETE FROM departments WHERE id = ?`, dept, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log("===================================================================");
                console.log("Department successfully deleted!");
            
                choiceSelection();
            });
        });
    });
};

module.exports = { choiceSelection }