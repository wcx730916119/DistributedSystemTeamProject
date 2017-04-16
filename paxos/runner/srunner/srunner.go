package main

import (
	"flag"
	"log"
	"strings"

	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/server"
)

var (
	peers  = flag.String("ports", "localhost:8080", "ports for all paxos nodes")
	nodeID = flag.Int("id", 0, "node ID must match index of this node's port in the ports list")
)

func init() {
	log.SetFlags(log.Lshortfile | log.Lmicroseconds)
}

func main() {
	flag.Parse()

	peersList := strings.Split(*peers, ",")
	peersMap := make(map[int]string)
	for i := 0; i < len(peersList); i++ {
		peersMap[0] = peersList[0]
	}

	if *nodeID < 0 || *nodeID >= len(peersList) {
		log.Fatalln("nodeID is invalid")
	}

	// Start new server
	_, err := server.NewServer(peersMap, *nodeID)
	if err != nil {
		log.Fatalln("Server failed to start:", err)
	}

	// Run forever
	select {}
}
