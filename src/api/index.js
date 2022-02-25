const express = require('express');
const router = express.Router();

const userRouter = require('./user.js');
router.use('/user', userRouter);

const roomRouter = require('./room.js');
router.use('/rooms', roomRouter);

const commentRouter = require('./comment.js');
router.use('/comments', commentRouter);

module.exports = router;