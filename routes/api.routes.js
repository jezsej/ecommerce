const express = require('express');
const apiRouter = express.Router();
const userRouter = require('./user.routes');
const authRouter = require('./auth.routes');

apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;