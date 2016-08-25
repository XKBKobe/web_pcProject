#!/bin/bash
. ./common.inc.sh
curl "$@" -X POST $SERVER/user/login \
  -d account=18658862110 \
  -d password=$(xdgcEncodePassword 000000)
