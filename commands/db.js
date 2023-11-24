const MySQl = require("mysql2/promise");
const env = require("dotenv"); env.config();

const pool = {
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    enableKeepAlive: true
}

const mysql = MySQl.createPool(pool);

module.exports = {
    mysql:mysql
}