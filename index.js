const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var mongoose = require("mongoose");

app.get('/', function(req, res) {
    res.render('chatbot.ejs');
});
const dbConfig = require('./config/database.config.js');
// Connecting to the database
mongoose.connect(dbConfig.url, {
   useNewUrlParser: true
}, (err) => {
    console.log("Database connection", err)
})

var Chats = mongoose.model("Chats", {
    name: String,
    chat: String
})

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' joined the chat </i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat </i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

const server = http.listen(3000, function() {
    console.log('listening on port :3000');
});