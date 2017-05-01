package main

import (
	"flag"
	"fmt"
	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/rpc/paxosrpc"
	"net/http"
	"net/rpc"
	"strconv"
	"log"
	"math/rand"
)

var (
	test_rajkiran = true
	singleHub     *Hub
	key = "asdfasdf"
	rpc_client    *rpc.Client
	paxosport = flag.String("paxosport", "", "port of the specified paxos node")
	localport = flag.String("port", "8080", "port to run the local server")
)

func addEdit(session string, value string) error {
	fmt.Println(fmt.Sprint("Proposing the message ", value))
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
	http.ServeFile(w, r, "./paxos/runner/application/home.html")
}

type Update struct {
	Key, Diff string
}

func defaultHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	fmt.Println(path)

	if path == "/testedit" {
		fmt.Println("I am here")
		nonce := strconv.FormatInt(int64(rand.Intn(1000000)), 10)
		addEdit(key, nonce)
		fmt.Fprint(w, nonce)
	} else if path == "/getedit" {
		edit := getEdit(key)
		fmt.Fprint(w, edit)
	} else if path == "/update" {
		switch r.Method {
		case "POST":
			// Call ParseForm() to parse the raw query and update r.PostForm and r.Form.
			if err := r.ParseForm(); err != nil {
				fmt.Fprintf(w, "Hello, POT method. ParseForm() err: %v", err)
				return
			}

			// Post form from website
			fmt.Println(r.FormValue("key"))
			fmt.Println(r.FormValue("diff"))
		default:
			fmt.Fprint(w, "Sorry, only GET and POST methods are supported.")
		}
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

	fmt.Println("Server started. Paxos port=" + *paxosport)

	fmt.Println("Listen on port: " + *localport)

	if test_rajkiran == true {
		go singleHub.run()
		http.HandleFunc("/", serveHome)
		http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
			serveWs(singleHub, w, r)
		})
		http.HandleFunc("/update", updateEdits)
	} else {
		http.HandleFunc("/", defaultHandler)
	}
	error := http.ListenAndServe(":"+*localport, nil)
	if error != nil {
		log.Fatal("ListenAndServe: ", error)
	}
}
