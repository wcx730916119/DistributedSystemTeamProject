import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1>Welcome to Peer2Pair Programming Platform</h1>
                </div>
                <video id="local_pc" autoPlay muted/>
                <video id="remote_pc" autoPlay/>
            </div>

        );
    }
}

export default App;
