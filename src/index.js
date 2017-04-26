import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// render ChatBoxWidget widget
import ChatBox from "./widgets/ChatBox/ChatBox";
import CodeEditor from "./widgets/CodeEditor/CodeEditor";

ReactDOM.render(
    <ChatBox />,
    document.getElementById('widget-chat-box')
);

ReactDOM.render(
    <CodeEditor />,
    document.getElementById('widget-code-editor')
);