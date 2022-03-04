const express = require('express');
const decode = require('jwt-decode');
const router = express.Router();
const SendQuery = require('../conn.js').SendQuery;

/*
    - 토큰 검증 미들웨어 추가하기
    - isRide 구하기: 요청 token으로부터 id를 추출하여 
                    rideinfo 테이블의 roomno에 해당 userid가 있는 지 확인
*/

function GetUserID(token) {
    return decode(token).id;
}

async function IsRide(roomno, id) {
    if (await SendQuery("SELECT * from roominfo where roomno=? AND user=?", [roomno, id]))
        return true;
    return false;
}

router.get('/', async (req, res) => {
    /*
        LIST: /api/rooms
        SEARCH: /api/rooms?startPoint=a&endPoint=b
    */
   let startPoint = req.query.startPoint;
   let endPoint = req.query.endPoint;
   console.log(req.body);
   let rooms;
   let result = false;

   if (startPoint || endPoint) {            // SEARCH
        if (startPoint && endPoint)
            rooms = await SendQuery("SELECT * from room where startpoint=? and endpoint=?;", [startPoint, endPoint]);
        else if (startPoint)
            rooms = await SendQuery("SELECT * from room where startpoint=?;", startPoint);
        else
            rooms = await SendQuery("SELECT * from room where endpoint=?;", endPoint);
        
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

router.post('/', async (req, res) => {
    let roomObj = {
        leaderid: GetUserID(req.headers.authorization),
        leaderid: req.body.id,
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

router.get('/:id', async (req, res) => {
    let roomNo = req.params.id;
    let row = await SendQuery("SELECT * FROM room WHERE roomno=?", roomNo);
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
            // isRide: IsRide(req.body.id, roomNo)
            isRide: IsRide(roomNo, GetUserID(req.headers.authorization))
        });
    }
    else {
        res.status(400).end();
    }
});

router.put('/:id', async (req, res) => {
    /*
        UPDATE: /api/rooms/1
        RIDE IN/OUT: /api/rooms/1?isRide=true or false
    */
    let isRide = req.query.isRide;
    let roomNo = req.params.id;
    let userID = GetUserID(req.headers.authorization);
   
    if (isRide != undefined) {            // RIDE IN/OUT
        if (isRide === "true") {          // RIDE IN
            let roomInfoObj = {
                roomno: roomNo,
                user: userID,
                ridetime: new Date()
            };
            if (await SendQuery("INSERT INTO roominfo SET ?", roomInfoObj))
                res.status(200).end();
            else
                res.status(400).end();
        }
        else {                            // RIDE OUT
            if (await SendQuery("DELETE FROM roominfo WHERE roomno=? AND user=?", [roomNo, userID]))
                res.status(200).end();
            else
                res.status(400).end();
        }
    }

    else {                                // UPDATE
        let query = "UPDATE room SET "
            + "roomname=?, startpoint=?, endpoint=?, starttime=?, currentmember=?, totalmember=? " 
            + "where roomno=?";
        if (await SendQuery(query, [req.body.roomname, req.body.startpoint, req.body.endpoint, req.body.starttime, req.body.currentmember, req.body.totalmember, roomNo]))
            res.status(200).end();
        else
            res.status(400).end();
    }
});

router.delete('/:id', async (req, res) => {
    if (await SendQuery("DELETE FROM room where roomno=?", req.params.id) != null)
        res.status(200).end();
    else
        res.status(400).end();
});

module.exports = router;