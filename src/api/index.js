const express = require('express');
const router = express.Router();

const userRouter = require('./user.js');
router.use('/user', userRouter);

const roomRouter = require('./room.js');
router.use('/rooms', roomRouter);

module.exports = router;