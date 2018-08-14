#!/bin/bash 
SCRIPT_PATH=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")

SERVER_DIR=${SCRIPT_DIR}/server
SERVER_ADDR=http://localhost:8000

CLIENT_DIR=${SCRIPT_DIR}/client
CLIENT_ADDR=http://localhost:4200

cd ${SERVER_DIR}
x-terminal-emulator -e npm start
ping ${SERVER_ADDR} -a

cd ${CLIENT_DIR}
x-terminal-emulator -e ng serve
ping ${CLIENT_ADDR} -a

cd ${SCRIPT_DIR}
x-terminal-emulator -e chromium-browser --kiosk ${CLIENT_ADDR}