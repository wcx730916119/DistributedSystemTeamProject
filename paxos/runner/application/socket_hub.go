package main

import "strconv"

//import "strconv"
import (
	"math/rand"
	"fmt"
	"net/http"
	"encoding/json"
)

// hub maintains the set of active clients and broadcasts messages to the
// clients.

/*
var (

	last_message = ""
)
*/

type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

/*
func checkForChanges() string {
	new_message := getEdit(key)
	//fmt.Println(fmt.Sprint("getEdit output message", new_message));
	if (new_message != last_message){
		fmt.Println(fmt.Sprint("updating the last message from ", last_message, " to ", new_message));
		last_message = new_message
		return new_message
	} else {
		return ""
	}

}
*/

func (h *Hub) funcWithChanResult() {
	// TODO: need to fix this, getting segv when doing the first getEdit
	nonce := strconv.FormatInt(int64(rand.Intn(1000000)),10)
	addEdit(key,nonce)
	/*go func() {
		for {
			value := checkForChanges()
			if( value != "") {
				h.broadcast <- []byte(value)
			}
		}
	}()*/

}

func updateEdits( w http.ResponseWriter, r *http.Request){
	var update Update;
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&update)
	if err != nil {
		panic(err)
	}
	defer r.Body.Close()
	fmt.Fprintln(w, update.Key)
	fmt.Fprintln(w, update.Diff)
	if( key == update.Key ){
		fmt.Println("")
		singleHub.broadcast <- []byte(update.Diff)
	}
}

func (h *Hub) run() {
	if (test_rajkiran) {
		h.funcWithChanResult()
	}
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}

		}
	}
}

