const db = require('./db/connection');
const { choiceSelection } = require('./utils/sqlFunctions')

// DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');

    choiceSelection()
});