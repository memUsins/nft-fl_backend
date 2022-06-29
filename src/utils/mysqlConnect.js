import mysql from "mysql";
import config from "./config.js";

const connection = mysql.createPool({
    host: config.db_host,
    user: config.db_login,
    password: config.db_pass,
    database: config.db_table,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default connection;