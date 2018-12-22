BINDIR := bin
SRCDIR := cbwasm

all: $(BINDIR)/conformal-blocks.wasm
	
$(BINDIR)/conformal-blocks.wasm: $(SRCDIR)/main.go
	GOOS=js GOARCH=wasm go build -o $(BINDIR)/conformal-blocks.wasm ./$(SRCDIR)

clean:
	rm -rf bin/