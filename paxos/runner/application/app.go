package main

import (
	"net/http"
	"net/rpc"
	"fmt"
	"strconv"
	"flag"
	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/rpc/paxosrpc"

	"math/rand"
)

var (
	client      *rpc.Client
	paxosport = flag.String("paxosport", "", "port of the specified paxos node")
	localport = flag.String("port", "8080", "port to run the local server") 
)

func addEdit(session string, value string) error {
	proposalNumberArgs := &paxosrpc.ProposalNumberArgs{Key: session}
	proposalNumberReply := new(paxosrpc.ProposalNumberReply)
	if err := client.Call("PaxosNode.GetNextProposalNumber", proposalNumberArgs, proposalNumberReply); err != nil {
		return err
	}

	proposalArgs := &paxosrpc.ProposeArgs{N: proposalNumberReply.N, Key: session, V: value}
	proposalReply := new(paxosrpc.ProposeReply)
	if err := client.Call("PaxosNode.Propose", proposalArgs, proposalReply); err != nil {
		return err
	}

	return nil
}

func getEdit(session string) string {
	valueArgs := &paxosrpc.GetValueArgs{Key: session}
	valueReply := new(paxosrpc.GetValueReply)
	client.Call("PaxosNode.GetValue", valueArgs, valueReply)

	return valueReply.V.(string)
}

func defaultHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	//query := r.URL.RawQuery
	if (path == "/testedit") {
		nonce := strconv.FormatInt(int64(rand.Intn(1000000)),10)
		addEdit("asdfasdf", nonce)
		fmt.Fprint(w, nonce);
	} else if (path == "/getedit") {
		edit := getEdit("asdfasdf")
		fmt.Fprint(w, edit);
	}

}

func main() {
	flag.Parse()

	var err error
	for {
		client, err = rpc.DialHTTP("tcp", "localhost:"+*paxosport)
		if err == nil {
			break
		}
	}

	fmt.Println("Server started. Paxos port="+*paxosport)

	fmt.Println("Listen on port: " + *localport)
	http.HandleFunc("/", defaultHandler)
	http.ListenAndServe(":"+*localport, nil)
}