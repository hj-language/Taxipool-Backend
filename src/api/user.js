const express = require('express');
const router = express.Router();

/* /user/login */
router.post('/login', (req, res, next) => {
    res.send("/user/login");
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