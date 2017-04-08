package paxosrpc

type RemotePaxosNode interface {
	//Called by the servers
	Propose(args *ProposeArgs, reply *ProposeReply) error
	GetValue(args *GetValueArgs, reply *GetValueReply) error
	GetNextProposalNumber(args *ProposalNumberArgs, reply *ProposalNumberReply) error

	//Called by other Paxos nodes
	RecvPrepare(args *PrepareArgs, reply *PrepareReply) error
	RecvAccept(args *AcceptArgs, reply *AcceptReply) error
	RecvCommit(args *CommitArgs, reply *CommitReply) error

	//Notifies Nodes of a replacement server
	RecvReplaceServer(args *ReplaceServerArgs, reply *ReplaceServerReply) error
	//Request the value for a particular round
	RecvReplaceCatchup(args *ReplaceCatchupArgs, reply *ReplaceCatchupReply) error
}

type PaxosNode struct {
	RemotePaxosNode
}

func Wrap(t RemotePaxosNode) RemotePaxosNode {
	return &PaxosNode{t}
}