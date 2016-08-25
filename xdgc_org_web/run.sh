#!/bin/bash

# fix issue of mongo cannot be started with exit code 1.
export LC_ALL=en_US.UTF-8

PID_FILE=meteor.pid

if [ -f $PID_FILE ]; then
  PID=`cat meteor.pid`

  if [ -d /proc/$PID ]; then
    echo "Old process found, and kill it now."
    kill -9 $PID
  fi

  rm -f $PID_FILE
  echo "done"

  [ x"$1" == x"stop" ] && exit 0
fi

nohup meteor run --settings settings.json --port 8000 >stdout 2>stderr &
PID=$!
echo $PID >$PID_FILE
echo "PID: `cat $PID_FILE`"
echo "LOG: tail -f stdout"
