/**
 * Created by wcx73 on 2017/3/26.
 */
'use strict';

var PeerServer = require('peer').PeerServer,
    express = require('express'),
    Topics = require('./public/Topics.js'),
    app = express(),
    port = process.env.PORT || 3001;
app.use(express.static(__dirname + '/public'));

console.log('Listening on port',__dirname );

var expressServer = app.listen(port);
var io = require('socket.io').listen(expressServer);

console.log('Listening on port', port);

var peerServer = new PeerServer({ port: 9000, path: '/public' });

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