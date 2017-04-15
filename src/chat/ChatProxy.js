/**
 * Created by wcx73 on 2017/3/28.
 */
// 'use strict';
/* global EventEmitter, Topics, io, Peer */
import * as Topics from "./ConnectionTopics";
import EventEmitter from "eventemitter3";
export default class ChatProxy extends EventEmitter {
    constructor(props) {
        super(props);
        this.onMessage = function (cb) {
            this.addListener(Topics.USER_MESSAGE, cb);
        };
        this._peers = {};

        this.getUsername = function () {
            return this._username;
        };

        this.setUsername = function (username) {
            this._username = username;
        };
        this.onUserConnected = function (cb) {
            this.addListener(Topics.USER_CONNECTED, cb);
        };

        this.onUserDisconnected = function (cb) {
            this.addListener(Topics.USER_DISCONNECTED, cb);
        };

        this.send = function (user, message) {
            this._peers[user].send(message);
        };

        this.broadcast = function (msg) {
            for (let peer in this._peers) {
                this.send(peer, msg);
            }
        };

        this.connect = function (username) {
            let self = this;
            this.setUsername(username);
            this.socket = io('localhost:3001');
            this.socket.on('connect', function () {
                self.socket.on(Topics.USER_CONNECTED, function (userId) {
                    if (userId === self.getUsername()) {
                        return;
                    }
                    self._connectTo(userId);
                    self.emit(Topics.USER_CONNECTED, userId);
                    console.log('User connected', userId);
                });
                self.socket.on(Topics.USER_DISCONNECTED, function (userId) {
                    if (userId === self.getUsername()) {
                        return;
                    }
                    self._disconnectFrom(userId);
                    self.emit(Topics.USER_DISCONNECTED, userId);
                    console.log('User disconnected', userId);
                });
            });
            console.log('Connecting with username', username);
            this.peer = new Peer(username, {
                host: location.hostname,
                port: 9000,
                path: '/chat'
            });
            this.peer.on('open', function (userId) {
                self.setUsername(userId);
            });
            this.peer.on('connection', function (conn) {
                self._registerPeer(conn.peer, conn);
                self.emit(Topics.USER_CONNECTED, conn.peer);
            });
        };

        this._connectTo = function (username) {
            let conn = this.peer.connect(username);
            conn.on('open', function () {
                this._registerPeer(username, conn);
            });
        };

        this._registerPeer = function (username, conn) {
            console.log('Registering', username);
            this._peers[username] = conn;
            conn.on('data', function (msg) {
                console.log('Messaga received', msg);
                this.emit(Topics.USER_MESSAGE, {content: msg, author: username});
            }.bind(this));
        };

        this._disconnectFrom = function (username) {
            delete this._peers[username];
        };
    }

    /*    function ChatProxy() {
     console.log('new chatproxy');
     EventEmitter.call(this);
     this._peers = {};
     }
     this.prototype = Object.create(EventEmitter.prototype);
     console.log(this.prototype);
     this.prototype.onMessage = function (cb) {
     this.addListener(Topics.USER_MESSAGE, cb);
     };

     this.prototype.getUsername = function () {
     return this._username;
     };

     this.prototype.setUsername = function (username) {
     this._username = username;
     };

     this.prototype.onUserConnected = function (cb) {
     this.addListener(Topics.USER_CONNECTED, cb);
     };

     this.prototype.onUserDisconnected = function (cb) {
     this.addListener(Topics.USER_DISCONNECTED, cb);
     };

     this.prototype.send = function (user, message) {
     this._peers[user].send(message);
     };

     this.prototype.broadcast = function (msg) {
     for (var peer in this._peers) {
     this.send(peer, msg);
     }
     };

     this.prototype.connect = function (username) {
     var self = this;
     this.setUsername(username);
     this.socket = io();
     this.socket.on('connect', function () {
     self.socket.on(Topics.USER_CONNECTED, function (userId) {
     if (userId === self.getUsername()) {
     return;
     }
     self._connectTo(userId);
     self.emit(Topics.USER_CONNECTED, userId);
     console.log('User connected', userId);
     });
     self.socket.on(Topics.USER_DISCONNECTED, function (userId) {
     if (userId === self.getUsername()) {
     return;
     }
     self._disconnectFrom(userId);
     self.emit(Topics.USER_DISCONNECTED, userId);
     console.log('User disconnected', userId);
     });
     });
     console.log('Connecting with username', username);
     this.peer = new Peer(username, {
     host: location.hostname,
     port: 9000,
     path: '/chat'
     });
     this.peer.on('open', function (userId) {
     self.setUsername(userId);
     });
     this.peer.on('connection', function (conn) {
     self._registerPeer(conn.peer, conn);
     self.emit(Topics.USER_CONNECTED, conn.peer);
     });
     };

     this.prototype._connectTo = function (username) {
     var conn = this.peer.connect(username);
     conn.on('open', function () {
     this._registerPeer(username, conn);
     }.bind(this));
     };

     this.prototype._registerPeer = function (username, conn) {
     console.log('Registering', username);
     this._peers[username] = conn;
     conn.on('data', function (msg) {
     console.log('Messaga received', msg);
     this.emit(Topics.USER_MESSAGE, { content: msg, author: username });
     }.bind(this));
     };

     this.prototype._disconnectFrom = function (username) {
     delete this._peers[username];
     };*/
}