/**
 * Created by wcx73 on 2017/4/9.
 */
/**
 * Created by wcx73 on 2017/4/9.
 */
import React, {Component} from "react";
import "./CodeEditor.css";
import AceEditor from "react-ace";
import "brace/mode/java";
import "brace/mode/javascript";
import "brace/theme/github";

class CodeEditor extends Component {
    languages = ['Java', 'Python', 'C/C++'];

    constructor(props) {
        super(props);
        this.data = {"languages": ['Java', 'Python']};
        this.editor = <AceEditor
            mode="java"
            theme="github"
            name="codepad"
            height="calc(100vh - 120px)"
            width="100%"
            onLoad={CodeEditor.onLoad}
            onChange={CodeEditor.onChange}
            value='public class HelloWorld {
}'
        />;
    }

    componentDidMount() {
    }

    static onLoad() {
        console.log('aa');
    }

    static onChange(newValue) {
        console.log(newValue);
    }

    render() {
        return (
            <div>
                {this.editor}
                <div className="container-fluid">
                    <select className="selectpicker">
                        {this.languages.map((lang) =>
                            <option key={lang}>{lang}</option>
                        )}
                    </select>
                    <button className="btn btn-success">RUN</button>
                </div>
            </div>
        );
    }
}

export default CodeEditor;
