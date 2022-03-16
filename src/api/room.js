const express = require('express');
const router = express.Router();
const SendQuery = require('../conn.js').SendQuery;
const GetUserID = require('./jwt.js').GetUserID;
const pool = require('../conn.js').pool;

async function IsRide(roomno, id) {
    return (await SendQuery("SELECT * from roominfo where roomno=? AND user=?", [roomno, id])).length != 0 ? true : false;
}

async function DeleteRoom(roomno) {
    return await SendQuery("DELETE FROM room where roomno=?", roomno) != null;
}

async function RideOut(roomno, id, alterid) {
    await pool.getConnection(async (err, conn) => {
        try {
            await conn.beginTransaction();
            
            // alterid가 defined면 해당 방의 leaderid를 alterid로 변경
            if (alterid != undefined)
                await conn.query("UPDATE room SET leaderid=? WHERE roomno=?;", [alterid, roomno]);
            
            await conn.query("DELETE FROM roominfo WHERE roomno=? AND user=?;", [roomno, id]);
            await conn.query("UPDATE room SET currentmember=currentmember-1 WHERE roomno=?", roomno);
            await conn.commit();
        } catch (err) {
            console.log(err);
            await conn.rollback();
            return false;
        } finally {
            conn.release();
            return true;
        }
    });
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
        starttime: new Date(),
        currentmember: req.body.currentmember,
        totalmember: req.body.totalmember,
        createtime: new Date()
    };
    let flag = true;
    await pool.getConnection(async (err, conn) => {
        if (!err) {
            try {
                await conn.beginTransaction();
                await conn.query("INSERT INTO room SET ?", roomObj, (connerr, connres) => {
                    console.log(connerr, connres);
                    conn.query("INSERT INTO roominfo VALUES (?, ?, ?)", [connres.insertId, roomObj.leaderid, new Date()], async () => {
                        await conn.commit();
                    });
                });
            } catch (err) {
                console.log(err);
                await conn.rollback();
                flag = false;
            } finally {
                conn.release();
            }
        }
        else {
            console.log(err)
        }
        
    });
    res.status(flag ? 200 : 400).end();
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
            let roomInfo = await SendQuery("SELECT currentmember, totalmember FROM room WHERE roomno=?", roomNo);

            // 해당 방이 없거나, 인원이 초과될 경우 방지
            if (roomInfo == null || roomInfo.length == 0 || roomInfo[0].currentmember >= roomInfo[0].totalmember)
                return res.status(400).end();

            await pool.getConnection(async (err, conn) => {
                try {
                    await conn.beginTransaction(); // 트랜잭션으로 roomInfo에 유저 추가 + room에 인원 증가 처리
                    await conn.query("INSERT INTO roominfo SET ?", roomInfoObj);
                    await conn.query("UPDATE room SET currentmember=currentmember+1 WHERE roomno=?", roomNo);
                    await conn.commit();
                } catch (err) {
                    console.log(err);
                    await conn.rollback();
                    return res.status(400).end();
                } finally {
                    conn.release();
                    return res.status(200).end();
                }
            });
        }
        else {                            // RIDE OUT
            let roomInfo = await SendQuery("SELECT leaderid, currentmember FROM room WHERE roomno=?", roomNo);
            if (roomInfo == null || roomInfo.length == 0 || roomInfo[0].currentmember <= 0)
                return res.status(400).end();

            // 1명 남은 상황이면 방 삭제
            if (roomInfo[0].currentmember == 1)
                return res.status(DeleteRoom(roomNo) ? 200 : 400).end();
            
            // 방장이 내리는 상황이면 가장 빨리 탄 사람에게 방장 넘겨주기
            if (roomInfo[0].leaderid == userID) {
                let users = await SendQuery("SELECT user FROM roominfo WHERE roomno=? ORDER BY ridetime ASC;", roomNo);
                return res.status(RideOut(roomNo, userID, users[0].user) ? 200 : 400).end();
            }
            
            res.status(RideOut(roomNo, userID) ? 200 : 400).end();
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
    res.status(DeleteRoom(req.params.roomno) ? 200 : 400).end();
});

module.exports = router;