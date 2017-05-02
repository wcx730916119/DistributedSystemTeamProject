/**
 * Created by wcx73 on 2017/4/15.
 */
import React, {Component} from "react";
import Avatar from "react-avatar";
export default class PeerListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {name: props.name};
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onMouseOver() {
        this.props.onMouseOver(this.state.name)
    }

    onMouseOut() {
        this.props.onMouseOver(null)
    }

    onClick() {
        this.props.onFocusChange(this.state.name)
    }

    render() {
        return (
            <li className="list-group-item" onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver}
                onClick={this.onClick}>
                <Avatar size={32} name={this.state.name}/>
            </li>
        )
    }
}

