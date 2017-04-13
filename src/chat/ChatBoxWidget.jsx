import React, {Component} from "react";
import MessagesList from "./MessagesList";
import UsersList from "./UsersList";
import MessageInput from "./MessageInput";

export default class ChatBoxWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {users: []};
    }

    componentDidMount() {
        this.chatProxy = this.props.chatProxy;
        console.log(this.chatProxy);
        this.chatProxy.connect(this.props.username);
        this.chatProxy.onMessage(this.addMessage);
        this.chatProxy.onUserConnected(this.userConnected);
        this.chatProxy.onUserDisconnected(this.userDisconnected);
    }

    userConnected(user) {
        let users = this.state.users;
        users.push(user);
        this.setState({
            users: users
        });
    }

    userDisconnected(user) {
        let users = this.state.users;
        users.splice(users.indexOf(user), 1);
        this.setState({
            users: users
        });
    }

    messageHandler(message) {
        message = this.refs.messageInput.getDOMNode().value;
        this.addMessage({
            content: message,
            author: this.chatProxy.getUsername()
        });
        this.chatProxy.broadcast(message);
    }

    addMessage(message) {
        if (message) {
            message.date = new Date();
            this.refs.messagesList.addMessage(message);
        }
    }

    render() {
        return (
            <div className="chat-box" ref="root">
                <div className="chat-header ui-widget-header">React p2p Chat</div>
                <div className="chat-content-wrapper row">
                    <MessagesList ref="messagesList"/>
                    <UsersList users={this.state.users} ref="usersList"/>
                </div>
                <MessageInput
                    ref="messageInput"
                    messageHandler={this.messageHandler}>
                </MessageInput>
            </div>
        );
    }
}
