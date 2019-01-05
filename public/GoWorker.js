self.importScripts('wasm_exec.js');

const go = new global.Go();

const queryFunctions = {
  loadModule({ wasmModule }) {
    global.WebAssembly.instantiate(wasmModule, go.importObject).then(result => {
      go.run(result);
      });
  },
  computeRanks(args) {
    global.goModules.testModule.computeRankData(
      args, 
      (weight, rank) => {
      const msg = {
        responseMethod: 'addData',
        responseArgs: { weight: Array.from(weight), rank: parseInt(rank) }
      };
      postMessage(msg);
    });
  },
  computeDivisors(args) {
    global.goModules.testModule.computeDivisorData(
      args, 
      (weight, rank, divisor) => {
      const msg = {
        responseMethod: 'addData',
        responseArgs: { weight: Array.from(weight), rank: parseInt(rank), divisor }
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
