const authRouter = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../db/queries')
const { login, register, logout, failureRedirect } = require('../controllers/auth.controller');



passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new LocalStrategy((username, password, done) => {


    if (!username || !password) {
        return done(null, false);
    }

    pool.query('SELECT * FROM users WHERE username = $1', [username], (err, results) => {
        if (err) {
            console.error(err);
            throw err;
        }

        if (results.rows.length) {
            const user = results.rows[0];

            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    console.error(err);
                    throw err;
                }
                if (result) {

                    pool.query('UPDATE users SET last_login = NOW(), logged_in = true WHERE username = $1', [username], (err, results) => {
                        if (err) {
                            console.error(err);
                            throw err;
                        }
                        console.log(results)

                    });

                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
        }
    })
}));

authRouter.post('/local/login', passport.authenticate('local', { failureRedirect: "/failure" }), login);

authRouter.post('/register', register);

authRouter.get('/logout', logout);

authRouter.get('/failure', failureRedirect);

authRouter.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).json({ message: err.message });
    } else {
        res.status(500).json({ message: err.message });
    }
})

module.exports = authRouter;