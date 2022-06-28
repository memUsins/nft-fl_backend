import dotenv from 'dotenv';
// import bcrypt from "bcrypt";

dotenv.config();

export default {
    PORT: process.env.PORT || 1337,
    // SALT: bcrypt.genSaltSync(10)
    db_host: process.env.MYSQL_HOST,
    db_login: process.env.MYSQL_LOGIN,
    db_pass: process.env.MYSQL_PASS,
    db_table: process.env.MYSQL_TABLE,
}