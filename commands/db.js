const MySQl = require("mysql2/promise");
const env = require("dotenv"); env.config();

const mysql = MySQl.createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    enableKeepAlive: true
});

module.exports = {
    mysql:mysql
}