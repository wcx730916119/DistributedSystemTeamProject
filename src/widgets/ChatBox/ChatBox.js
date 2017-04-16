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
        this.state = {messages: [], name: ''};
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        this.connectNewPeer = this.connectNewPeer.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
        this.submitName = this.submitName.bind(this);
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
            this.submitName();
        }
    }

    submitName() {
        let text = document.getElementById('btn-name').value;
        console.log('submitName', text);
        if (text.length !== 0) {
            this.setState({name: text});
            this.proxy = new ChatProxy({name: text});
            this.proxy.setCallBack(this);

            // TODO: test
            this.addMessages({user: 'chenxi', text: "hello1"});
            this.addMessages({user: 'victor', text: "hello2"});
        }
    }

    render() {
        let self = this;
        return (
            <div className="p2p-no-padding-widget" id="left-sidebar">
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        {
                            this.state.name === '' ?
                                <div className="input-group">
                                    <input id="btn-name" type="text" className="form-control input-sm"
                                           placeholder="user id" onKeyUp={this.nameKeyHandler}/>
                                    <span className="input-group-btn">
                                    <button className="btn btn-primary btn-sm" id="btn-chat" onClick={this.submitName}
                                    >Set</button>
                                    </span>
                                </div> :
                                <p>{this.state.name}</p>
                        }
                    </div>
                    <div className="p2p-main-widget p2p-no-padding-widget">
                        <VideoFrame ref={(video) => this.video = video}/>
                    </div>
                    <div className="panel-footer">
                        <div className="input-group">
                            <input id="uid" type="text" className="form-control input-sm"
                                   placeholder="user id" onKeyUp={this.keyHandler}/>
                            <span className="input-group-btn">
                                <button className="btn btn-primary btn-sm" id="btn-chat" onClick={this.connectNewPeer}
                                >Connect</button>
                            </span>
                        </div>
                    </div>
                    <PeerList/>
                    <div className="panel-body clearfix">
                        {this.state.messages.map(function (message, idx) {
                            return <ChatMessage key={idx} message={message}
                                                self={self.state.name === message.user}/>
                        })}
                    </div>
                    <div className="panel-footer">
                        <div className="input-group">
                            <input id="btn-input" type="text" className="form-control input-sm"
                                   placeholder="Type your message here..." onKeyUp={this.keyHandler}/>
                            <span className="input-group-btn">
                                <button className="btn btn-primary btn-sm" id="btn-chat" onClick={this.submitMessage}
                                >Send</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>);
    }
}


