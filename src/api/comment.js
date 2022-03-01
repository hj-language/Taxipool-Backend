const express = require('express');
const router = express.Router();
const SendQuery = require('../conn.js').SendQuery;

router.get('/:id', (req, res, next) => {
    let row = await SendQuery("SELECT * FROM rideinfo WHERE roomno=?", req.params.id);
    if (row != null) {
        let result = new Array();
        for (let item in row)
            result.push(item.userid);
        res.status(200);
        res.send(result);
    }
    else {
        res.status(400).end();
    }
})

module.exports = router;