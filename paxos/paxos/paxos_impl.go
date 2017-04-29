package paxos

import (
	"errors"
	"fmt"
	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/rpc/paxosrpc"
	"net"
	"net/http"
	"net/rpc"
	"sync"
	"time"
    "encoding/json"
    "strconv"
    "bytes"
	"net/url"
)

/* Node specific information */
type paxosNode struct {
	/* Maps node IDs to hostports */
	HostMap map[string]string

	/* Maps node IDs to node connections */
	ConnectionMap map[string]*rpc.Client

	ServerID int

	NumNodes int

	/* Maps keys to Highest proposal # seen for that key */
	ProposalState map[string]state

	/* Maps committed keys to values */
	CommitStore map[string]interface{}

	ConnectNodesChannel chan bool
    
    /* Mutex to synchronize access to above maps */
	Lock                sync.Mutex

	client string
}

/* Node state for each key */
type state struct {
	N_a  int
	V_a  interface{}
	N_h  int
	My_n int
}

/* Used to communicate the result of a paxos proposal */
type proposeResult struct {
	Success bool
	Value   interface{}
}

/* Marshalled and returned in ReplaceCatchupReply */
type catchupData struct {
    /* Maps keys to Highest proposal # seen for that key */
	ProposalState map[string]state

	/* Maps committed keys to values */
	CommitStore map[string]interface{}
}
func debugPrint(a ...interface{}) {
	fmt.Println(a)
}
func (pn *paxosNode) debugPrint(a ...interface{}) {
	fmt.Println("[Node", pn.ServerID, "]", a)
}

// Creates a new Paxos node. Only returns if it can connect to all nodes in the hostMap.
// myHostPort: host port string of the node - using tcp
// hostMap: map of all node IDs to host ports
// numNodes: number of nodes in the ring
// numRetries: number of retries to connect to each node
// replace: flag for if it is a replacement node for a failed node
func NewPaxosNode(myHostPort string, hostMap map[int]string, numNodes, srvId, numRetries int, replace bool, client string) (PaxosNode, error) {
	
	node := paxosNode{HostMap: make(map[string]string), ServerID: srvId, ConnectionMap: make(map[string]*rpc.Client),
		ConnectNodesChannel: make(chan bool), ProposalState: make(map[string]state),
		NumNodes: numNodes, CommitStore: make(map[string]interface{})}
    
    for id, hostport := range hostMap {
		debugPrint(srvId, myHostPort, id, hostport)
        node.HostMap[strconv.Itoa(srvId)] = hostport
	}
    /* Register RPC */
	rpc.RegisterName("PaxosNode", paxosrpc.Wrap(&node))
	rpc.HandleHTTP()
	l, e := net.Listen("tcp", myHostPort)
	if e != nil {
		return nil, e
	}
	go http.Serve(l, nil)
    
	node.client = client

    if replace {
        node.debugPrint("replace", myHostPort)
        replaceServerChannel := make(chan bool)
        var restorePoint *catchupData
        
        /* Send replaceServer rpc to all other nodes */
        for id, hostport := range hostMap {
            client, _ := rpc.DialHTTP("tcp", hostport)
            node.ConnectionMap[strconv.Itoa(id)] = client
            if id != srvId {
                
                go func(hostport string) {
                    var rep paxosrpc.ReplaceServerReply
                    rpcArgs := &paxosrpc.ReplaceServerArgs{SrvID: srvId, Hostport: myHostPort}
                    client.Call("PaxosNode.RecvReplaceServer", rpcArgs, &rep)
                    replaceServerChannel <- true
                    
                }(hostport)
            }
        }
        
        /* Wait for all replace server RPC calls to complete. */
        for i := 0; i < numNodes - 1; i++ {
            <-replaceServerChannel
        }
        
        /* Makes sure the node that we send replacecatchup is different from this node */
        catchupID := 0
        if srvId == catchupID {
            catchupID ++
        }
        var rep paxosrpc.ReplaceCatchupReply
        rpcArgs := &paxosrpc.ReplaceCatchupArgs{}
        client := node.ConnectionMap[strconv.Itoa(catchupID)]
        client.Call("PaxosNode.RecvReplaceCatchup", rpcArgs, &rep)
        json.Unmarshal(rep.Data, &restorePoint)
        node.debugPrint(rep.Data, restorePoint)

        for K, V := range restorePoint.ProposalState {
            node.ProposalState[K] = V
        }
        for K, V := range restorePoint.CommitStore {
            node.CommitStore[K] = V
        }
    
    } else {
        /* Attempt a connection from this node to all nodes */
        for id, hostport := range hostMap {
            //debugPrint(srvId, id, hostport)
            go node.Connect(id, hostport, numRetries)
        }
        
        /* Wait for completed node connections */
        completedNodes := 0
        for completedNodes < numNodes {
            completion := <-node.ConnectNodesChannel
            if !completion {
                return nil, errors.New("Connection failed with a node")
            }
            completedNodes++
        }
    }
	fmt.Println("Created node ", srvId)
	return &node, nil
}


