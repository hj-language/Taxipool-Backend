const express = require('express');
const router = express.Router();

const dbConn = require('../conn.js').init();

function checkWithDB(id) {
    let query = 'SELECT * FROM MEMBER WHERE id=?;';
    return new Promise((res, rej) => {
        dbConn.query(query, [id], (err, rows) => {
            if (!err){  // DB 커넥션 성공
                console.log("connect success");
                rows[0];
            }
            else
                console.log(err);
        })
    });
}

/* /user/login */
router.post('/sessions', async (req, res, next) => {


    let check = await checkWithDB(req.body.id);

    if (check) res.status(200);
    else  res.status(400);

});

/* /user/logout */
router.delete('/sessions', async (req, res, next) => {

    //토큰이 만료되지 않았으면 사용 못하도록 함
    let id = req.body.id;
    res.send("sessions");
});

function insertInDB(body) {
  let query = 'INSERT INTO member VALUES (?,?,?,?,?)';
  let param = [body.id, body.password, body.name, body.phonenumber, body.nickname];
  return new Promise((res, rej) => {
    conn.query(query, param, function(err, rows, fields) {
    if (!err) {
      console.log("insert success");
      rows[0];
    }
    else
      console.log(err);
    })
  });
}


/* /user/signup */
router.post('/members', async (req, res, next) => {

    let insert = await insertInDB(req.body);
    if (insert)
      res.status(200);
    else
      res.staus(400);

    res.send("members");

});

function selectInDB(id, query) {
  return new Promise((res, rej) => {
    conn.query(query, [id], function(err, rows, fields) {
      if (!err){
        console.log('select success');
        rows[0];
      }
      else
        console.log(err);
    })
  });
}

/* /user/signup/checkid */
router.get('/members', async (req, res, next) => {

    let query = 'SELECT id FROM member WHERE id=?';
    let checkId = await selectInDB(req.query.id, query);
    if (checkId)
      res.status(200);
    else res.status(400);

    res.send("members");
});

/* /user/signup/checknickname */
router.get('/members', async (req, res, next) => {

    let query = 'SELECT nickname FROM member WHERE nickname=?';
    let checkNick = await selectInDB(req.query.nickname, query);
    if (checkNick)
      res.status(200);
    else
      res.status(400);

    res.send("members");
});

function deleteInDB(id, query) {
  let checkDelete = false;
  return new Promise((res, rej) => {
    conn.query(query, [id], function(err, rows, fields) {
      if (err)
        console.log(err);
      else {
        console.log('delete success');
        checkDelete = true;
      }
    })
  });
}

/* /user/signout */
router.delete ('/members', async (req, res, next) => {

    let query = 'DELETE FROM member WHERE id=?'
    let deleteMember = await deleteInDB(req.query.id, query);
    if (checkDelete)
      req.status(200);
    else
      req.status(400);

    res.send("members");
});

module.exports = router;
