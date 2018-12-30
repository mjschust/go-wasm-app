install: buildWasm
	mkdir -p src/wasm && cp go_src/bin/* src/wasm

buildWasm:
	$(MAKE) -C go_src all

clean:
	$(MAKE) -C go_src clean; rm -rf src/wasm