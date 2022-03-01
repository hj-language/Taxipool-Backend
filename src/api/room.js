const express = require('express');
const router = express.Router();
const SendQuery = require('../conn.js').SendQuery;

/*
    - test path: http://localhost:3000/api/rooms/test
    - 토큰 검증 미들웨어 추가하기
*/

router.get('/', async (req, res, next) => {
    /*
        LIST: /api/rooms
        SEARCH: /api/rooms?startPoint=a&endPoint=b
    */
   let startPoint = req.query.startPoint;
   let endPoint = req.query.endPoint;
   let rooms;
   let result = false;

   if (startPoint || endPoint) {            // SEARCH
        if (startPoint && endPoint)
            rooms = await SendQuery("SELECT * from room where startpoint=? and endpoint=? ;", [startPoint, endPoint]);
        else if (startPoint)
            rooms = await SendQuery("SELECT * from room where startpoint=? ;", startPoint);
        else
            rooms = await SendQuery("SELECT * from room where endpoint=? ;", endPoint);
        
        if (rooms != null)  // 방이 없는 경우에도 성공
            result = true;
   }
   else {                                   // LIST
        rooms = await SendQuery("SELECT * from room", null);
        if (rooms != null)
            result = true;
   }

   if (result) {
       res.status(200);
       res.send(rooms);
   }
   else {
       res.status(400).end();
   }
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
        res.status(200).end();
    else
        res.status(400).end();
});

router.get('/:id', async (req, res, next) => {
    let row = await SendQuery("SELECT * FROM room WHERE roomid=?", req.params.id);
    if (row) {
        let roomObj = {
            leaderid: row[0].leaderid,
            roomname: row[0].roomname,
            startpoint: row[0].startpoint,
            endpoint: row[0].endpoint,
            starttime: row[0].starttime,
            currentmember: row[0].currentmember,
            totalmember: row[0].totalmember,
            createtime: row[0].createtime,
        };
        res.status(200);
        res.send({
            room: roomObj,
            isRide: isRide // isRide 구하는 거 구현하기
        });
    }
    else {
        res.status(400).end();
    }
});

router.put('/:id', async (req, res, next) => {
    /*
        UPDATE: /api/rooms/1
        RIDE IN/OUT: /api/rooms/1?isRide=true or false
    */
    let isRide = req.query.isRide;
    let roomId = req.params.id;
   
    if (isRide != undefined) {            // RIDE IN/OUT

    }

    else {                                // UPDATE
        let roomObj = {
            roomname: req.body.roomname,
            startpoint: req.body.startpoint,
            endpoint: req.body.endpoint,
            starttime: req.body.starttime,
            currentmember: req.body.currentmember,
            totalmember: req.body.totalmember,
            createtime: req.body.createtime
        }
        if (await SendQuery("UPDATE room SET ? WHERE roomid=?"), [roomObj, roomId])
            res.status(200).end();
        else
            res.status(400).end();
    }
});

router.delete('/:id', async (req, res, next) => {
    if (await SendQuery("DELETE FROM room where roomno=?", req.params.id) != null)
        res.status(200).end();
    else
        res.status(400).end();
});

module.exports = router;