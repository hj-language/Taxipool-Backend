const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth').checkToken;
const SendQuery = require('../conn.js').SendQuery;

/* /user/login */
router.post('/', async (req, res, next) => {
    console.log(req.body);
    // let check = await SendQuery("SELECT * FROM member", [id]);
    let check = true;
    let user = {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im15aWQiLCJpYXQiOjE1MTYyMzkwMjJ9.SrLa4xS_VbNwYF4Zatu7ilRXCKrOlccvkBPHYV5yJSc"
    }
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

//id, nickname 중복확인
router.get('/members', async (req, res, next) => {

    let query = 'SELECT nickname FROM member WHERE nickname=?';
    let checkNick = await selectInDB(req.query.nickname, query);

    if (req.query.nickname != null) {
      if (await SendQuery('SELECT nickname FROM member WHERE nickname=?', [req.query.nickname])) {
        res.status(200);
      }
      else {
        res.status(400);
      }
      res.send(members);
    }
    else {
      if (await SendQuery('SELECT id FROM member WHERE id=?', [req.query.nickname])) {
        res.status(200);
      }
      else {
        res.status(400);
      }
    }
   
    res.send();
});

/* /user/signout */
router.delete ('/members', async (req, res, next) => {

    if (await SendQuery('DELETE FROM member WHERE id=?', [req.query.id])) {
      req.status(200);
    }
    else {
      req.status(400);
    }

    res.send();
});

module.exports = router;
