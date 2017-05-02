/**
 * Created by wcx73 on 2017/4/15.
 */
import React, {Component} from "react";
import PeerListItem from "./PeerListItem";
import "./PeerList.css";

export default class PeerList extends Component {
    constructor(props) {
        super(props);
        this.state = {peers: this.props.peers, detail: null};
        this.onFocusChange = this.onFocusChange.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
    }

    onFocusChange(newValue) {
        if (newValue) this.props.onFocusChange(newValue);
    }

    onMouseOver(newValue) {
        this.setState({detail: newValue});
    }

    render() {
        return (
            <div className="chatbox-peer-list">
                <ul className="list-group-horizontal"> {
                    this.state.peers.map(function (name, idx) {
                        return <PeerListItem className="list-group-item" key={idx} name={name}
                                             onFocusChange={this.onFocusChange} onMouseOver={this.onMouseOver}/>;
                    }.bind(this))}
                </ul>
                <p>{this.state.detail}</p>
            </div>
        )
    }
}
