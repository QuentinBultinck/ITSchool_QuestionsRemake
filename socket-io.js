const pug = require("pug");
const path = require("path");
const cookieParser = require('cookie-parser');
const passportSocketIo = require("passport.socketio");

const Thread = require("./models/thread");

/**
 * Passport and socket.io functions
 */
const onAuthorizeSuccess = function (data, accept) {
    console.log('successful connection to socket.io');
    // The accept-callback still allows us to decide whether to
    // accept the connection or not.
    accept(null, true);
};
const onAuthorizeFail = function (data, message, error, accept) {
    if (error) throw new Error(message);
    console.log('failed connection to socket.io:', message);
    // We use this callback to log all of our failed connections.
    accept(null, false);
};

/**
 * Socket.io event handlers
 */
const eventHandler = {
    new_question: function (namespace, clientSocket, question) {
        //TODO Deze check wordt al uitgevoerd in "model/thread.js"
        if (clientSocket.request.user) {
            let thread = new Thread({
                question: question,
                author: clientSocket.request.user
            });
            thread.save((err, savedThread) => {
                if (err) clientSocket.emit("error_occurred", err);
                else {
                    let html = pug.renderFile("views/partials/thread.pug", {thread: savedThread});
                    namespace.emit("new_thread", html);
                }
            });
        } else {
            clientSocket.emit("error_occurred", "Please login to ask a question.");
        }
    }
};

/**
 * The server socket
 */
const serverSocketInitiator = function (server, sessionStore) {
    const io = require("socket.io")(server);

    /**
     * Access passport user information from a socket.io connection.
     */
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: 'connect.sid', // the name of the cookie where express/connect stores its session_id
        secret: process.env.SESSION_KEY,
        store: sessionStore,
        // success: onAuthorizeSuccess, //Optional
        // fail: onAuthorizeFail //Optional
    }));

    /**
     * Namespace /questions-live
     */
    const questions_live = io
        .of('/questions-live')
        .on('connection', function (clientSocket) {
            clientSocket.emit("connection_confirmation", "connected to socket in room 'questions-live'");

            /**
             * TODO implement pagination
             * more info @
             * http://madhums.me/2012/08/20/pagination-using-mongoose-express-and-jade/
             * https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js
             */
            let threadsHTML = [];
            Thread.find().sort("-creationDate").exec().then(threads => {
                threads.forEach(thread => {
                    let html = pug.renderFile("views/partials/thread.pug", {thread: thread});
                    threadsHTML.push(html);
                });
                clientSocket.emit("threads", threadsHTML);
            }).catch(err => clientSocket.emit("error_occurred", "Failed to get threads"));

            clientSocket.on("new_question", (question) => {
                eventHandler.new_question(questions_live, clientSocket, question);
            })
        });

};

module.exports = serverSocketInitiator;