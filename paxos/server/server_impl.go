package server

import (
	"errors"
	"paxos/paxos"
	"paxos/rpc/paxosrpc"
	"paxos/rpc/serverrpc"
	"net/rpc"
	"sync"
	"time"
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
	var ok bool

	proposalNumberArgs = &paxosrpc.ProposalNumberArgs{Key: args.Session}
	var proposalNumberReply paxosrpc.ProposalNumberArgs
	if err := srv.paxosInstance.GetNextProposalNumber(paxArg, paxReply); err != nil {
		reply.Response = "failure"
		return err
	}

	proposalArgs = &paxosrpc.ProposeArgs{N: proposalNumberReply, Key: args.Session, V: args.Diff}
	var proposalReply paxosrpc.ProposeReply
	if err := srv.paxosInstance.Propose(proposalArgs, proposalReply); err != nil {
		reply.Response = "failure"
		return err
	}

	return nil
}

func (srv *server) GetEdit(args *serverrpc.GetEditArgs, reply *serverrpc.GetEditReply) error {
	var ok bool

	proposalNumberArgs = &paxosrpc.GetValueArgs{Key: args.Session}
	var proposalNumberReply paxosrpc.GetValueReply
	srv.paxosInstance.GetValue(paxArg, paxReply)
	var pack serverrpc.GetEditReply
	if *pack, ok = paxReply.V.(serverrpc.GetEditReply); ok {
		*reply = *pack
		return nil
	} else {
		return errors.New("no edits")
	}

	return nil
}

//TODO: notify edits callback