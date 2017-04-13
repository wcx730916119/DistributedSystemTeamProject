/**
 * Created by wcx73 on 2017/4/11.
 */
import React, {Component} from "react";
export default class MessageInput extends Component {
    constructor(props) {
        super(props);
        this.keyHandler = this.keyHandler.bind(this);
        this.state = {input: document.getElementById('input_text')};
    }

    keyHandler(event) {
        let msg = document.getElementById('input_text').value;
        if (event.keyCode === 13) {
            this.props.messageHandler(msg);
            this.setState({message: ''});
        }
    }

    render() {
        // let msg = this.props.message;
        // let hours = msg.date.getHours();
        // let minutes = msg.date.getMinutes();
        // hours = (hours < 9) ? '0' + hours : hours;
        // minutes = (minutes < 9) ? '0' + minutes : minutes;
        return (
            <input type="text"
                   className='form-control'
                   id="input_text"
                   placeholder='Enter a message...'
                // valueLink={this.linkState('message')}
                   onKeyUp={this.keyHandler}/>
        );
    }
}
