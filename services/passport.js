const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Create Local Strategy for authenticating a user at login
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    //verify email and password, call done with user
    //if no user, call done with false
    User.findOne({ email: email }) 
        .then((user) => {           
            if(!user) { return done(null, false); }
            //compare passwords - password provided vs database password(salted)
            user.comparePassword(password, (err, isMatch) => {
                if (err) { return done(err); }
                if (!isMatch) { return done(null, false); }

                return done(null, user);
            })
        })
        .catch(err => done(err));
});

// Setup options for JWT Strategy -> for handling auth-requests
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // see if the user ID in thepayload exists in our database
    // if it does, call done with that user
    // otherwise, call done without a user object
    User.findById(payload.sub)
        .then(user => {
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        })
        .catch(err => done(err, false));
});


// Tell passport to use these strategies
passport.use(jwtLogin);
passport.use(localLogin);