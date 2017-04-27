.PHONY: build clean test package serve update-vendor api statics
PKGS := $(shell go list ./... | grep -v /paxos/)
GOOS ?= darwin
GOARCH ?= amd64

build: statics
	@echo "Compiling source for $(GOOS) $(GOARCH)"
	@mkdir -p build
	@GOOS=$(GOOS) GOARCH=$(GOARCH) go build -o build/server$(BINEXT) paxos/runner/{socket_client.go,socket_hub.go,srunner.go}

clean:
	@echo "Cleaning up workspace"
	@rm -rf build