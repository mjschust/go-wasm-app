import wasm from './wasm/conformal-blocks.wasm';

/**
 * Run go wasm in main thread.
 */
function runWasm() {
  const go = new global.Go();

  global.WebAssembly.instantiateStreaming(fetch(wasm), go.importObject).then(async (result) => {
    go.run(result.instance);
  });
}

export default runWasm;