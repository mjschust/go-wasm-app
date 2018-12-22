self.importScripts('wasm_exec.js');

const go = new global.Go();

function postRank(wt, rank) {
    const msg = { wt: Array.from(wt), rank };
    postMessage(msg);
}

self.onmessage = function(wasmModule) {
    global.WebAssembly.instantiate(wasmModule.data, go.importObject).then(result => {
        go.run(result);
        // global.goModules.testModule.computeSymmetricRank(
        //     {
        //         rank: 2,
        //         level: 2,
        //         numPoints: 4,
        //         weight: [1, 1]
        //     },
        //     rank => postRank([1,1], rank)
        // );
        global.goModules.testModule.computeRankData(postRank)
        //global.goModules.testModule.benchmarkRank();
    });
}
