const bcrypt = require('bcrypt');

const checkAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        return next();
    }

    res.status(401).json({ message: 'You are not authenticated' });
}

const passwordHash = async(password, saltRounds) => {

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordhash = await bcrypt.hash(password, salt);

        return passwordhash;

    } catch (err) {
        console.log(err);
        throw err;
    }

}

module.exports = { passwordHash, checkAuthenticated };