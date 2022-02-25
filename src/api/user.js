const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth').checkToken;
const SendQuery = require('../conn.js').SendQuery;

/* /user/login */
router.post('/', auth ,async (req, res, next) => {

    let id = req.body.id;
    let check = await SendQuery("SELECT * FROM member", [id]);
    if (check != null) {
      res.status(200);
      res.send(user);
    }
    else {
      res.status(400);
      res.send();
    }
});

/* /user/logout */
router.delete('/sessions', async (req, res, next) => {

    //세션 만료됐는지 확인하고
    //만료됐으면 성공
    //아직 유효하면?

    let id = req.body.id;
    res.send();
});


/* /user/signup */
router.post('/member', async (req, res, next) => {

    let userobj = {
      id: req.body.id,
      password: req.body.password,
      name: req.body.name,
      phonenumber: req.body.phonenumber,
      nickname: req.body.nickname
    }

    if (await SendQuery("INSERT INTO member SET ?", userobj))
      res.status(200);
    else
      res.staus(400);

    res.send();

});



/* /user/signup/checkid */
// router.get('/members', async (req, res, next) => {
//
//     let query = 'SELECT id FROM member WHERE id=?';
//     let checkId = await
//     if (checkId)
//       res.status(200);
//     else res.status(400);
//
//     res.send();
// });

/* /user/signup/checknickname */
router.get('/members', async (req, res, next) => {

    let query = 'SELECT nickname FROM member WHERE nickname=?';
    let checkNick = await selectInDB(req.query.nickname, query);
    if (checkNick)
      res.status(200);
    else
      res.status(400);

    res.send();
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

    res.send();
});

module.exports = router;
