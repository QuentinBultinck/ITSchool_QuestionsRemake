'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @param {String} q = question
 * @return {String} trimmed question with a question mark
 * trim:' word ' => 'word'
 */
let questionSetter = function (q) {
    q = q.trim();
    if (!q.endsWith("?")) q = q + "?";
    return q;
};

const ThreadSchema = Schema({
    // author: {type: Schema.ObjectId, ref: "User", required: true},
    question: {type: String, required: true, set: questionSetter},

    // creationDate: {type: Date, default: Date.now},
    // hasApprovedAnswer: {type: Boolean, default: false},
    // votes: {Number, default: 0},
    // upVotedUIDs: [{type: Schema.ObjectId, ref: "User"}],
    // downVotedUIDs: [{type: Schema.ObjectId, ref: "User"}],
    // answers: [{type: Schema.ObjectId, ref: "Answer"}],
    // tags: [{type: Schema.ObjectId, ref: "Tag"}]
});

module.exports = mongoose.model('Thread', ThreadSchema);