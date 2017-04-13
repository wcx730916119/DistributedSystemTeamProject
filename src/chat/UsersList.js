/**
 * Created by wcx73 on 2017/4/11.
 */
import React, {Component} from "react";
class UsersList extends Component {
    render() {
        let users = this.props.users.map(function (user) {
            return <div className="chat-user">{user}</div>;
        });
        return (
            <div className="users-list col-xs-3">
                {users}
            </div>
        );
    }
}

export default UsersList;