/* Attempts a connection from the calling node to a target node.
   Will send the success status to ConnectNodesChannel */
func (pn *paxosNode) Connect(srvID int, hostport string, numRetries int) {

	client, e := rpc.DialHTTP("tcp", hostport)
    
    /* Sleeps for a second in between each connection attempt */
	for numRetries > 0 && e != nil {
		numRetries--
		time.Sleep(time.Second)
		client, e = rpc.DialHTTP("tcp", hostport)
	}
	if e == nil {
		pn.Lock.Lock()
		pn.ConnectionMap[strconv.Itoa(srvID)] = client
		pn.Lock.Unlock()
		debugPrint(pn.ServerID, "successfully connected to", srvID, hostport)
        
		pn.ConnectNodesChannel <- true
	} else {
		pn.ConnectNodesChannel <- false
	}
}

func (pn *paxosNode) GetNextProposalNumber(args *paxosrpc.ProposalNumberArgs, reply *paxosrpc.ProposalNumberReply) error {
	pn.Lock.Lock()
	defer pn.Lock.Unlock()

	data, ok := pn.ProposalState[args.Key]
    
    /* Each N generated by this method for node with srvID x will satisfy
     * N % pn.NumNodes == x */
	if ok {
		data.My_n = (data.N_h/pn.NumNodes+1)*pn.NumNodes + pn.ServerID
	} else {
		data = state{N_a: 0, N_h: 0, My_n: pn.NumNodes + pn.ServerID}
	}
	pn.ProposalState[args.Key] = data
	*reply = paxosrpc.ProposalNumberReply{N: data.My_n}
	pn.debugPrint("Next proposal", data.My_n)
	return nil
}

func (pn *paxosNode) Propose(args *paxosrpc.ProposeArgs, reply *paxosrpc.ProposeReply) error {
	timeout := time.After(15 * time.Second)
	returnChan := make(chan proposeResult)
    pn.debugPrint("Proposing")
	go pn.DoPropose(args, returnChan)
	for {
		select {
		case result := <-returnChan:

			if !result.Success {
                /* Not sure what to do if we fail to get majority. Just wait
                 * and try again for now */
				time.Sleep(3 * time.Second)
				go pn.DoPropose(args, returnChan)
			} else {
				commitChannel := make(chan bool)
                
                /* Send commit RPC call to all nodes. */
				for srv, client := range pn.ConnectionMap {
					pn.debugPrint("Prepare commit", srv, client)
					go func(args *paxosrpc.ProposeArgs, client *rpc.Client, commitChannel chan bool) {
						var rep paxosrpc.CommitReply
						rpcArgs := &paxosrpc.CommitArgs{Key: args.Key, V: result.Value}
						client.Call("PaxosNode.RecvCommit", rpcArgs, &rep)
						commitChannel <- true
					}(args, client, commitChannel)
				}
                
                /* Wait for all commit RPC calls to complete. */
				for i := 0; i < pn.NumNodes; i++ {
					<-commitChannel
				}

				pn.Lock.Lock()
				pn.CommitStore[args.Key] = result.Value
				pn.Lock.Unlock()

				*reply = paxosrpc.ProposeReply{V: result.Value}
				return nil
			}
		case <-timeout:
			return errors.New("Propose Timed Out")
		}
	}
}

