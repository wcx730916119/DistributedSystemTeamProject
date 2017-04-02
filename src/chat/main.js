/**
 * Created by wcx73 on 2017/3/28.
 */
/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var lpc = window.location.search.substring(1).slice(-4);
var rpc;
if (lpc === 'wcx1') {
    rpc = 'wcx2';
}
else {
    rpc = 'wcx1';
}
var peer = new Peer(lpc, {key: '4lac1rfv8e6rbe29'}), conn;
peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
    console.log('Remote peer ID is: ' + rpc);
}).on('connection', function (conn) {
    conn.on('data', function (data) {
        console.log(data);
        self.conn.close();
        self.conn = conn;
    });
});
conn = peer.connect(rpc);
conn.on('open', function () {
    // Receive messages
    conn.on('data', function (data) {
        console.log('Received', data);
    });
    // Send messages
    conn.send('Hello from ' + lpc);
});


// conn.send('hello this is ' + lpc);

var errorElement = document.querySelector('#errorMsg');
var video = document.querySelector('video');

// Put variables in global scope to make them available to the browser console.
var constraints = window.constraints = {
    audio: false,
    video: true
};

function handleSuccess(stream) {
    var videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', constraints);
    console.log('Using video device: ' + videoTracks[0].label);
    stream.oninactive = function () {
        console.log('Stream inactive');
    };

    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
}

function handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
        errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
            constraints.video.width.exact + ' px is not supported by your device.');
    } else if (error.name === 'PermissionDeniedError') {
        errorMsg('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
    }
    errorMsg('getUserMedia error: ' + error.name, error);
}

function errorMsg(msg, error) {
    errorElement.innerHTML += '<p>' + msg + '</p>';
    if (typeof error !== 'undefined') {
        console.error(error);
    }
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);