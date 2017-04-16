/**
 * Created by wcx73 on 2017/4/15.
 */
import React, {Component} from "react";
import "./PeerList.css";
import PeerListItem from "./PeerListItem";

export default class PeerList extends Component {
    constructor(props) {
        super(props);
        this.state = {peers: ["victor", "raj", "chenxi"]};
    }

    render() {

        return (
            <ul className="list-group-horizontal"> {
                this.state.peers.map(function (name, idx) {
                    return <PeerListItem className="list-group-item" key={idx} name={name}/>;
                })}
            </ul>
        )
    }
}
