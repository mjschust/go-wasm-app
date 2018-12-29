import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import wasm from './wasm/conformal-blocks.wasm';

const worker = new Worker('GoWorker.js');
fetch(wasm).then(response => {
  return response.arrayBuffer();
}).then(bytes => {
  return global.WebAssembly.compile(bytes);
}).then(wasmModule => {
  ReactDOM.render(
    <App wasmModule={wasmModule} worker={worker} />,
    document.getElementById('root')
  );
});
