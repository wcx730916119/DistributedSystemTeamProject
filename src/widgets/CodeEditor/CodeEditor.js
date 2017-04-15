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

class CodeEditor extends Component {
    constructor(props) {
        super(props);
        this.defaultValue = [{
            'lang': 'java',
            'code': 'System.out.println("Hello World");\n'
        }, {
            'lang': 'python',
            'code': 'print "Hello World"'
        }];
        this.editor = <AceEditor
            mode="python"
            theme="github"
            name="codepad"
            height="calc(100vh - 128px)"
            width="100%"
            // onLoad={}
            onChange={CodeEditor.onChange}
            value="print 'Hello World'"
        />;
        this.terminal = <AceEditor
            mode="python"
            theme="github"
            name="codepad"
            height="calc(100vh - 128px)"
            width="100%"
            // onLoad={}
            onChange={CodeEditor.onChange}
            value="Hello World"
        />;


    }

    componentDidMount() {
    }


    static onChange(newValue) {
        console.log(newValue);
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-6">{this.editor}</div>
                    <div className="col-md-6">{this.terminal}</div>
                </div>
                <div className="container-fluid">
                    <select className="selectpicker">
                        {this.defaultValue.map((lang, id) => {
                                return <option key={id}>{lang['lang']}</option>
                            }
                        )}
                    </select>
                    <button className="btn btn-success">RUN</button>
                </div>
            </div>
        );
    }
}

export default CodeEditor;
