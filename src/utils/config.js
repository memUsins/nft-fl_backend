export default {
    PORT: process.env.PORT || 1337,
    URL: '0.0.0.0',
    db_host: process.env.MYSQL_HOST,
    db_login: process.env.MYSQL_LOGIN,
    db_pass: process.env.MYSQL_PASS,
    db_table: process.env.MYSQL_TABLE,
}