/**
 * Created by wcx73 on 2017/4/12.
 */
import React, {Component} from "react";
import VideoChatClient from "./VideoChatClient";
import "./VideoChat.css";
export default class VideoChatComponent extends Component {
    constructor(props) {
        super(props);
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        this.state = {src: null, poster: null, focus: null, ready: false};
    }

    init(name) {
        console.log("init with " + name);
        this.name = name;
        this.client = new VideoChatClient({name: name, onSrcChange: this.onSrcChange.bind(this)});
        this.setState({ready: true});
        this.setVideoStreamByName(name);
    }

    componentDidMount() {
        this.video = document.querySelector('video');
    }

    setVideoStreamByName(name) {
        this.client.getVideoStreamByName(name);
    }

    onSrcChange(stream) {
        console.log(stream);
        this.video.srcObject = stream;
        // this.setState({src: URL.createObjectURL(stream)})
        console.log(this.video.srcObject);
    }


    render() {
        return (
            <div>
                <video poster={this.state.poster} src={this.state.src} autoPlay/>
            </div>
        )
    }
}

