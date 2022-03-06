const express = require('express');
const router = express.Router();
const SendQuery = require('../conn.js').SendQuery;
const GetUserID = require('./jwt.js').GetUserID;

router.get('/:roomno', async (req, res) => {
    let comments = await SendQuery("SELECT * FROM comment WHERE roomno=? ORDER BY writetime ASC", req.params.roomno);
    res.status(comments != null ? 200 : 400).send(comments);
});

router.post('/:roomno', async (req, res) => {
    let commentObj = {
        roomno: req.params.roomno,
        user: GetUserID(req.headers.authorization),
        writetime: new Date(),
        text: req.body.text
    };
    res.status(await SendQuery("INSERT INTO comment SET ?", commentObj) ? 200 : 400).end();
});

router.delete('/:commentno', async (req, res) => {
    res.status(
        await SendQuery("DELETE FROM comment where commentno=?", req.params.commentno) != null ? 200 : 400
    ).end();
});

module.exports = router;