/**
 * Created by wcx73 on 2017/4/12.
 */
import React, {Component} from "react";
import "./VideoFrame.css";
export default class VideoFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {src: null, poster: null};
    }
    render() {
        return (
            <video ref="video" poster={this.state.poster} src={this.state.src} autoPlay/>)
    }
}