func (pn *paxosNode) DoPropose(args *paxosrpc.ProposeArgs, channel chan proposeResult) {
	majority := pn.NumNodes/2 + 1
	N_a := 0
	var V_a interface{}
	prepareChan := make(chan paxosrpc.PrepareReply)
	numOK := 0
	numFail := 0
	for _, client := range pn.ConnectionMap {

		go func(prepareChan chan paxosrpc.PrepareReply, args *paxosrpc.ProposeArgs, client *rpc.Client) {
			var reply paxosrpc.PrepareReply
			rpcArgs := &paxosrpc.PrepareArgs{Key: args.Key, N: args.N}
            pn.debugPrint("Send prepare", args.Key, args.N)
			client.Call("PaxosNode.RecvPrepare", rpcArgs, &reply)
			prepareChan <- reply
		}(prepareChan, args, client)
	}
    
    /* Wait for RPC calls to complete until we reach a majority and know that
     * we have failed to obtain a majoirty */
	for numOK < majority && numFail < pn.NumNodes-majority+1 {
		select {
		case reply := <-prepareChan:

			if reply.Status == paxosrpc.OK {
				numOK++

				if N_a < reply.N_a {
					N_a = reply.N_a
					V_a = reply.V_a
				}
			} else {
				numFail++
			}
		}
	}

	if numOK < majority {
		channel <- proposeResult{Success: false}
		return
	}
	if V_a == nil {
		V_a = args.V
	}
	numOK = 0
	numFail = 0
	acceptChan := make(chan paxosrpc.AcceptReply)
	for _, client := range pn.ConnectionMap {

		go func(acceptChan chan paxosrpc.AcceptReply, args *paxosrpc.ProposeArgs, client *rpc.Client) {
			var reply paxosrpc.AcceptReply
            pn.debugPrint("Send Accept", args.Key, args.N)
			rpcArgs := &paxosrpc.AcceptArgs{Key: args.Key, N: args.N, V: V_a}
			client.Call("PaxosNode.RecvAccept", rpcArgs, &reply)
			acceptChan <- reply
		}(acceptChan, args, client)
	}

	for numOK < majority && numFail < pn.NumNodes-majority+1 {
		select {
		case reply := <-acceptChan:
			if reply.Status == paxosrpc.OK {
				numOK++
			} else {
				numFail++
			}
		}
	}
	pn.debugPrint("Conclude accept", numOK)
	if numOK < majority {
		channel <- proposeResult{Success: false}
	} else {
		channel <- proposeResult{Success: true, Value: V_a}
	}
}

func (pn *paxosNode) GetValue(args *paxosrpc.GetValueArgs, reply *paxosrpc.GetValueReply) error {
	pn.Lock.Lock()
	defer pn.Lock.Unlock()

	pn.debugPrint("Received GetValue", args.Key)

	value, ok := pn.CommitStore[args.Key]
	if !ok {
		*reply = paxosrpc.GetValueReply{Status: paxosrpc.KeyNotFound}
	} else {
		*reply = paxosrpc.GetValueReply{Status: paxosrpc.KeyFound, V: value}
	}
	return nil
}

func (pn *paxosNode) RecvPrepare(args *paxosrpc.PrepareArgs, reply *paxosrpc.PrepareReply) error {
	pn.Lock.Lock()
	defer pn.Lock.Unlock()
	
	data, ok := pn.ProposalState[args.Key]
	if !ok {
		data = state{N_a: 0, N_h: 0, My_n: 0}
		pn.ProposalState[args.Key] = data
	}
	if args.N < data.N_h {
		*reply = paxosrpc.PrepareReply{Status: paxosrpc.Reject}
        pn.debugPrint("Received Prepare", args.Key, args.N, "REJECT", data.N_h)
	} else {
		data.N_h = args.N
		*reply = paxosrpc.PrepareReply{Status: paxosrpc.OK, N_a: data.N_a, V_a: data.V_a}
		pn.ProposalState[args.Key] = data
        pn.debugPrint("Received Prepare", args.Key, args.N, "ACCEPT")
	}
	return nil

}

