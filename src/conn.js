const mysql = require('mysql');
const dbInfo = require('./secret.js').dbInfo;

const init = () => {
    return mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.user,
        password: dbInfo.password,
        database: dbInfo.database,
        port: dbInfo.port
    });
};

const dbConn = init();

exports.SendQuery = (sql, obj) => {
    return new Promise((resolve, reject) => {
        dbConn.query(sql, obj, (err, rows) => {
            if (!err) {
                console.log(sql, obj, "connect success");
                resolve(rows);
            }
            else {
                console.log(err, "ERROR");
                resolve(null);
            }
        });
    });
};