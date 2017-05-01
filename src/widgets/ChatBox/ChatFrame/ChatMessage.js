/**
 * Created by wcx73 on 2017/4/15.
 */
import React, {Component} from "react";
import Avatar from "react-avatar";

export default class ChatMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {name: props.message.user, message: props.message.text, self: props.self};
    }

    render() {

        return (
            <div className="media float-left">
                {this.state.self ? null : <div className="media-left media-top">
                    <Avatar size="32px" name={this.state.name}/>
                </div>}
                <div className="media-body well well-sm">
                    <p>{this.state.message}</p>
                </div>
                {this.state.self ? <div className="media-left media-top">
                    <Avatar size="32px" name={this.state.name}/>
                </div> : null}
            </div>
        )
    }
}
