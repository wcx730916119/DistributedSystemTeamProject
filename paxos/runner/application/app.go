package main

import (
	"net/http"
	"net/rpc"
	"net/url"
	"html/template"
	"fmt"
	"strconv"
	"flag"
	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/rpc/paxosrpc"
)

var (
	cli       *rpc.client
	paxosport = flag.String("paxosport", "", "port of the specified paxos node")
	localport = flag.String("port", "8080", "port to run the local server") 
)

func (srv *server) AddEdit(args *serverrpc.AddEditArgs, reply *serverrpc.AddEditReply) error {
	proposalNumberArgs := &paxosrpc.ProposalNumberArgs{Key: args.Session}
	proposalNumberReply := new(paxosrpc.ProposalNumberReply)
	if err := client.Call("PaxosNode.GetNextProposalNumber", args, reply); err != nil {
		reply.Response = "failure"
		return err
	}

	proposalArgs := &paxosrpc.ProposeArgs{N: proposalNumberReply.N, Key: args.Session, V: args.Diff}
	proposalReply := new(paxosrpc.ProposeReply)
	if err := client.Call("PaxosNode.Propose", proposeArgs, proposeReply); err != nil {
		reply.Response = "failure"
		return err
	}

	return nil
}

func (srv *server) GetEdit(args *serverrpc.GetEditArgs, reply *serverrpc.GetEditReply) error {
	var ok bool

	valueArgs := &paxosrpc.GetValueArgs{Key: args.Session}
	valueReply := new(paxosrpc.GetValueReply)
	client.Call("PaxosNode.GetValue", args, reply)
	pack := new(serverrpc.GetEditReply)
	if *pack, ok = valueReply.V.(serverrpc.GetEditReply); ok {
		*reply = *pack
		return nil
	} else {
		return errors.New("no edits")
	}

	return nil
}

func defaultHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	query := r.URL.RawQuery
	//handle html and routes
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