#!/usr/bin/env bash
ps | grep paxos | awk '{print "kill -9 "$1}'
ps | grep app | awk '{print "kill -9 "$1}'

