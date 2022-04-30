const express = require('express');
const router = express.Router();

const jwt = require('../api/jwt');
const auth = require('../middlewares/auth').checkToken;
const SendQuery = require('../conn.js').SendQuery;
const crypto = require('crypto');

async function makeHashedPassword(pw) {
    const salt = crypto.randomBytes(128).toString('base64');
    const hashedPassword = crypto.pbkdf2(
      pw, salt, 100000, 64, 'sha512', (err, key) => {
        if (err)
          console.log(err);
      }
    )

    return { salt: salt, password: hashedPassword.toString('base64')};
}

async function verifyPassword(pw, hasedPW) {
  if (pw == hasedPW) {
    return true;
  }
  return false;
}

async function getHasedPW() {
  
}

/* /user/login */
router.post('/', async (req, res, next) => {
    console.log(req.body);
    
    // let user = {
    //   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im15aWQiLCJpYXQiOjE1MTYyMzkwMjJ9.SrLa4xS_VbNwYF4Zatu7ilRXCKrOlccvkBPHYV5yJSc"
    // }
    let userInfo = {id : req.body.id, name : req.body.name };
    let user =  { token: jwt.sign(userInfo) };
    console.log(token);

    if (check != null) {
      if (verifyPassword(req.body.password, ))
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
  //토큰 유효성 확인
    res.send();
});


/* /user/signup */
router.post('/member', async (req, res, next) => {

    let password = (await makeHashedPassword(req.body.password)).password;

    let userobj = {
      id: req.body.id,
      password: password,
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
