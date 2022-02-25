const express = require('express');
const router = express.Router();
const SendQuery = require('../conn.js').SendQuery;

router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    res.send(`/api/comments/:${id}`);
})

module.exports = router;