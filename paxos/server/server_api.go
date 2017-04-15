package server

import (
	"paxos/rpc/paxosrpc"
)

//AddEdit sends a Propose of a diff to other Paxos nodes
//GetEdit gets the latest Commit from Paxos
type Server interface {
	AddEdit(args *AddEditArgs, reply *AddEditReply) error
	GetEdit(args *GetEditArgs, reply *GetEditReply) error
}
