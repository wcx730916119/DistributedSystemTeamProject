package client

import (
	"errors"
	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/rpc/serverrpc"
	"net/rpc"
	"time"
)

type client struct {
	client *rpc.Client
	err    error
}

func NewClient(hostPort string) (Client, error) {
	c := make(chan client, 1)
	go func() {
		cli, err := rpc.DialHTTP("tcp", hostPort)
		c <- client{
			client: cli,
			err:    err,
		}
	}()

	select {
	case newCli := <-c:
		if newCli.err != nil {
			return nil, newCli.err
		}
		return &newCli, nil
	case <-time.After(time.Second):
		return nil, errors.New("time out")
	}
}

func (cli *client) AddEdit(diff string) (string, error) {
	args := &serverrpc.AddEditArgs{Session: "asdf", Diff: diff}
	reply := &serverrpc.AddEditReply{}
	if err := cli.client.Call("Server.AddEdit", args, reply); err != nil {
		return "error", err
	}
	return reply.Response, nil
}

func (cli *client) GetEdit(diff string) (string, error) {
	args := &serverrpc.GetEditArgs{Session: "asdf"}
	reply := &serverrpc.GetEditReply{}
	if err := cli.client.Call("Server.GetEdit", args, reply); err != nil {
		return "error", err
	}
	return reply.Diff, nil
}

func (cli *client) Close() error {
	return cli.client.Close()
}