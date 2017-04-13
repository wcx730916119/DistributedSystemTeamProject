/**
 * Created by wcx73 on 2017/3/28.
 */
/* global EventEmitter, Topics, io, Peer */
import EventEmitter from "eventemitter3";
export default class ChatProxy extends EventEmitter {
    constructor(props) {
        super(props);
        this._peers = {};
        this.name = props.name;
        console.log('peer_name:', this.name);
        this.peer = new Peer(this.name, {host: 'localhost', port: 9000});
        this.peer.on('open', function () {
            // $('#my-id').text(peer.id);
            console.log('peer.open');
        });
        this.peer.on('close', function () {
            // $('#my-id').text(peer.id);
            console.log('peer.close');
        });
        // Receiving a call
        this.peer.on('call', function (call) {
            // Answer the call automatically (instead of prompting user) for demo purposes
            call.answer(window.localStream);
            // step3(call);
        });
        this.peer.on('error', function (err) {
            alert(err.message);
            // Return to step 2 if error occurs
            // step2();
        });


    }

    setVideoSrc(stream) {
        this.cb.video.setState({src: URL.createObjectURL(stream)})
    }


    call(peer_id) {
        let call = this.peer.call(peer_id, window.localStream);
        console.log('calling');

        this.updateCallStream(call);
    }

    endCall() {
        if (window.exsistingCall) {
            window.exsistingCall.close();
        }
    }

    setCallBack(cb) {
        let chatProxySelf = this;
        this.cb = cb;
        navigator.getUserMedia({audio: true, video: true}, function (stream) {
            // Set your video displays
            chatProxySelf.setVideoSrc(stream);
            window.localStream = stream;
        }, function () {
            console.error('failed to call');
        });
    }

    updateCallStream(call) {
        let chatProxySelf = this;
        if (window.existingCall) {
            window.existingCall.close();
        }
        // Wait for stream on the call, then set peer video display
        call.on('stream', function (stream) {
            console.log('stream');
            chatProxySelf.setVideoSrc(stream);
        });
        // UI stuff
        // window.existingCall = call;
        // $('#their-id').text(call.peer);
        // call.on('close', step2);
        // $('#step1, #step2').hide();
        // $('#step3').show();
    }

    // Click handlers setup
    // $(function () {
    //     $('#make-call').click(function () {
    //         // Initiate a call!
    //         var call = peer.call($('#callto-id').val(), window.localStream);
    //         step3(call);
    //     });
    //     $('#end-call').click(function () {
    //         window.existingCall.close();
    //         step2();
    //     });
    //     // Retry if getUserMedia fails
    //     $('#step1-retry').click(function () {
    //         $('#step1-error').hide();
    //         step1();
    //     });
    //     // Get things started
    //     step1();
    // });
    // function step1() {
    //     // Get audio/video stream
    //     navigator.getUserMedia({audio: true, video: true}, function (stream) {
    //         // Set your video displays
    //         $('#my-video').prop('src', URL.createObjectURL(stream));
    //         window.localStream = stream;
    //         step2();
    //     }, function () {
    //         $('#step1-error').show();
    //     });
    // }
    //
    // function step2() {
    //     $('#step1, #step3').hide();
    //     $('#step2').show();
    // }
    //


}