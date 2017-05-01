./build/paxos -ports 8000,9000 -N 2 -id 0 -client 8080 &
./build/paxos -ports 8000,9000 -N 2 -id 1 -client 9080 &
./build/app -paxosport 8000 -port 8080 &
./build/app -paxosport 9000 -port 9080 &



