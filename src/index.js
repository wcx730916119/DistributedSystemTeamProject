import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// render ChatBox widget
import ChatBox from "./widgets/ChatBox/ChatBox";
import CodeEditor from "./widgets/CodeEditor/CodeEditor";
ReactDOM.render(
    <ChatBox />,
    document.getElementById('widget-chat-box')
);

ReactDOM.render(
    <CodeEditor />,
    document.getElementById('widget-code-pad')
);

// import App from './App';
// ReactDOM.render(
//     <App />,
//     document.getElementById('root')
// );
// import AceEditor from './widgets/CodeEditor/AceEditor/AceEditor'
// ReactDOM.render(
//     <AceEditor/>,
//     document.getElementById('editor')
// );


// import ace from 'react-ace';
// console.info('ha');
// let editor = ace.edit("editor");
// editor.setTheme("ace/theme/chrome");
// editor.getSession().setMode("ace/mode/python");
// editor.setValue("# welcome to our platform\nprint 'hello world'");
// editor.setHighlightActiveLine(true);
// console.log('establishing WebRTC connection1');
// import {PeerServer} from 'peer';
// let PeerServer = require('peer').PeerServer;
// express = require('express'),
// app = express(),
// port = process.env.PORT || 3001;
// Topics = {
//     USER_CONNECTED   : 'user-connected',
//     USER_DISCONNECTED: 'user-disconnected',
//     USER_MESSAGE     : 'user-message'
// },

// console.log('establishing WebRTC connection2');

// app.use(express.static(__dirname + '/public'));
//
// let expressServer = app.listen(port);
// let io = require('socket.io').listen(expressServer);
//
// console.log('Listening on port', port);
//
// let peerServer = new PeerServer({ port: 9000, path: '/chat' });
//
// peerServer.on('connection', function (id) {
//     io.emit(Topics.USER_CONNECTED, id);
//     console.log('User connected with #', id);
// });
//
// peerServer.on('disconnect', function (id) {
//     io.emit(Topics.USER_DISCONNECTED, id);
//     console.log('User disconnected with #', id);
// });