"use strict";

const router = require("express").Router();
const sanitizer = require("sanitizer");

const Thread = require("./../models/thread");

const functions = {
    getAllThreads: function (req, res) {
        Thread.find(function (err, threads) {
            if (err) {
                console.error(err.stack);
                res.status(500).render("error", {
                    title: "500 Internal Server Error",
                    error: "Something broke!"
                });
            }
            else res.json(threads);
        });
    },
    postNewThread: function (req, res) {
        let thread = new Thread({
            question: sanitizer.escape(req.body.question)
        });
        thread.save(function (err, savedThread) {
            if (err) {
                console.error(err.stack);
                res.status(500).render("error", {
                    title: "500 Internal Server Error",
                    error: "Something broke!"
                });
            } else res.json(savedThread);
        })
    }
};

router.get('/', function (req, res) {
    res.json({message: 'API Initialized!'});
});

router.route('/threads')
    .get(functions.getAllThreads)
    .post(functions.postNewThread);

module.exports = router;