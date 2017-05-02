/**
 * Created by wcx73 on 2017/4/15.
 */
import React, {Component} from "react";
import Avatar from "react-avatar";
import "./ChatMessage.css";

export default class ChatMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {name: props.message.user, message: props.message.text, self: props.self};
        this.avatar = <div className="media-left media-top">
            <Avatar size={32} name={this.state.name}/></div>
    }

    render() {
        return (
            <div className="media">
                {this.state.self ? null : this.avatar}
                <div className="media-body well well-sm">
                    <p>{this.state.message}</p>
                </div>
                {this.state.self ? this.avatar : null}
            </div>
        )
    }
}
