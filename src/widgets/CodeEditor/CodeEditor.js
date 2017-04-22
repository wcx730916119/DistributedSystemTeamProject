/**
 * Created by wcx73 on 2017/4/9.
 */
import React, {Component} from "react";
import "./CodeEditor.css";
import AceEditor from "./AceEditor/AceEditor";
import "brace/mode/java";
import "brace/mode/javascript";
import "brace/mode/python";
import "brace/theme/github";
import axios from "axios";
export default class CodeEditor extends Component {
    constructor(props) {
        super(props);
        this.runProgram = this.runProgram.bind(this);
        this.defaultValue = [{
            'lang': 'java',
            'code': 'System.out.println("Hello World");\n'
        }, {
            'lang': 'python',
            'code': 'print "Hello World"'
        }];
        this.state = {code: "print 'hello world'", out: ''};
        this.editor = <AceEditor
            mode="python"
            theme="github"
            name="codepad"
            height="calc(100vh - 128px)"
            width="100%"
            // onLoad={}
            onChange={CodeEditor.onChange}
            value="print 'hello world'"
        />;
        this.terminal = <AceEditor
            mode="python"
            theme="github"
            name="codepad"
            height="calc(100vh - 128px)"
            width="100%"
            // onLoad={}
            onChange={CodeEditor.onChange}
            value={this.state.out}
        />;
    }

    componentDidMount() {
    }

    runProgram() {
        let self = this;
        let code = this.state.code;
        axios.get('http://localhost:3001/code?code=' + code).then(function (response) {
            // perform setState here
            console.log(response.data);
            self.setState({'out': response.data});
            console.log(self.state);
        }).catch(function (error) {
            //Some error occurred
            console.error('error', error);
        });
    }

    static onChange(newValue) {
        console.log(newValue);
        this.state.code = newValue;
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-6">{this.editor}</div>
                    {/*<div className="col-md-6">{this.terminal}</div>*/}
                    <div className="col-md-6">{this.state.out}</div>
                </div>
                <div className="container-fluid">
                    <select className="selectpicker">
                        {this.defaultValue.map((lang, id) => {
                                return <option key={id}>{lang['lang']}</option>
                            }
                        )}
                    </select>
                    <button className="btn btn-success" onClick={this.runProgram}>RUN</button>
                </div>
            </div>
        );
    }
}

