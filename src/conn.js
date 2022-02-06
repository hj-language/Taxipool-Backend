const mysql = require('mysql');
const dbInfo = require('./secret.js').dbInfo;

module.exports = {
    init: () => {
        return mysql.createConnection({
            host: dbInfo.host,
            user: dbInfo.user,
            password: dbInfo.password,
            database: dbInfo.database,
            port: dbInfo.port
        });
    }
}