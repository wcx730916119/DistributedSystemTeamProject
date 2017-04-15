package server

import (
	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/rpc/serverrpc"
)

//AddEdit sends a Propose of a diff to other Paxos nodes
//GetEdit gets the latest Commit from Paxos
type Server interface {
	AddEdit(args *serverrpc.AddEditArgs, reply *serverrpc.AddEditReply) error
	GetEdit(args *serverrpc.GetEditArgs, reply *serverrpc.GetEditReply) error
}
