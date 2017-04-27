package main

import (
	"net/http"
	"net/rpc"
	"fmt"
	"strconv"
	"flag"
	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/rpc/paxosrpc"

	"math/rand"
	"log"
)

var (
	test_rajkiran = true
	singleHub *Hub
	key = "asdfasdf"
	rpc_client      *rpc.Client
	paxosport = flag.String("paxosport", "", "port of the specified paxos node")
	localport = flag.String("port", "8080", "port to run the local server") 
)

func addEdit(session string, value string) error {
	proposalNumberArgs := &paxosrpc.ProposalNumberArgs{Key: session}
	proposalNumberReply := new(paxosrpc.ProposalNumberReply)
	if err := rpc_client.Call("PaxosNode.GetNextProposalNumber", proposalNumberArgs, proposalNumberReply); err != nil {
		return err
	}

	proposalArgs := &paxosrpc.ProposeArgs{N: proposalNumberReply.N, Key: session, V: value}
	proposalReply := new(paxosrpc.ProposeReply)
	if err := rpc_client.Call("PaxosNode.Propose", proposalArgs, proposalReply); err != nil {
		return err
	}
	//TODO: fix this appropriately too.
	// update the last_message to one you proposed
	last_message = value

	return nil
}

func getEdit(session string) string {
	valueArgs := &paxosrpc.GetValueArgs{Key: session}
	valueReply := new(paxosrpc.GetValueReply)
	rpc_client.Call("PaxosNode.GetValue", valueArgs, valueReply)
	return valueReply.V.(string)
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
	http.ServeFile(w, r, "/Users/rajkiran/Projects/distributed/teamproject/DistributedSystemTeamProject/paxos/runner/application/home.html")
}


func defaultHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	//query := r.URL.RawQuery
	if (path == "/testedit") {
		fmt.Println("I am here")
		nonce := strconv.FormatInt(int64(rand.Intn(1000000)),10)
		addEdit(key, nonce)
		fmt.Fprint(w, nonce);
	} else if (path == "/getedit") {
		edit := getEdit(key)
		fmt.Fprint(w, edit);
	}

}

func main() {
	flag.Parse()
	singleHub = newHub()

	var err error
	for {
		rpc_client, err = rpc.DialHTTP("tcp", "localhost:"+*paxosport)
		if err == nil {
			break
		}
	}

	fmt.Println("Server started. Paxos port="+*paxosport)

	fmt.Println("Listen on port: " + *localport)
	go singleHub.run()
	if ( test_rajkiran == true ) {
		http.HandleFunc("/", serveHome)
		http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
			serveWs(singleHub, w, r)
		})
	} else {
		http.HandleFunc("/", defaultHandler)
	}
	error := http.ListenAndServe(":"+*localport, nil)
	if error != nil {
		log.Fatal("ListenAndServe: ", error)
	}
}