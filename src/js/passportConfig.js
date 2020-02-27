// couldn't figure out how to get this to work
// this is not being used in the final project, but I am storing it here for posterity.

// ======================================
// THIS CODE WAS IN APP.jS
const passport = require('passport');

const passportConfig = require('./js/passportConfig');
passportConfig(passport);

// middleware function initializing passport - has access to req and res and next middleware in chain
    // because of app.use()
    app.use(passport.initialize());
    // middleware that alters req object, changing 'user' value in session id (from client cookie) into true deserialized user object
        // https://stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do
    app.use(passport.session());
    
    // calling method on object returned from require("express-session")
    app.use(require("express-session")({
        // secret is used to encode and decode sessions
        secret: "pyro kid",
        resave: false,
        saveUninitialized: false
    }));

//==========================================

const LocalStrategy   = require('passport-local').Strategy;
const db = require('./db');

// this is a function being exported
  // that takes the passport object (from require(passport))
module.exports = (passport) => {
  // result of serializeUser method is attached to session
    // here we provide the user's id as the key
    // https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
  passport.serializeUser((user, done) => {
    done(null, user.id);
});
// now id argument corresponds to req.session.passport.user.id
passport.deserializeUser((id, done) => {
    db.query("select * from admin where id = " + id, (err, rows) =>
        done(err, rows[0]));
});

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

         db.query("SELECT * FROM admin WHERE user_email = " + email, function(err,rows){
			if (err)
                return done(err);
			 if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            } 
			
			// if the user is found but the password is wrong
            if (!( rows[0].password == password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
			
            // all is well, return successful user
            return done(null, rows[0]);			
		});
    }))
}