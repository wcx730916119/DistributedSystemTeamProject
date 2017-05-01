/**
 * Created by wcx73 on 2017/4/15.
 */
import React, {Component} from "react";
import Avatar from "react-avatar";
export default class PeerListItem extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        console.log('name', props.name);
        this.state = {name: props.name, visible: false};
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    onMouseOver() {
        this.setState({visible: true})
    }

    onMouseOut() {
        this.setState({visible: false})
    }

    render() {
        let self = this;
        let name;
        if (this.state.visible) {
            name = <div style={{position: "absolute"}}>{this.state.name}</div>
        } else {
            name = null;
        }
        return (
            <li className="list-group-item" onMouseOut={self.onMouseOut} onMouseOver={self.onMouseOver}>
                <Avatar ref="avatar" size="32px" name={this.state.name}/>
                {name }
            </li>
        )
    }
}
