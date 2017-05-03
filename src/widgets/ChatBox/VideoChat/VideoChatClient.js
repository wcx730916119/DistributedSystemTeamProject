/* global EventEmitter, Topics, io, Peer */
import EventEmitter from "eventemitter3";
export default class ChatProxyModule extends EventEmitter {
    constructor(props) {
        super(props);
        this.name = props.name;
        this.onSrcChange = props.onSrcChange;
        this.data = {};
        // this.createLocalStream();
        this.peer = new Peer(this.name, {host: 'ec2-54-183-177-160.us-west-1.compute.amazonaws.com', port: 9001});
        console.log(this.peer);
        this.peer.on('open', function () {
            console.log('peer.open');
        });
        this.peer.on('close', function () {
            console.log('peer.close');
        });

        this.peer.on('call', function (call) {
            console.log('peer.oncall');
            call.answer(this.data.localStream);
            this.registerCall(call.peer, call);
        }.bind(this));

        this.peer.on('error', function (err) {
            alert(err.message);
        });
    }

    createLocalStream() {
        // get local stream
        navigator.getUserMedia({audio: true, video: {width: 270, height: 189}}, function (stream) {
            // set video displays
            this.data.localStream = stream;
            // this.data.localStreamURL = URL.createObjectURL(stream);
            this.onSrcChange(stream);
            console.log('local');
            console.log(stream);

        }.bind(this), function () {
            console.error('failed to create local stream');
        });
    }

    getVideoStreamByName(name) {
        console.log(this.data);
        if (name === this.name) {
            if (this.data.localStream) {
                console.log("local stream found");
                return this.data.localStream;
            } else {
                console.log("create local stream");
                this.createLocalStream();
            }
        } else {
            if (this.data.name) {
                console.log("peer stream found");
                return this.data[name].stream;
            } else {
                console.log("call " + name);
                this.data[name] = {};
                this.call(name);
            }
        }
    }

    call(peerName) {
        let call = this.peer.call(peerName, this.data.localStream);
        this.registerCall(peerName, call);
    }

    registerCall(peerName, call) {
        console.log("register call " + peerName);
        if (!this.data[peerName]) {
            this.data[peerName] = {};
        }
        this.data[peerName].call = call;
        // Wait for stream on the call, then set peer video display
        this.data[peerName].call.on('stream', function (stream) {
            console.log('on call stream');
            this.data[peerName].stream = stream;
            this.onSrcChange(stream);
        }.bind(this));
    }

    close(peer) {
        let peerCall = this.data[peer];
        if (peerCall) {
            console.log("b4 close" + this.data);
            peerCall.call.close();
            delete this.data[peer];
            console.log("aft close", this.data);
        }
    }
}