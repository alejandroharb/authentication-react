const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false }); //session false to prevent the use of cookies
//helper to intercept request for login
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
    // any request coming in, must pass through requireAuth middleware
    app.get('/', requireAuth, (req, res) => res.send({ hi: 'there' }));
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
};