const mysql = require('mysql');
require('dotenv').config();
const connection = mysql.createConnection({
    socketPath:'',
    host: '',
    user: '',
    password: '',
    database: '',
    multipleStatements: true,
    canRetry: true,
  })
  
  connection.connect((err) => {
    if (err) throw err;
    console.log('Database Connected')
  })

  module.exports = connection;
