let DiffMatchPatch = require('diff-match-patch');
let patch_text = "";
class diffSingleton {
    constructor() {
        this.dmp = new DiffMatchPatch();
    }

    createDiffAndPatch(originalText, inputText) {
        //for now hardcode these values for testing
        let diff = this.dmp.diff_main(originalText, inputText);
        let patch_list = this.dmp.patch_make(originalText, inputText, diff);

        let patch = this.dmp.patch_toText(patch_list);
        console.log(originalText);
        console.log(inputText);
        console.log(patch);
        return patch;
        // put this text in Key-Value store maybe ?.
    }

    applyPatch(originalText, patchText) {
        console.log('input OG:\n', originalText);
        console.log('input PT:\n', patchText);
        // for now overwrite with hard coded values
        let patches = this.dmp.patch_fromText(patchText);
        console.log(patches);
        let results = this.dmp.patch_apply(patches, originalText);
        // for now just print this output
        console.log('output:', results[0]);

        return results[0];
    }
}

module.exports = diffSingleton;
