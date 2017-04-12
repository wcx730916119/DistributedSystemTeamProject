"use strict";
var DiffMatchPatch = require('diff-match-patch');
var patch_text = "";
class diffSingleton {
    constructor() {
        this.dmp = new DiffMatchPatch();
    }

    createDiffAndPatch( originalText, inputText ) {
        //for now hardcode these values for testing
        var originalText = "beep boop";
        var inputText = "beep boob blah";
        var ms_start = (new Date()).getTime();
        var diff = this.dmp.diff_main(originalText, inputText);
        var ms_end = (new Date()).getTime();
        console.log( diff );
        console.log( "time for this diff " + ( ms_end - ms_start) / 1000 );
        var patch_list = this.dmp.patch_make(originalText, inputText, diff);
        patch_text = this.dmp.patch_toText(patch_list);
        console.log( patch_text );
        // put this text in Key-Value store maybe ?.
    }

    applyPatch( originalText, patchText ) {
        // for now overwrite with hard coded values
        var originalText = "beep boop";
        patchText = patch_text;
        var patches = this.dmp.patch_fromText(patchText);
        var ms_start = (new Date).getTime();
        var results = this.dmp.patch_apply(patches, originalText );
        var ms_end = (new Date).getTime();
        console.log( 'Time: ' + (ms_end - ms_start) / 1000 + 's' );
        //for now just print this output
        console.log( results[0] );
    }
}

module.exports = diffSingleton;
