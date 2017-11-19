const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

module.exports = {
    signup: (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).send({ error: 'You must provide an email and password'});
        }

        //see if a user with the given email exists
        User.findOne({ email: email })
            .then(existingUser => {
                // if a user with email does exist, return an error
                if(existingUser) {
                    return res.status(422).send({ error : 'Email is in use' });
                }
                 //if a user with email does not exist, create and save user
                 const user = new User({
                     email: email,
                     password: password
                 });
                 user.save()
                    .then(() => {
                        //respond to request indicating the user was created
                        res.json({ token: tokenForUser(user) });
                    })
                    .catch(err => next(err));
            })
            .catch(error => next(error));
    },

    signin: (req, res, next) => {
        // User has already had their email password auth'd
        // now need to give them a token
        // passport assigns the user to req.user from "done()" in strategy
        res.send({ token: tokenForUser(req.user) });
    }
};