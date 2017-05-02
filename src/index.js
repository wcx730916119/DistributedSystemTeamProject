import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ChatBox from "./widgets/ChatBox/ChatBox";
import CodeEditor from "./widgets/CodeEditor/CodeEditor";
// console.log = function() {}; // mute console.log

window.localAppName = Math.random().toString(4).substring(6, 15);

// console.log(ips);
ReactDOM.render(
    <ChatBox />,
    document.getElementById('widget-chat-box')
);

ReactDOM.render(
    <CodeEditor />,
    document.getElementById('widget-code-editor')
);


// initialization
import PatchModule from "./util/DiffMatchPatchModule";
window.dmp = new PatchModule();

