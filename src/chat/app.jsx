// $(function () {
//     'use strict';
//     console.log('app.jsx');
//     $('#connect-btn').click(function () {
//         initChat($('#container')[0],
//             $('#username-input').val());
//     });
//
//     function initChat(container, username) {
//         let proxy = new ChatProxy();
//         React.renderComponent(<ChatBox chatProxy={proxy} username={username}/>,
//             container);
//     }
//
//     window.onbeforeunload = function () {
//         return 'leaving';
//     };
//
// });
import React from "react";
import ReactDOM from "react-dom";
import ChatProxy from "./ChatProxy";
import ChatBoxWidget from "./ChatBoxWidget";
exports.runClient = function () {
    document.getElementById("connect-btn").onclick = function () {
        initChat(document.getElementById("container"), document.getElementById("username-input").value)
    };

    function initChat(container, username) {
        const chatProxy = new ChatProxy();
        ReactDOM.render(<ChatBoxWidget chatProxy={chatProxy} username={username}/>, container);
    }
};
