import mysql from "mysql";
import config from "./config.js";
let connection
try {
    connection = mysql.createPool({
        host: config.db_host,
        user: config.db_login,
        password: config.db_pass,
        database: config.db_table,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
} catch (err) {
    connection = null;
    console.log("Database is droped", err)
    process.exit(1)
}


export default connection;