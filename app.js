/**
 * Load module dependencies.
 */
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');

/**
 * Load environment variables
 * TODO Look for a better solution for .env files and variables
 */
require('dotenv').config();

/**
 * Connect to MongoDB with mongoose
 */
mongoose.connect(process.env.MONGODB_URL, {useMongoClient: true}).catch(err => {
    console.error(err);
});

/**
 * Make instances.
 */
const app = express();

/**
 * View engine setup.
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Express server middleware
 */
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
        secret: process.env.SESSION_KEY,
        cookie: {maxAge: 2628000000},
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());

/**
 * Serve public folder static
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Setup passport with Google Strategy
 */
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL,
        passReqToCallback: true
    },
    function (request, accessToken, refreshToken, profile, done) {
        //TODO Do something with the returned profile
        // console.log(profile);
        return done(null, profile);
        // User.findOneOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
    }
));
passport.serializeUser(function (user, done) {
    //TODO Reduce the amount of  data set in the user cookie
    //Look at PassportJS docs > Sessions section
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

/**
 * Setup controllers
 */
app.use('/', require("./controllers/main"));
app.use('/api', require("./controllers/api"));
app.use("/auth", require("./controllers/authenticate"));

/**
 * Any other routes return 404
 */
app.get("*", function (req, res) {
    res.status(404).render("error", {
        title: "404 Not Found",
        error: "Your URL is incorrect."
    });
});

/**
 * Start server
 */
const port = process.env.PORT;
app.listen(port, function () {
    console.log(`Server running on port ${port}`);
});