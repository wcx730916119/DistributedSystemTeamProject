/**
 * Created by wcx73 on 2017/4/9.
 */
import React, {Component} from "react";
import "./ChatBox.css";
// const ChatBox = React.createClass({
//     data: {'name': 'hahaha'},
//     render: function () {
//         return (
//             <div className="col-md-3 p2p-no-padding-widget" id="left-sidebar">
//                 <div className="p2p-main-widget p2p-no-padding-widget">
//                     <div className="panel panel-primary">
//                         <div className="panel-heading">
//                             Chat Room
//                         </div>
//                         <div className="p2p-main-widget p2p-no-padding-widget">
//                             <div className="embed-responsive embed-responsive-16by9">
//                                 <iframe className="embed-responsive-item" src="//www.youtube.com/embed/5GIj2BVJS2A"/>
//                             </div>
//                         </div>
//                         <div className="panel-body clearfix">
//                             <div className="media float-left">
//                                 <div className="media-left media-top">
//                                     <img src="img/avatar_img_2.png" className="media-object" alt=""
//                                          style={{width: 48}}/>
//                                 </div>
//                                 <div className="media-body well well-sm">
//                                     <p>{this.data.name}</p>
//                                 </div>
//                             </div>
//                             <div className="media float-right p2p-media-right">
//                                 <div className="media-body well well-sm">
//                                     <p>Lorem Ipsum is simply </p>
//                                 </div>
//                                 <div className="media-right media-top">
//                                     <img src="img/avatar_img_1.png" className="media-object" alt=""
//                                          style={{width: 48}}/>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="panel-footer">
//                             <div className="input-group">
//                                 <input id="btn-input" type="text" className="form-control input-sm"
//                                        placeholder="Type your message here..."/>
//                                 <span className="input-group-btn">
//                   <button className="btn btn-primary btn-sm" id="btn-chat">
//                     Send</button>
//                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// });
class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.data = {};
    }

    render() {
        return (
            <div className="p2p-no-padding-widget" id="left-sidebar">
                <div className="p2p-main-widget p2p-no-padding-widget">
                    <div className="panel panel-primary">
                        <div className="panel-heading">
                            Chat Room
                        </div>
                        <div className="p2p-main-widget p2p-no-padding-widget">
                            <div className="embed-responsive embed-responsive-16by9">
                                <iframe className="embed-responsive-item" src="//www.youtube.com/embed/5GIj2BVJS2A"/>
                            </div>
                        </div>
                        <div className="panel-body clearfix">
                            <div className="media float-left">
                                <div className="media-left media-top">
                                    <img src="img/avatar_img_2.png" className="media-object" alt=""
                                         style={{width: 48}}/>
                                </div>
                                <div className="media-body well well-sm">
                                    <p>{this.data.name}</p>
                                </div>
                            </div>
                            <div className="media float-right p2p-media-right">
                                <div className="media-body well well-sm">
                                    <p>Lorem Ipsum is simply </p>
                                </div>
                                <div className="media-right media-top">
                                    <img src="img/avatar_img_1.png" className="media-object" alt=""
                                         style={{width: 48}}/>
                                </div>
                            </div>
                        </div>
                        <div className="panel-footer">
                            <div className="input-group">
                                <input id="btn-input" type="text" className="form-control input-sm"
                                       placeholder="Type your message here..."/>
                                <span className="input-group-btn">
                  <button className="btn btn-primary btn-sm" id="btn-chat">
                    Send</button>
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}


export default ChatBox;
