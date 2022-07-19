import mysql from "mysql";
import config from "./config.js";

console.log(123)

export default new Promise((resolve, reject) => {
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
                resolve(pool);
            }
        } catch (err) {
            console.log("MySQL error", err);
            process.exit(1)
        }

    });
});
console.log(1233)