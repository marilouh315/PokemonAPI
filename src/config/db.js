// const mysql = require("mysql");
// const dotenv = require("dotenv");
// dotenv.config();

// const pool = mysql.createPool({
//     connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE
// });

// // open the MySQL connection
// pool.getConnection((error, connection) => {
//     if (error) throw error;
//     console.log("Successfully connected to the database.");
//     connection.release(); // Release the connection to the pool
// });

// module.exports = pool;
