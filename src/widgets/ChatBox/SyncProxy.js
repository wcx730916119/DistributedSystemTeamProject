/**
 * Created by wcx73 on 2017/3/28.
 */
/* global EventEmitter, Topics, io, Peer */
import EventEmitter from "eventemitter3";
export default class SyncProxy extends EventEmitter {
    constructor(props) {
        super(props);
        let self = this;
        this.name = props.name;
        console.log('peer_name:', this.name);
        this.peer = new Peer(this.name, {host: 'localhost', port: 9001});
        this.peer.on('open', function () {
            console.log('peer.open');
        });
        this.peer.on('close', function () {
            console.log('peer.close');
        });

        // Receiving a call
        this.peer.on('call', function (call) {
            console.log('local stream', window.localStream);
            call.answer(window.localStream);
            self.cb.addMessages({'name': self.name, 'text': 'hello'});
            self.updateCallStream(call);
        });

        this.peer.on('error', function (err) {
            alert(err.message);
        });
    }

    updateVideoSource(stream) {
        this.cb.video.setState({src: URL.createObjectURL(stream)})
    }


    call(peer_id) {
        let call = this.peer.call(peer_id, window.localStream);
        this.updateCallStream(call);
    }

    static endCall() {
        if (window.exsistingCall) {
            window.exsistingCall.close();
        }
    }

    setCallBack(cb) {
        let self = this;
        this.cb = cb;
        this.cb.addPeer(this.name);
        let config = this.name === 'ds' ? {audio: true, video: false} : {audio: true, video: false};
        navigator.getUserMedia(config, function (stream) {
            // Set your video displays
            self.updateVideoSource(stream);
            window.localStream = stream;
        }, function () {
            console.error('failed to call');
        });
    }

    updateCallStream(call) {
        let self = this;
        if (window.existingCall) {
            window.existingCall.close();
        }
        // Wait for stream on the call, then set peer video display
        call.on('stream', function (stream) {
            console.log('stream is coming');
            self.cb.addPeer(call.peer);
            self.updateVideoSource(stream);
        });
        window.exsistingCall = call;
    }
}