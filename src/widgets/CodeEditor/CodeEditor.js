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
        this.defaultValue = [{
            'lang': 'java',
            'code': 'System.out.println("Hello World");\n'
        }, {
            'lang': 'python',
            'code': 'print "Hello World"'
        }];
        this.state = {output: '', code: "print 'hello world'"};
        this.codeEditor = <AceEditor
            mode="python"
            theme="github"
            name="codepad"
            height="calc(100vh - 270px)"
            width="100%"
            onChange={this.onChange.bind(this)}
            defaultValue="print 'hello world'"
        />;
    }

    componentDidMount() {
    }

    onChange(newValue) {
        this.setState({'code':newValue});
    }


    runProgram() {

        axios.get('http://localhost:3001/code?code=' + encodeURIComponent(this.state.code)).then(function (response) {
            this.setState({'output': response.data});
            console.log(this.state)
        }.bind(this)).catch(function (error) {
            //Some error occurred
            console.error('error', error);
        });
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-6">{this.codeEditor}</div>
                    <div className="col-md-6 output-area">{this.state.output}</div>
                </div>
                <div className="container-fluid">
                    <button className="btn btn-success " onClick={this.runProgram.bind(this)}>RUN</button>
                </div>
            </div>
        );
    }
}

