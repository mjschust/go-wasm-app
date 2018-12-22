import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import main from './main.wasm';

const worker = new Worker('GoWorker.js');
fetch(main).then(response => {
  return response.arrayBuffer();
}).then(bytes => {
  return global.WebAssembly.compile(bytes);
}).then(wasmModule => {
  ReactDOM.render(
    <App wasmModule={wasmModule} worker={worker} />,
    document.getElementById('root')
  );
});
   
// global.WebAssembly.instantiateStreaming(fetch(main), go.importObject).then((result) => {
//   go.run(result.instance);
  
//   ReactDOM.render(
//     <App />,
//     document.getElementById('root')
//   );
// });
