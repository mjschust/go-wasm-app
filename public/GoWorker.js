self.importScripts('wasm_exec.js');

const go = new global.Go();

const queryFunctions = {
  loadModule({ wasmModule }) {
    global.WebAssembly.instantiate(wasmModule, go.importObject).then(result => {
      go.run(result);
      postMessage({reponseMethod: 'moduleLoaded'});
      });
  },
  computeRanks(args) {
    global.goModules.testModule.computeRankData(
      args, 
      (wt, rank) => {
      const msg = {
        responseMethod: 'addRank',
        responseArgs: { wt: Array.from(wt), rank: parseInt(rank) }
      };
      postMessage(msg);
    });
  }
};

self.onmessage = function(event) {
  const query = event.data.queryMethod;
  const args = event.data.queryArgs;
  queryFunctions[query](args);
}
