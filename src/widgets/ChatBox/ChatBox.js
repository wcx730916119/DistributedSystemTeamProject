/**
 * Created by wcx73 on 2017/4/9.
 */
import React, {Component} from "react";
import ChatProxy from "./ChatProxy";
import "./ChatBox.css";
import VideoFrame from "./VideoFrame/VideoFrame";
class ChatBox extends Component {
    constructor(props) {
        super(props);
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        this.connectNewPeer = this.connectNewPeer.bind(this);
    }

    hello() {
        console.log('this is chatbox.js');
    }

    connectNewPeer(e) {
        console.log('handle event', this);
        this.proxy.call(document.getElementById("uid").value);
    }
    componentDidMount() {
        this.proxy = new ChatProxy({name: Math.random().toString(36).substring(7)});
        this.proxy.setCallBack(this);
    }

    render() {
        return (
            <div className="p2p-no-padding-widget" id="left-sidebar">
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        Chat Room
                    </div>
                    <div className="p2p-main-widget p2p-no-padding-widget">
                        <VideoFrame ref={(video) => this.video = video}/>
                        <input id="uid"></input>

                        <button onClick={this.connectNewPeer}>ac</button>
                    </div>
                    <div className="panel-body clearfix">
                        <div className="media float-left">
                            <div className="media-left media-top">
                                <img src="img/avatar_img_2.png" className="media-object" alt=""
                                     style={{width: 48}}/>
                            </div>
                            <div className="media-body well well-sm">
                                <p>None</p>
                            </div>
                        </div>
                        <div className="media float-right p2p-media-right">
                            <div className="media-body well well-sm">
                                <p>Lorem Ipsum is simply </p>
                            </div>
                            <div className="media-right media-top">
                                <img src="img/avatar_img_1.png" className="media-object" alt=""
                                     style={{width: 48}}/>
                            </div>
                        </div>
                    </div>
                    <div className="panel-footer">
                        <div className="input-group">
                            <input id="btn-input" type="text" className="form-control input-sm"
                                   placeholder="Type your message here..."/>
                            <span className="input-group-btn">
                  <button className="btn btn-primary btn-sm" id="btn-chat">
                    Send</button>
                </span>
                        </div>
                    </div>
                </div>
            </div>);
    }
}


export default ChatBox;
