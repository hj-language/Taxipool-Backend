const express = require('express');
const router = express.Router();

const dbConn = require('../conn.js').init();

function checkWithDB(id) {
    let query = 'SELECT * FROM MEMBER WHERE id=?;';
    return new Promise((resolve, reject) => {
        dbConn.query(query, [id], (err, rows) => {
            if (!err){  // DB 커넥션 성공
                console.log(query, id, "connect success");
                resolve(rows[0]);
            }
            console.log(err);
            reject();
        })
    });
}

function insertIntoDB(query, items) {
    return new Promise((resolve, reject) => {
        dbConn.query(query, items, (err, rows) => {
            if (!err) {
                console.log(query, items, "connect success");
                resolve();
            }
            console.log(err);
            reject();
        })
    })
}

router.post('/rooms', (req, res, next) => {
    let room = req.body;
    let query = "SELECT * FROM ROOMS;"
    dbConn.query(query, (err, rows) => {
        if (!err)
        {
            console.log(rows[0]);
        }
    })
});

// GET /room/update, GET /room/view
router.get('/rooms/:id', (req, res, next) => {
});

router.put('/rooms/:id', (req, res, next) => {
    /*
        UPDATE: /api/rooms/1
        RIDE IN/OUT: /api/rooms/1?isRide=true or false
        query 이용하여 isRide 받기
    */
});

router.delete('/rooms/:id', (req, res, next) => {
});

router.get('/rooms', (req, res, next) => {
    /*
        LIST: /api/rooms
        SEARCH: /api/rooms?start-point="a"&end-point="b"
        query 이용하여 start point, end point 받기
    */
});

module.exports = router;