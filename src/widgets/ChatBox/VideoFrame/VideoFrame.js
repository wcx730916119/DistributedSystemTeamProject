/**
 * Created by wcx73 on 2017/4/12.
 */
import React, {Component} from "react";
import "./VideoFrame.css";
// import "./ChatBox.css";
export default class VideoFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {src: 'abc'};
    }
    render() {
        return (
            <video ref="video" src={this.state.src} autoPlay/>)
    }
}
