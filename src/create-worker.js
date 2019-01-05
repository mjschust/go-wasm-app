import wasm from './wasm/conformal-blocks.wasm';

/**
 * Creates a go worker with the given response handlers.
 */
function createWorker(addData) {
  const worker = new Worker('GoWorker.js');
  worker.onmessage = event => {
    const responseMethod = event.data.responseMethod;
    const responseArgs = event.data.responseArgs;
    if (responseMethod === 'addData') {
      addData(responseArgs);
    }
  }

  fetch(wasm).then(response => {
    return response.arrayBuffer();
  }).then(bytes => {
    return global.WebAssembly.compile(bytes);
  }).then(wasmModule => {
    worker.postMessage({
      queryMethod: 'loadModule',
      queryArgs: { wasmModule }
    });
  });

  return worker;
}

export default createWorker;