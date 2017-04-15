package serverrpc

type RemoteServer interface {
	AddEdit(args *AddEditArgs, reply *AddEditReply) error
	GetEdit(args *GetEditArgs, reply *GetEditReply) error
}

type Server struct {
	RemoteServer
}

func Wrap(s RemoteServer) RemoteServer {
	return &Server{s}
}
