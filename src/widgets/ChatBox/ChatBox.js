/**
 * Created by wcx73 on 2017/4/9.
 */
import React, {Component} from "react";
import VideoChatComponent from "./VideoChat/VideoChat";
import PeerList from "./PeerList/PeerList";
import ChatMessage from "./TextChat/ChatMessage";
import "./ChatBox.css";
export default class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.debug = true;
        this.state = {messages: [], name: null, need_name_change: false, peers: []};
        this.connectNewPeer = this.connectNewPeer.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
        this.setNewName = this.setNewName.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
        /*
         let self = this;
         if (window["WebSocket"]) {
         this.conn = new WebSocket("ws://localhost:8080/ws");
         this.conn.onclose = function (event) {
         self.addMessages({user: 'UNK', text: 'user closed'})
         };
         this.conn.onmessage = function (event) {
         let messages = event.data.split('\n');
         for (let i = 0; i < messages.length; i++) {
         this.addMessages(JSON.parse(messages[i]));
         }
         }.bind(this);
         } else {
         this.addMessages({user: 'UNK', text: 'unsupported'});
         }
         */
    }

    componentDidMount() {
        if (this.debug) {
            // this.addPeer("UTX");
            // this.addPeer("ABC");
            this.addMessage({name: 'S', text: 'Welcome'});
            // this.quickSetup()
        }
    }

    quickSetup() {
        this.setState({name: window.localAppName, need_name_change: false});
        this.onNameChange(window.localAppName);
    }


    onFocusChange(name) {
        this.video.setVideoStreamByName(name);
    }

    onNameSetClick(e) {
        if (this.state.name === null)
            this.setState({need_name_change: true});
    }

    connectNewPeer() {
        this.video.setVideoStreamByName(document.getElementById("uid").value);
    }

    addMessage(message) {
        console.log('addMessage', message);
        let m = this.state.messages;
        m.push(message);
        this.setState({messages: m});
    }

    submitMessage() {
        let text = document.getElementById('btn-input');
        if (text.length !== 0) {
            this.addMessage({name: this.state.name, text: text.value});
            // if (this.conn !== null) this.conn.send(JSON.stringify({user: this.state.name, text: text.value}));
            text.value = null;
        }
    }

    addPeer(peer) {
        let peers = this.state.peers;
        peers.push(peer);
        this.setState({peers: peers});
    }

    onNameChange(newName) {
        console.log('onNameChange ' + newName + this.debug);
        if (!this.video.state.ready)
            this.video.init(newName);
    }

    setNewName(e) {
        let text = document.getElementById('btn-name').value.toUpperCase();
        if (text.length !== 0) {
            this.setState({name: text, need_name_change: false});
            this.onNameChange(text);
        }
        e.preventDefault();
    }

    render() {
        let self = this;
        return (
            <div>
                <div onClick={this.quickSetup.bind(this)}>QUICK SETUP</div>
                <div className="chatbox-name-setter">
                    {this.state.need_name_change ?
                        <form onSubmit={this.setNewName}>
                            <div className="input-group">
                                <input id="btn-name" type="text" className="form-control"
                                       placeholder="SET USER ID HERE"/>
                            </div>
                        </form> :
                        <div onClick={this.onNameSetClick.bind(this)}>{this.state.name}</div>}
                </div>
                <div className="video-wrapper">
                    <VideoChatComponent ref={(video) => this.video = video}/>
                </div>
                <div className="input-group">
                    <input id="uid" type="text" className="form-control input-sm"
                           placeholder="CONNECT TO ANOTHER USER"/>
                    <span className="input-group-btn">
                        <button className="btn btn-success btn-sm" id="btn-chat" onClick={this.connectNewPeer}>
                            <i className="material-icons">video_call</i>
                        </button>
                        </span>
                </div>
                <PeerList onFocusChange={this.onFocusChange} peers={this.state.peers}/>
                <div className="panel-body clearfix">
                    {this.state.messages.map(function (message, idx) {
                        return <ChatMessage key={idx} message={message}
                                            self={self.state.name === message.name}/>
                    })}
                </div>
                <div className="input-group">
                    <input id="btn-input" type="text" className="form-control input-sm"
                           placeholder="TYPE YOUR MESSAGE HERE"/>
                    <span className="input-group-btn">
                                <button className="btn btn-success btn-sm input-group-btn-fix" id="btn-chat"
                                        onClick={this.submitMessage.bind(this)}>
                                    <i className="material-icons">send</i>
                                </button>
                            </span>
                </div>
            </div>);
    }
}