func (pn *paxosNode) RecvAccept(args *paxosrpc.AcceptArgs, reply *paxosrpc.AcceptReply) error {
	pn.Lock.Lock()
	defer pn.Lock.Unlock()
	pn.debugPrint("Received Accept", args.N, args.Key)
	data, ok := pn.ProposalState[args.Key]
	if !ok {
		data = state{N_a: 0, N_h: 0, My_n: 0}
		pn.ProposalState[args.Key] = data
	}
	if args.N < data.N_h {
		*reply = paxosrpc.AcceptReply{Status: paxosrpc.Reject}
        pn.debugPrint("Received Prepare", args.Key, args.N, "REJECT", data.N_h)
	} else {
		data = state{N_a: args.N, N_h: args.N, My_n: data.My_n, V_a: args.V}
		*reply = paxosrpc.AcceptReply{Status: paxosrpc.OK}
		pn.ProposalState[args.Key] = data
        pn.debugPrint("Received Prepare", args.Key, args.N, "ACCEPT")
	}
	return nil
}

func (pn *paxosNode) RecvCommit(args *paxosrpc.CommitArgs, reply *paxosrpc.CommitReply) error {
	pn.Lock.Lock()
	defer pn.Lock.Unlock()
	pn.debugPrint("Received Commit", args.Key, args.V)
	pn.CommitStore[args.Key] = args.V
	data, ok := pn.ProposalState[args.Key]
	if !ok {
		pn.debugPrint("Commit failed")
		pn.ProposalState[args.Key] = state{N_a: 0, N_h: 0, My_n: 0}
	} else {
        /* Clean up N_a and V_a in case we get another proposal for the same key */
		pn.debugPrint("Commit succeeded")
		data.N_a = 0
		data.V_a = nil
		pn.ProposalState[args.Key] = data

		values := map[string]string{"key": args.Key, "diff": args.V.(string)}
		jsonValue, _ := json.Marshal(values)
        	//fmt.Println( fmt.Sprint("making a post  message", args.V.(string)))
        	//fmt.Println( fmt.Sprint(pn.client,"/update"))
		pn.postDiffToClient(args)
		//http.Post(pn.client + "/update", "application/json", bytes.NewBuffer(jsonValue))
	}
	return nil
}

func (pn *paxosNode) postDiffToClient( args *paxosrpc.CommitArgs ){
	fmt.Println("I am trying to post something")
	apiUrl := pn.client
	resource := "/update"
	data := url.Values{}
	data.Set("key", args.Key)
	data.Add("diff", args.V.(string))
	u, _ := url.ParseRequestURI(apiUrl)
	u.Path = resource
	urlStr := fmt.Sprintf("%v", u) // "https://api.com/user/"
	client := &http.Client{}
	r, _ := http.NewRequest("POST", urlStr, bytes.NewBufferString(data.Encode())) // <-- URL-encoded payload
	r.Header.Add("Authorization", "auth_token=\"XXXXXXX\"")
	r.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	r.Header.Add("Content-Length", strconv.Itoa(len(data.Encode())))
	resp, _ := client.Do(r)
	fmt.Println(resp.Status)
}

func (pn *paxosNode) RecvReplaceServer(args *paxosrpc.ReplaceServerArgs, reply *paxosrpc.ReplaceServerReply) error {
	pn.debugPrint("Replace Server", args.SrvID)
    client, e := rpc.DialHTTP("tcp", args.Hostport)
    if e != nil {
        return e
    }
    pn.Lock.Lock()
    pn.ConnectionMap[strconv.Itoa(args.SrvID)] = client
    pn.HostMap[strconv.Itoa(args.SrvID)] = args.Hostport
    pn.Lock.Unlock()
	return nil
}

func (pn *paxosNode) RecvReplaceCatchup(args *paxosrpc.ReplaceCatchupArgs, reply *paxosrpc.ReplaceCatchupReply) error {
    pn.debugPrint("Replace catchup")
    pn.debugPrint(pn.HostMap, pn.ConnectionMap, pn.ProposalState, pn.CommitStore)

    cd := catchupData{CommitStore: pn.CommitStore, ProposalState: pn.ProposalState}
    bytes, e := json.Marshal(cd)
    pn.debugPrint(bytes, e)
    *reply = paxosrpc.ReplaceCatchupReply{Data: bytes }
	return nil
}
