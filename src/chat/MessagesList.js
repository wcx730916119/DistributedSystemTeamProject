/**
 * Created by wcx73 on 2017/4/11.
 */
import React, {Component} from "react";
import ChatMessage from "./ChatMessage";

class MessagesList extends Component {
    constructor() {
        super();
        this.state = {messages: []}
    }

    addMessage(message) {
        let messages = this.state.messages;
        messages.push(message);
        this.setState({messages: messages});
        // let container = this.refs.messageContainer.getDOMNode();
        // // Smart scrolling - when the name is
        // // scrolled a little we don't want to return him back
        // if (container.scrollHeight -
        //     (container.scrollTop + container.offsetHeight) >= 50) {
        //     this.scrolled = true;
        // } else {
        //     this.scrolled = false;
        // }
    }

    // componentDidUpdate() {
    //     if (this.scrolled) {
    //         return;
    //     }
    //     let container = this.refs.messageContainer.getDOMNode();
    //     container.scrollTop = container.scrollHeight;
    // }

    render() {
        console.log(this.state);
        let messages = this.state.messages.map(function (message) {
            console.log(message);
            return (
                <ChatMessage message={message}/>
            );
        });
        if (!messages.length) {
            messages = <div className="chat-no-messages">No messages</div>;
        }
        return (
            <div ref="messageContainer" className="chat-messages col-xs-9">
                {messages}
            </div>
        );
    }
}

export default MessagesList;
