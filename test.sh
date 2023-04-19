#!/bin/bash

function cleanup {
  echo "Cleaning up..."
  # any necessary cleanup code goes here...
  local pids pid
  pids=($(cat ./tmp/browser_pid.txt))

  # Loop through the array and kill each PID
  echo "Killing PIDs ${pids[@]}" >&2
  for pid in "${pids[@]}"
  do
    kill $pid >/dev/null 2>&1
  done
  echo "" > ./tmp/browser_pid.txt
  exit 1
}

trap cleanup SIGINT
npx jest --silent=false
