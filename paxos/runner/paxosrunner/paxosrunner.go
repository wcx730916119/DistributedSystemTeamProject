package main

import (
	"flag"
	"log"
	"strings"

	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/paxos"
)

var (
	ips = flag.String("ips", "", "ips for all paxos nodes")
	numNodes   = flag.Int("N", 1, "the number of nodes in the ring")
	nodeID     = flag.Int("id", 0, "node ID must match index of this node's port in the ports list")
	numRetries = flag.Int("retries", 5, "number of times a node should retry dialing another node")
	client = flag.String("client", "8080", "port for the client")
)

func init() {
	log.SetFlags(log.Lshortfile | log.Lmicroseconds)
}

func main() {
	flag.Parse()

	portStrings := strings.Split(*ips, ",")

	hostMap := make(map[int]string)

	for i, port := range portStrings {
		hostMap[i] = port
	}

	clientIP := "localhost:" + *client

	_, err := paxos.NewPaxosNode(hostMap[*nodeID], hostMap, *numNodes, *nodeID, *numRetries, false, clientIP)
	if err != nil {
		log.Fatalln("Failed to create paxos node:", err)
	}

	select {}
}
