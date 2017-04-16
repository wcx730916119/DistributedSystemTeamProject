/* Runner for the client of the application */

package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/wcx730916119/DistributedSystemTeamProject/paxos/client"
)

var (
	hostPort = flag.String("hostPort", "localhost:8080", "port client will attemp to connect to")
)

type cmdInfo struct {
	cmdline  string
	funcname string
	nargs    int
}

func init() {
	log.SetFlags(log.Lshortfile | log.Lmicroseconds)
	flag.Usage = func() {
		fmt.Fprintln(os.Stderr, "The crunner program takes in the following commands:")
		fmt.Fprintln(os.Stderr, "addedit, getedit")
	}
}

func main() {
	flag.Parse()

	cli, err := client.NewClient(*hostPort)
	if err != nil {
		log.Fatalln("Client not created:", err)
	}

	fmt.Println("Client created successfully.")

	cmdlist := []cmdInfo{
		{"addedit", "Server.AddEdit", 1},
		{"getedit", "Server.GetEdit", 1},
	}

	cmd := flag.Arg(0)
	cmdmap := make(map[string]cmdInfo)
	for _, j := range cmdlist {
		cmdmap[j.cmdline] = j
	}

	ci, found := cmdmap[cmd]
	if !found {
		flag.Usage()
		cli.Close()
		os.Exit(1)
	}
	if flag.NArg() < (ci.nargs) {
		flag.Usage()
		cli.Close()
		os.Exit(1)
	}

	switch cmd {
	case "addedit":
		_, err := cli.AddEdit(flag.Arg(1))
		if err != nil {
			fmt.Println(err)
		} else {
			fmt.Println("Added edit.")
		}
	case "getedit":
		edit, err := cli.GetEdit(flag.Arg(1))
		fmt.Println(edit)
	}

	err = cli.Close()
	if err != nil {
		log.Fatalln("Client closed incorrectly:", err)
	}

	fmt.Println("Client exited successfully.")
}