const db = require('./db/connection');
const inquirer = require('inquirer')
const consoleTable = require('console.table')
const { choiceSelection } = require('./utils/sqlFunctions')

// DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');

    choiceSelection()
});