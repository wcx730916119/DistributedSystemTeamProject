package server

import (
	"errors"
	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/paxos"
	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/rpc/paxosrpc"
	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/rpc/serverrpc"
	"net/rpc"
	"sync"
)

type server struct {
	mutex          sync.Mutex
	paxosInstance  paxos.PaxosNode
}

func NewServer(hostMap map[int]string, nodeID int) (Server, error) {
	var err error
	srv := &server{}

	srv.paxosInstance, err = paxos.NewPaxosNode(hostMap[nodeID], hostMap, len(hostMap), nodeID, 1, false)
	if err != nil {
		return nil, err
	}

	err = rpc.RegisterName("Server", serverrpc.Wrap(srv))

	return srv, err
}

func (srv *server) AddEdit(args *serverrpc.AddEditArgs, reply *serverrpc.AddEditReply) error {
	proposalNumberArgs := &paxosrpc.ProposalNumberArgs{Key: args.Session}
	proposalNumberReply := new(paxosrpc.ProposalNumberReply)
	if err := srv.paxosInstance.GetNextProposalNumber(proposalNumberArgs, proposalNumberReply); err != nil {
		reply.Response = "failure"
		return err
	}

	proposalArgs := &paxosrpc.ProposeArgs{N: proposalNumberReply.N, Key: args.Session, V: args.Diff}
	proposalReply := new(paxosrpc.ProposeReply)
	if err := srv.paxosInstance.Propose(proposalArgs, proposalReply); err != nil {
		reply.Response = "failure"
		return err
	}

	return nil
}

func (srv *server) GetEdit(args *serverrpc.GetEditArgs, reply *serverrpc.GetEditReply) error {
	var ok bool

	valueArgs := &paxosrpc.GetValueArgs{Key: args.Session}
	valueReply := new(paxosrpc.GetValueReply)
	srv.paxosInstance.GetValue(valueArgs, valueReply)
	pack := new(serverrpc.GetEditReply)
	if *pack, ok = valueReply.V.(serverrpc.GetEditReply); ok {
		*reply = *pack
		return nil
	} else {
		return errors.New("no edits")
	}

	return nil
}

//TODO: notify edits callback