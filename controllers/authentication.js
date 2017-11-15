const User = require('../models/user');

module.exports = {
    signup: (req, res, next) => {
        const { email, password } = req.body;

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
                        res.json({ success: true });
                    })
                    .catch(err => next(err));
            })
            .catch(error => next(error));
    }
};