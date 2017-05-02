export default class DiffMatchPatchModule {
    constructor() {
        let DiffMatchPatch = require('diff-match-patch');
        this.dmp = new DiffMatchPatch();
    }

    createDiffAndPatch(originalText, inputText) {
        //for now hardcode these values for testing
        let diff = this.dmp.diff_main(originalText, inputText);
        let patch_list = this.dmp.patch_make(originalText, inputText, diff);
        return this.dmp.patch_toText(patch_list);
        // put this text in Key-Value store maybe ?.
    }

    applyPatch(originalText, patchText) {
        // for now overwrite with hard coded values
        let patches = this.dmp.patch_fromText(patchText);
        let results = this.dmp.patch_apply(patches, originalText);
        // for now just print this output
        return results[0];
    }
}
