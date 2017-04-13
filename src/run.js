/**
 * Created by wcx73 on 2017/3/26.
 */
"use strict";
// exports.run = function (devServer) {
let PeerServer = require('peer').PeerServer,
    // express = require('express'),
    Topics = require('./chat/ConnectionTopics.js');
// app = express(),
// port = process.env.PORT || 3001;
// app.use(express.static(__dirname + '/../public'));
// console.log(__dirname + '/../public');

// let expressServer = app.listen(port);

let peerServer = new PeerServer({port: 9000, path: '/../public'});

peerServer.on('connection', function (id) {
    console.log('User connected with #', id);
    io.emit(Topics.USER_CONNECTED, id);
    console.log('User connected with #', id);
});

peerServer.on('disconnect', function (id) {
    console.log('User connected with #', id);
    io.emit(Topics.USER_DISCONNECTED, id);
    console.log('User disconnected with #', id);
});
// };
