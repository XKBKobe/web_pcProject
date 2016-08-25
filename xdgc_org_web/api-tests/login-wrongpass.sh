#!/bin/bash
. setenv.inc

curl -X post $BASE/user/login -c cookie.txt \
  -d 'account=18658862110&password=wrongpass'

echo

