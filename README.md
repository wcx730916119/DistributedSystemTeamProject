18842 Distributed Systems Team Project (Group 4)

## Building the Paxos server from source
Docker environment inspired by [https://github.com/brocaar/loraserver](https://github.com/brocaar/loraserver).

The easiest way to get started is by using the provided 
[docker-compose](https://docs.docker.com/compose/) environment. To start a bash
shell within the docker-compose environment, execute the following command from
the root of this project:

```bash
docker-compose run --rm paxos bash
```

A few example commands that you can run:

# compile
make build

# cross-compile for Linux ARM
GOOS=linux GOARCH=arm make build

# cross-compile for Windows AMD64
GOOS=windows BINEXT=.exe GOARCH=amd64 make build