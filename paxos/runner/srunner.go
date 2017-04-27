/* runner for the reservation server of the applications */

package main

import (
	"flag"
	"log"
	"strings"
	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/server"
	"net/http"
)

var (
	peers  = flag.String("ports", "localhost:8080", "ports for all paxos nodes")
	nodeID = flag.Int("id", 0, "node ID must match index of this node's port in the ports list")
)

func init() {
	log.SetFlags(log.Lshortfile | log.Lmicroseconds)
}

func serveHome(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL)
	if r.URL.Path != "/" {
		http.Error(w, "Not found", 404)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", 405)
		return
	}
	http.ServeFile(w, r, "home.html")
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
	paxos_server, err := server.NewServer(peersMap, *nodeID)
	hub := newHub()
	go hub.run()
	http.HandleFunc("/", serveHome)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, paxos_server, w, r)
	})


	if err != nil {
		log.Fatalln("Server failed to start:", err)
	}

	// Run forever
	select {}
}
