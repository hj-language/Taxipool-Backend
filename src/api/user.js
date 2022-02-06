const express = require('express');
const router = express.Router();

const dbConn = require('../conn.js').init();

function checkWithDB(id) {
    let query = 'SELECT * FROM MEMBER WHERE id=?;';
    return new Promise((res, rej) => {
        dbConn.query(query, [id], (err, rows) => {
            if (!err) { // DB 커넥션 성공
                console.log("connect success");
                res(rows[0]);
            } // DB 커넥션 실패
            else
                console.log(err);
        })
    });
}

/* /user/login */
router.post('/login', async (req, res, next) => {
    let testresponse = {
        name: "default",
        tel: "default",
        nick: "default"
    };

    let check = await checkWithDB(req.body.id);

    if (check) // 받아온 데이터가 있으면 (id가 테이블에 존재하면)
    {
        testresponse.name = check.name;
        testresponse.tel = check.phonenum;
        testresponse.nick = check.nickname;
    }

    res.send(`
        router: /user/login,
        name: ${testresponse.name},
        phonenum: ${testresponse.tel},
        nickname: ${testresponse.nick}
    `);
});

/* /user/logout */
router.post('/logout', (req, res, next) => {
    res.send("/user/logout");
});

/* /user/signup */
router.post('/signup', (req, res, next) => {
    res.send("/user/signup");
});

/* /user/signup/checkid */
router.get('/signup/checkid', (req, res, next) => {
    res.send("/user/signup/checkid");
});

/* /user/signup/checknickname */
router.get('/signup/checknickname', (req, res, next) => {
    res.send("/user/signup/checknickname");
});

/* /user/signout */
router.delete('/signout', (req, res, next) => {
    res.send("/user/signout");
});

module.exports = router;