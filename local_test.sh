#!/usr/bin/env bash
#./build/paxos -ips 172.29.93.13:8000,172.29.93.131:8000,172.29.94.254:8000 -N 3 -id 1 -client 8080 &
#./build/app -paxosport 8000 -port 8080 &

#./build/paxos -ips 172.29.93.13:8000,172.29.93.131:8000 -N 2 -id 1 -client 8080 &
#./build/app -paxosport 172.29.93.131:8000 -port 8080 &

./build/paxos -ips 192.168.0.110:8000,192.168.0.120:8000 -N 2 -id 0 -client 8080 &
./build/app -paxosport 192.168.0.110:8000 -port 8080 &


