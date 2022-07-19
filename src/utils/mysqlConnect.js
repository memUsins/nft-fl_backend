import mysql from "mysql";
import config from "./config.js";

let pool = mysql.createPool({
    host: config.db_host,
    user: config.db_login,
    password: config.db_pass,
    database: config.db_table,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, con) => {
    if (err) {
        console.log("DB is not connected", err);
        process.exit(1)
    }
    try {
        if (con) {
            con.release();
            console.log("DB is connected")
        }
    } catch (err) {
        console.log("MySQL error", err);
        process.exit(1)
    }

});

export default pool;