const express = require('express');
const session = require('express-session');
const passport =  require("passport");
const checkAuthenticated = require('./middleware/auth.middleware');
const apiRouter = require('./routes/api.routes');

const store = new session.MemoryStore();

const app = express();
const PORT = 8181;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(session({
    'secret': 'secret',
    'resave': false,
    'saveUninitialized': false,
    store
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});