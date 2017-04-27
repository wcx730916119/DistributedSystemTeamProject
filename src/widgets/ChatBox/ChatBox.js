/**
 * Created by wcx73 on 2017/4/9.
 */
import React, {Component} from "react";
import ChatProxy from "./ChatProxy";
import "./ChatBox.css";
import VideoFrame from "./VideoFrame/VideoFrame";
import PeerList from "./PeerList/PeerList";
import ChatMessage from "./ChatFrame/ChatMessage";

export default class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {messages: [], name: '', peers: []};
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        this.connectNewPeer = this.connectNewPeer.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
        this.setName = this.setName.bind(this);
        this.nameKeyHandler = this.nameKeyHandler.bind(this);
    }

    connectNewPeer(e) {
        this.proxy.call(document.getElementById("uid").value);
    }

    componentDidMount() {

    }

    addMessages(message) {
        let m = this.state.messages;
        m.push(message);
        this.setState({messages: m});
    }

    keyHandler(event) {
        if (event.keyCode === 13) {
            this.submitMessage();
        }
    }


    submitMessage() {
        let text = document.getElementById('btn-input');
        if (text.length !== 0) {
            this.addMessages({text: text.value, user: this.state.name});
            text.value = null;
        }
    }

    nameKeyHandler(event) {
        if (event.keyCode === 13) {
            this.setName();
        }
    }

    addPeer(peer) {
        let peers = this.state.peers;
        peers.push(peer);
        this.setState({peers: peers});
    }


    setName() {
        let text = document.getElementById('btn-name').value.toUpperCase();
        if (text.length !== 0) {
            this.setState({name: text});
            this.proxy = new ChatProxy({name: text});
            this.proxy.setCallBack(this);
        }
    }

    render() {
        let self = this;
        return (
            <div>
                <div>
                    {this.state.name === '' ?
                        <div className="input-group">
                            <input id="btn-name" type="text" className="form-control"
                                   placeholder="SET USER ID HERE" onKeyUp={this.nameKeyHandler}/>
                        </div> :
                        <p>{this.state.name}</p>}
                </div>
                <div className="video-wrapper">
                    <VideoFrame ref={(video) => this.video = video}/>
                </div>
                <div className="input-group">
                    <input id="uid" type="text" className="form-control input-sm"
                           placeholder="CONNECT TO ANOTHER USER" onKeyUp={this.keyHandler}/>
                    <span className="input-group-btn">
                        <button className="btn btn-success btn-sm" id="btn-chat" onClick={this.connectNewPeer}>
                            <i className="material-icons">video_call</i>
                        </button>
                        </span>
                </div>
                <PeerList peers={this.state.peers}/>
                <div className="panel-body clearfix">
                    {this.state.messages.map(function (message, idx) {
                        return <ChatMessage key={idx} message={message}
                                            self={self.state.name === message.name}/>
                    })}
                </div>
                <div className="input-group">
                    <input id="btn-input" type="text" className="form-control input-sm"
                           placeholder="TYPE YOUR MESSAGE HERE" onKeyUp={this.keyHandler}/>
                    <span className="input-group-btn">
                                <button className="btn btn-success btn-sm input-group-btn-fix" id="btn-chat"
                                        onClick={this.submitMessage}>
                                    <i className="material-icons">send</i>
                                </button>
                            </span>
                </div>
            </div>);
    }
}


