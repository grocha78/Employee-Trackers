const inquirer = require('inquirer')
const mysql = require('mysql2')
const cTable = require('console.table')

// set up mysql connection
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Grocha@78',
      database: 'employee_tracker_db'
    },

    console.log(`Connected to the database`)
);


// initialise variables
let loopRunning = true;

let departmentsArray = []
let employeesArray = []
let rolesArray = []

let allTitles = []
let allEmployees = []
let allDepartments = []


// in order to use async/await, we must put all our code inside a function
const runApplication = async function() {

    // create loop that continues forever, the only way to exit loop is for user to exit application
    while(loopRunning) {

        // at the start of every loop, get new array of departments from the database
        db.query('SELECT department_name FROM departments', (err, results) => {

            // get results from database and equal that to departmentsArray
            departmentsArray = results

            // loop through departmentsArray and for each entree, push the department_name into allDepartments array
            departmentsArray.forEach(function(object) {
                allDepartments.push(object.department_name)
            })
        })

        // at the start of every loop, get new array of roles from the database
        db.query('SELECT title, department_name, salary FROM roles', (err, results) => {

            // get results from database and equal that to rolesArray
            rolesArray = results

            // loop through rolesArray and for each entree, push the title of the role into allTitles array
            rolesArray.forEach(function(element) {
                allTitles.push(element.title)
            })
        })

        // at the start of every loop, get new array of employees from the database
        db.query('SELECT first_name, last_name, title, manager FROM employees', (err, results) => {

            // get results from database and equal that to employeesArray
            employeesArray = results

            // loop through employeesArray and for each entree, push into the allEmployees array a string that contains both the first name and last name of the employee
            employeesArray.forEach(function(element) {
                allEmployees.push(`${element.first_name} ${element.last_name}`)
            })

        })



        // prompt user in terminal with list of options
        const p = await inquirer.prompt([
            {
                type: 'list',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
                message: "What would you like to do",
                name: 'option'
            },
        ])


        // based on the user's response, execute the relevant if-else block
        if(p.option === 'View All Employees') {

            // execute MySQL command from nodejs, select the entire employees table
            db.query('SELECT * FROM employees', (err, results) => {

                // if there is an error, log the error
                if(err) console.log(err)
            
                // create white space in terminal
                console.log('\n\n\n')
            
                // log results as table in terminal
                console.table(results)

                // create white space in terminal
                console.log('\n\n\n\n\n\n\n')
            })

        } else if(p.option === 'Add Employee') {

            // ask user questions about the employee they want to add
            let employeePromiseObject = await inquirer.prompt([
                {
                    type: 'input',
                    message: "What is the employee's first name?",
                    name: 'employeeFirstName'
                },
                {
                    type: 'input',
                    message: "What is the employee's last name?",
                    name: 'employeeLastName'
                },
                {
                    type: 'list',
                    choices: allTitles,
                    message: "What is the employee's role?",
                    name: 'employeeRole'
                },
                {
                    type: 'list',
                    choices: allEmployees,
                    message: "Who is the employee's manager?",
                    name: 'employeeManager'
                },
            ])

            // we need to store the title, the department of that title, and the salary of that title in variables
            let currentTitle;
            let currentDepartment;
            let currentSalary;

            // loop through roles array, and if the title property of the current iteration's object is equal to what the user selected for the employeeRole, then assign the three variables above accordingly
            rolesArray.forEach(function(object) {
                if(object.title === employeePromiseObject.employeeRole) {
                    currentTitle = object.title
                    currentDepartment = object.department_name
                    currentSalary = object.salary
                }
            })

            // execute MySQL command in nodejs, insert the new employee into employees table
            db.query(`INSERT INTO employees (first_name, last_name, title, department, salary, manager) VALUES ('${employeePromiseObject.employeeFirstName}', '${employeePromiseObject.employeeLastName}', '${currentTitle}', '${currentDepartment}', ${currentSalary}, '${employeePromiseObject.employeeManager}')`, (err, results) => {

                // if there is an error, log that error to the console
                if(err) console.log(err)

                // add white space in terminal
                console.log('\n\n\n\n\n\n\n\n\n')
            })

        } else if(p.option === 'Update Employee Role') {
            
            // ask user questions about which employee role they want to update
            let updateRolePromiseObject = await inquirer.prompt([
                {
                    type: 'list',
                    choices: allEmployees,
                    message: "Which employee's role do you want to update?",
                    name: 'roleUpdateFullName'
                },
                {
                    type: 'list',
                    choices: allTitles,
                    message: "Which role do you want to assign the selected employee?",
                    name: 'newRole'
                },
            ])

            // based off the user's answers, store the first name and last name of the employee in variables
            const firstName = updateRolePromiseObject.roleUpdateFullName.split(' ')[0]
            const lastName = updateRolePromiseObject.roleUpdateFullName.split(' ')[1]
            
            // need to store the employee's title, department and salary in variables too
            let updateRoleTitle;
            let updateRoleDepartment;
            let updateRoleSalary;

            // loop through roles array, if the title property of the current iteration's object is the same as what the user selected as the newRole, then assign the three variables above accordingly
            rolesArray.forEach(function(object) {
                if(object.title === updateRolePromiseObject.newRole) {
                    updateRoleTitle = object.title
                    updateRoleDepartment = object.department_name
                    updateRoleSalary = object.salary
                }
            })

            // execute MySQL command in nodejs, update employees table
            db.query(`UPDATE employees SET title = '${updateRoleTitle}', department = '${updateRoleDepartment}', salary = ${updateRoleSalary} WHERE first_name = '${firstName}' and last_name = '${lastName}'`, (err, results) => {

                // if there is an error, log that error to the console
                if(err) console.log(err)

                // add white space in terminal
                console.log('\n\n\n\n\n\n\n\n\n')
            })

        } else if(p.option === 'View All Roles') {
            
            // execute MySQL command in nodejs, select everything from roles table
            db.query('SELECT * FROM roles', (err, results) => {

                // if there is an error, log it to the console
                if(err) console.log(err)

                // add white space in terminal
                console.log('\n\n\n')
            
                // log results to the terminal as a table
                console.table(results)

                // add white space in terminal
                console.log('\n\n\n\n\n\n\n')
            })

        } else if(p.option === 'Add Role') {
            
            // ask user questions about the role they want to add
            let rolePromiseObject = await inquirer.prompt([
                {
                    type: 'input',
                    message: "What is the name of the role?",
                    name: 'roleName'
                },
                {
                    type: 'input',
                    message: "What is the salary of the role?",
                    name: 'roleSalary'
                },
                {
                    type: 'list',
                    choices: allDepartments,
                    message: "What department does the role belong to?",
                    name: 'roleDepartment'
                },
            ])

            // execute MySQL command in nodejs, insert into roles table
            db.query(`INSERT INTO roles (title, department_name, salary) VALUES ('${rolePromiseObject.roleName}', '${rolePromiseObject.roleDepartment}', '${rolePromiseObject.roleSalary}')`, (err, results) => {

                // if there is an error, log it to the console
                if(err) console.log(err)

                // add white space in terminal
                console.log('\n\n\n\n\n\n\n\n\n')
            })
            
        } else if(p.option === 'View All Departments') {
            
            // execute MySQL command in nodejs, select the entire departments table
            db.query('SELECT * FROM departments', (err, results) => {

                // if there is an error, log it to the console
                if(err) console.log(err)

                // add white space in terminal
                console.log('\n\n\n')
            
                // log results to terminal as a table
                console.table(results)

                // add white space in terminal
                console.log('\n\n\n\n\n\n\n\n\n')   
            })

        } else if(p.option === 'Add Department') {
            
            // ask user question about what department they want to add
            let departmentPromiseObject = await inquirer.prompt([
                {
                    type: 'input',
                    message: "What is the name of the department?",
                    name: 'departmentName' 
                },
            ])

            // execute MySQL command in nodejs, insert into departments table
            db.query(`INSERT INTO departments (department_name) VALUES ('${departmentPromiseObject.departmentName}')`, (err, results) => {

                // if there is an error, log that error to the console
                if(err) console.log(err)

                // add white space in terminal
                console.log('\n\n\n\n\n\n\n\n\n')
            })

        }

    }

}



// execute function
runApplication()