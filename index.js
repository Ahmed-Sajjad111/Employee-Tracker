const db = require('./db/connection');

// DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
});