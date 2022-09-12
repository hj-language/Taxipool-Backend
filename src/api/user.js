const express = require('express');
const router = express.Router();
const jwt = require('./jwt.js');
const SendQuery = require('../conn.js').SendQuery;
const crypto = require('crypto');
const { pwSalt } = require('../secret');

async function verifyPassword(originPw, inputPw) {
  // originPw: hashed, inputPw: not hashed
  return (originPw == await getHashedPassword(inputPw))
}

async function getHashedPassword (pw) {
  return new Promise(async (res, rej) => {
    crypto.pbkdf2(pw, pwSalt, 10000, 60, 'sha512', (err, key) => {
      if (err) rej(err);
      res(key.toString('base64').slice(0, 60));
    })
  })
}

/* /user/login */
router.post('/session', async (req, res) => {
    let password = await SendQuery("SELECT pw FROM user where id=?", req.body.id);
    if (!password[0] || !await verifyPassword(password[0].pw, req.body.password))
      return res.status(400).end();

    try {
      let token = jwt.sign({ id: req.body.id })
      res.json({ token: token }).status(200);
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
});

/* /user/logout */
router.delete('/session', async (req, res) => {
  //토큰 유효성 확인
  res.send();
});

/* /user/signup */
router.post('/member', async (req, res) => {
  let user = await SendQuery('SELECT id, nickname FROM user WHERE id=? OR nickname=?', [req.body.id, req.body.nickname]);
  if (user.length != 0)
    return res.status(400).send("exist id or nickname");
  
  let password = await getHashedPassword(req.body.pw);
  req.body.pw = password;

  return res.status(await SendQuery("INSERT INTO user SET ?", req.body)? 200 : 400).end();

});

//id, nickname 중복확인
router.get('/member', async (req, res) => {
  console.log(req.query.id, req.query.nickname)
    let user = await SendQuery('SELECT id, nickname FROM user WHERE id=? OR nickname=?', [req.query.id, req.query.nickname]);
    if (user.length != 0)
      return res.status(400).send("exist id or nickname");
    res.status(200).end();
});

/* /user/signout */
router.delete('/member', jwt.verify, async (req, res) => {
  console.log(jwt.GetUserID(req.headers.authorization))
  let id = jwt.GetUserID(req.headers.authorization);
  let user = await SendQuery('SELECT pw FROM user WHERE id=?', id);
  console.log(user)
  if (user[0].pw == req.body.pw)
    res.status(await SendQuery('DELETE FROM user WHERE id=?', id)? 200 : 400).end();
  else
    res.status(400).end();
});

module.exports = router;
