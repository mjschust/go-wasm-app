self.importScripts('wasm_exec.js');

const go = new global.Go();

function postRank(wt, rank) {
    const msg = { wt: Array.from(wt), rank };
    postMessage(msg);
}

self.onmessage = function(wasmModule) {
    global.WebAssembly.instantiate(wasmModule.data, go.importObject).then(result => {
        go.run(result);
        global.goModules.testModule.computeRankData(postRank)
    });
}
