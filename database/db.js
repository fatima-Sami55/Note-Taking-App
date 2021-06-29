const mysql = require('mysql');
require('dotenv').config();
const connection = mysql.createConnection({
    socketPath:'/cloudsql/noteapp-318213:us-east1:mysql',
    host: '35.243.227.171',
    user: 'root',
    password: 'mysql',
    database: 'noteapp',
    multipleStatements: true,
    canRetry: true,
  })
  
  connection.connect((err) => {
    if (err) throw err;
    console.log('Database Connected')
  })

  module.exports = connection;