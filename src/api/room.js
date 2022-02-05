const express = require('express');
const router = express.Router();

/* /room/create */
router.post('/create', (req, res, next) => {
    res.send("/room/create");
});

/* /room/update(GET) */
router.get('/update', (req, res, next) => {
    res.send("/room/update(GET)");
});

/* /room/update(PUT) */
router.put('/update', (req, res, next) => {
    res.send("/room/update(PUT)");
});


/* /room/list */
router.get('/list', (req, res, next) => {
    res.send("/room/list");
});

/* /room/delete */
router.delete('/delete', (req, res, next) => {
    res.send("/room/delete");
});

/* /room/search */
router.get('/search', (req, res, next) => {
    res.send("/room/search");
});

/* /room/view */
router.get('/view', (req, res, next) => {
    res.send("/room/view");
});

/* /room/view/ridein */
router.post('/view/ridein', (req, res, next) => {
    res.send("/room/view/ridein");
});

/* /room/view/rideout */
router.post('/view/rideout', (req, res, next) => {
    res.send("/room/view/rideout");
});

module.exports = router;