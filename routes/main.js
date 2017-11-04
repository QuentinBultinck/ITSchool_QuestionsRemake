"use strict";

const router = require("express").Router();

router
/**
 * Default Route
 */
    .get("/", function (req, res) {
        res.render("index", {
            title: "Home",
            isAuthenticated: (req.user)
        });
    })

    /**
     * logout
     */
    .get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });


module.exports = router;