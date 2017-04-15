package serverrpc

type Status int
type Lookup int

const (
	OK Status = iota + 1
	Reject
)

const (
	KeyFound Lookup = iota + 1
	KeyNotFound
)

type AddEditArgs struct {
	Session string
	Diff    string
}

type AddEditReply struct {
	Response string
}

type GetEditArgs struct {
	Session string
}

type GetEditReply struct {
	Diff   string
	Status Lookup
}