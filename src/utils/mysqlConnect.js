import mysql from "mysql";
import config from "./config.js";

let connection = mysql.createConnection({
    host: config.db_host,
    user: config.db_login,
    password: config.db_pass,
    database: config.db_table
});

connection.connect();

console.log({
    status: true,
    message: "Database is connected"
});

export default connection;