package main

import (
    "fmt"
    "log"
    "net"
    "io/ioutil"
    "encoding/json"
    "net/rpc"
    "net/http"
)

type Listener int

func (l *Listener) GetLine(line []byte, ack *bool) error {
    fmt.Println(string(line))
    return nil 
}

func handler(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hi there, I love %s!", r.Body)
}
type test_struct struct {
        Test string
}

func parseGhPost(rw http.ResponseWriter, request *http.Request) {
    fmt.Println( "rajkiran testing" )
    decoder := json.NewDecoder(request.Body)
    var t test_struct
    err := decoder.Decode(&t)
    if err != nil {
        panic(err)
    }
    defer request.Body.Close()
    fmt.Println(t.Test)
}

func test(rw http.ResponseWriter, req *http.Request) {
    body, err := ioutil.ReadAll(req.Body)
        if err != nil {
            panic(err)
        }
    log.Println(string(body))
        var t test_struct
        err = json.Unmarshal(body, &t)
        if err != nil {
            panic(err)
        }
    log.Println(t.Test)
}

func main() {
    fmt.Println("connecting to the server")
    listener := new(Listener)
    rpc.Register(listener)
    rpc.HandleHTTP()
    l, e := net.Listen("tcp", ":1234")
    if e != nil {
        log.Fatal("listen error:", e)
    }
    http.HandleFunc("/", test)
    http.Serve(l,nil)
}

