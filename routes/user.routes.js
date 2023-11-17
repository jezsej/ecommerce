const userRouter = require('express').Router();
const { getUsers } = require('../controllers/users.controller');


// Administration routes
userRouter.get('/', getUsers);

// userRouter.get('/:id', getUserById);

// userRouter.post('/', createUser);

// userRouter.put('/:id', updateUser);

// userRouter.delete('/:id', deleteUser);

module.exports = userRouter;