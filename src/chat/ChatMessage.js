/**
 * Created by wcx73 on 2017/4/11.
 */
import React, {Component} from "react";
class ChatMessage extends Component {
    render() {
        let msg = this.props.message;
        // let hours = msg.date.getHours();
        // let minutes = msg.date.getMinutes();
        let hours = 10;
        let minutes = 5;
        hours = (hours < 9) ? '0' + hours : hours;
        minutes = (minutes < 9) ? '0' + minutes : minutes;
        return (
            <div className="chat-message">
                <div className="message-time">[{ hours + ':' + minutes }]</div>
                <div className="message-author">&lt;{msg.author}&gt;</div>
                <div className="message-content">{msg.content}</div>
            </div>
        );
    }
}

export default ChatMessage;