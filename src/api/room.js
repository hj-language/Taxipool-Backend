const express = require('express');
const router = express.Router();
const SendQuery = require('../conn.js').SendQuery;
const GetUserID = require('./jwt.js').GetUserID;

async function IsRide(roomno, id) {
    return (await SendQuery("SELECT * from roominfo where roomno=? AND user=?", [roomno, id])).length != 0 ? true : false;
}

router.get('/', async (req, res) => {
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
        roomname: req.body.roomname,
        startpoint: req.body.startpoint,
        endpoint: req.body.endpoint,
        starttime: req.body.starttime,
        currentmember: req.body.currentmember,
        totalmember: req.body.totalmember,
        createtime: new Date()
    }
    res.status(await SendQuery("INSERT INTO room SET ?", roomObj) ? 200 : 400).end();
});

router.get('/:roomno', async (req, res) => {
    let roomNo = req.params.roomno;
    let row = await SendQuery("SELECT * FROM room WHERE roomno=?", roomNo);
    if (row.length != 0) {
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
            isRide: await IsRide(roomNo, GetUserID(req.headers.authorization))
        });
    }
    else {
        res.status(400).end();
    }
});

router.put('/:roomno', async (req, res) => {
    /*
        UPDATE: /api/rooms/1
        RIDE IN/OUT: /api/rooms/1?isRide=true or false
    */
    let isRide = req.query.isRide;
    let roomNo = req.params.roomno;
    let userID = GetUserID(req.headers.authorization);
   
    if (isRide != undefined) {            // RIDE IN/OUT
        if (isRide === "true") {          // RIDE IN
            let roomInfoObj = {
                roomno: roomNo,
                user: userID,
                ridetime: new Date()
            };
            let roomInfo = await SendQuery("SELECT currentmember, totalmember FROM room WHERE roomno=?");
            if (roomInfo == null || roomInfo[0].currentmember >= totalmember) {
                // 해당 방이 없거나, 인원이 초과될 경우 방지
                res.status(400).end();
            }
            res.status(await SendQuery("INSERT INTO roominfo SET ?", roomInfoObj) ? 200 : 400).end();
        }
        else {                            // RIDE OUT
            res.status(await SendQuery("DELETE FROM roominfo WHERE roomno=? AND user=?", [roomNo, userID]) ? 200 : 400).end();
        }
    }

    else {                                // UPDATE
        let query = "UPDATE room SET "
            + "roomname=?, startpoint=?, endpoint=?, starttime=?, currentmember=?, totalmember=? " 
            + "where roomno=?";
        res.status(await SendQuery(
            query, [req.body.roomname, req.body.startpoint, req.body.endpoint, req.body.starttime, req.body.currentmember, req.body.totalmember, roomNo]
        ) ? 200 : 400).end();
    }
});

router.delete('/:roomno', async (req, res) => {
    res.status(await SendQuery("DELETE FROM room where roomno=?", req.params.roomno) != null ? 200 : 400).end();
});

module.exports = router;