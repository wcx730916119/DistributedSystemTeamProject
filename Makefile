.PHONY: build clean test package serve update-vendor api statics
PKGS := $(shell go list ./... | grep -v /paxos/)
GOOS ?= linux
GOARCH ?= amd64

server: statics
	@echo "Compiling server for $(GOOS) $(GOARCH)"
	@mkdir -p build
	@GOOS=$(GOOS) GOARCH=$(GOARCH) go build -o build/server$(BINEXT) paxos/runner/srunner/srunner.go

client: statics
	@echo "Compiling client for $(GOOS) $(GOARCH)"
	@mkdir -p build
	@GOOS=$(GOOS) GOARCH=$(GOARCH) go build -o build/client$(BINEXT) paxos/runner/crunner/crunner.go

clean:
	@echo "Cleaning up workspace"
	@rm -rf build