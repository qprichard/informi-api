const mysql = require('mysql');
const { config } = require('./utils/helpers');

const {
  DB_NAME,
  DB_USR,
  DB_PWD,
  DB_HOST
} = config;

const con = mysql.createConnection({
  host: DB_HOST,
  user: DB_USR,
  password: DB_PWD,
  database: DB_NAME
});

module.exports = con;
