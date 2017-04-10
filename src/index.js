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
