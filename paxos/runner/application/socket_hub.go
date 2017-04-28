package main

import "strconv"

//import "strconv"
import (
	"math/rand"
	"fmt"
)

// hub maintains the set of active clients and broadcasts messages to the
// clients.

var (
	last_message = ""
)

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

func (h *Hub) funcWithChanResult() {
	// TODO: need to fix this, getting segv when doing the first getEdit
	nonce := strconv.FormatInt(int64(rand.Intn(1000000)),10)
	addEdit(key,nonce)
	go func() {
		for {
			value := checkForChanges()
			if( value != "") {
				h.broadcast <- []byte(value)
			}
		}
	}()

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

