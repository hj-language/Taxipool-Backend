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
                if (!err) {
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
            else {
                console.log(err, "ERROR");
                resolve(null);
            }
        })
    })
}

router.get('/', async (req, res, next) => {
    /*
        LIST: /api/rooms
        SEARCH: /api/rooms?startPoint=a&endPoint=b
    */
   let startPoint = req.query.startPoint;
   let endPoint = req.query.endPoint;
   let rooms;
   if (startPoint || endPoint) {            // SEARCH
   }
   else {                                   // LIST
        rooms = await SendQuery("SELECT * from room", null);
        if (rooms != null) { // 방이 없는 경우에도 성공
            res.status(200);
            res.send(rooms);
        }
        else {
            res.status(400);
            res.send();
        }
   }
});

router.post('/', async (req, res, next) => {
    let roomObj = {
        roomname: req.body.roomname,
        startpoint: req.body.startpoint,
        endpoint: req.body.endpoint,
        starttime: new Date(req.body.starttime),
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
        내 생각엔 클라이언트의 유저 id는 토큰에서 얻기
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

router.delete('/:id', async (req, res, next) => {
    if (await SendQuery("DELETE FROM room where roomno=?", req.params.id) != null)
        res.status(200);
    else
        res.status(400);
    res.send();
});

module.exports = router;