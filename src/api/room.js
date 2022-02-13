const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const dbConn = require('../conn.js').init();

/*
    - test path: http://localhost:3000/api/rooms/test
    - 토큰 검증 미들웨어 추가하기
*/

router.get('/test', async (req, res, next) => {
    function test(sql, obj) {
        return new Promise((res, rej) => {
            dbConn.query(sql, obj, (err, rows) => {
                if (!err)
                {
                    console.log(rows);
                    res();
                }
                else {
                    console.log(err);
                    rej();
                }
            })
        })
    }
    //await test("DELETE FROM room where roomname='myROOM'", []);
    await test("SELECT * FROM room", []);
    res.send("ok");
});

function SendQuery(sql, obj) {
    return new Promise((resolve, reject) => {
        dbConn.query(sql, obj, (err, rows) => {
            if (!err) {
                console.log(sql, obj, "connect success");
                resolve(rows);
            }
            console.log(err);
            reject(null);
        })
    })
}

router.get('/', (req, res, next) => {
    /*
        LIST: /api/rooms
        SEARCH: /api/rooms?start-point="a"&end-point="b"
        query 이용하여 start point, end point 받기
    */
});

router.post('/', async (req, res, next) => {
    let roomObj = {
        roomname: req.body.roomname,
        startpoint: req.body.startpoint,
        endpoint: req.body.endpoint,
        starttime: req.body.starttime,
        currentmember: req.body.currentmember,
        totalmember: req.body.totalmember,
        createtime: new Date()
    }

    if (await SendQuery("INSERT INTO room SET ?", roomObj))
        res.status(200);
    else
        res.status(400);

    res.send();
});

router.get('/:id', async (req, res, next) => {
    let row = await SendQuery("SELECT * FROM room WHERE roomid=?", req.params.id);
    if (row) {
        /* 해당 id의 room이 존재하면 아래 넘겨주기
        leaderid, roomname, startpoint, endpoint, starttime, currentmember, totalmember, createtime, comments, isRide
        comments랑 isRide는 테이블 따로 만들고 거기에서 받아와야 함
        내 생각엔 클라이언트의 유저 id를 req.body로 안 받고 query로 받아도 될 것 같음
        */
        res.status(200);
    }
    else {
        res.status(400);
    }
});

router.put('/:id', (req, res, next) => {
    /*
        UPDATE: /api/rooms/1
        RIDE IN/OUT: /api/rooms/1?isRide=true or false
        query 이용하여 isRide 받기
    */
});

router.delete('/:id', (req, res, next) => {
    if (await SendQuery("DELETE FROM room where roomid=?", req.params.id))
        res.status(200);
    else
        res.status(400);
    res.send();
});

module.exports = router;