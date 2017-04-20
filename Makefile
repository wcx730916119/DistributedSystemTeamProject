.PHONY: build clean test package serve update-vendor api statics
PKGS := $(shell go list ./... | grep -v /paxos/)
GOOS ?= linux
GOARCH ?= amd64

app: statics
	@echo "Compiling server for $(GOOS) $(GOARCH)"
	@mkdir -p build
	@GOOS=$(GOOS) GOARCH=$(GOARCH) go build -o build/app$(BINEXT) paxos/runner/application/srunner.go

paxos: statics
	@echo "Compiling client for $(GOOS) $(GOARCH)"
	@mkdir -p build
	@GOOS=$(GOOS) GOARCH=$(GOARCH) go build -o build/paxos$(BINEXT) paxos/runner/paxosrunner/paxosrunner.go

clean:
	@echo "Cleaning up workspace"
	@rm -rf build