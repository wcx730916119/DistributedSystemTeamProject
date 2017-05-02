/* global EventEmitter, Topics, io, Peer */
import EventEmitter from "eventemitter3";
export default class ChatProxyModule extends EventEmitter {
    constructor(props) {
        super(props);
        this.name = props.name;
        this.onSrcChange = props.onSrcChange;
        this.data = {};
        // this.createLocalStream();
        this.peer = new Peer(this.name, {host: 'localhost', port: 9001});
        this.peer.on('open', function () {
            console.log('peer.open');
        });
        this.peer.on('close', function () {
            console.log('peer.close');
        });

        this.peer.on('call', function (call) {
            call.answer(this.localStream);
        }.bind(this));

        this.peer.on('error', function (err) {
            alert(err.message);
        });

    }

    createLocalStream() {
        // get local stream
        navigator.getUserMedia({audio: true, video: true}, function (stream) {
            // Set your video displays
            this.data.localStream = stream;
            this.data.localStreamURL = URL.createObjectURL(stream);
            this.onSrcChange(this.data.localStreamURL);
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
        // Wait for stream on the call, then set peer video display
        this.data[peerName].call = call;
        call.on('stream', function (stream) {
            this.data.peer.stream = URL.createObjectURL(stream);
            this.onSrcChange(this.data.peer.stream);
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