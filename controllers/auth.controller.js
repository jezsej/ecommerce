const pool = require('../db/queries')
const auth = require('../middleware/auth.middleware');

const failureRedirect = (req, res) => {
    res.status(401).json({ message: 'You are not authenticated' });
}


const register = async(req, res, next) => {

    console.info(req.body);

    const { username, password, firstname, lastname, email, address } = req.body;

    if (!username || !password || !firstname || !lastname || !email || !address) {
        res.status(400).json({ message: 'Please fill out all required fields' });
    }

    try {
        pool.query('SELECT * FROM users WHERE username = $1', [username], (err, results) => {

            if (err) {
                console.error(err);
                let error = new Error('User creation failed');
                error.status = 500;
                next(error);
            } else {
                if (results.rows.length) {
                    console.error('Username already exists');
                    res.status(409).json({ message: 'Username already exists' });
                } else {


                    auth.passwordHash(password, 10).then((hash) => {

                        pool.query('INSERT INTO users (username, password, first_name, last_name, email, address) VALUES ($1, $2, $3, $4, $5, $6)', [username, hash, firstname, lastname, email, address], (err, results) => {
                            if (err) {
                                console.error(err);
                                let error = new Error('User creation failed');
                                error.status = 500;
                                next(error);
                            }

                            res.status(201).json({ message: 'User created', newUser: { username, password, firstname, lastname, email, address } });
                        });
                    }).catch((err) => {
                        console.error(err);
                        let error = new Error('User creation failed');
                        error.status = 500;
                        next(error);
                    });


                }
            }


        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user' });
    }


}




const login = (req, res) => {

    res.status(200).json({ message: 'User logged in' });

}

const logout = (req, res) => {



    pool.query('UPDATE users SET logged_in = false WHERE username = $1', [req.session.username], (err, results) => {
        if (err) {
            throw err;
        }
        req.logout();
        res.status(200).json({ message: 'User logged out' });
    });

}

module.exports = {
    login,
    failureRedirect,
    register,
    logout
}