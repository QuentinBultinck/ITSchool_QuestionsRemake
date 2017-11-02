"use strict";

const router = require('express').Router();
const passport = require('passport');

/**
 * Google authentication
 */
router.route('/google')
    .get(passport.authenticate('google', {
            scope: ['email', 'profile']
        })
    );
router.route('/google/callback')
    .get(passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/auth/failure'
        })
    );

/**
 * Authentication failure
 */
router.get("/failure", function (req, res) {
    res.render("error", {
        title: "login",
        error: "Failed to login"
    });
});

module.exports = router;