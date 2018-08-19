#!/bin/bash 

SCRIPT_PATH=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")

SERVER_DIR=${SCRIPT_DIR}/server
SERVER_HOST=localhost
SERVER_PORT=8000
SERVER_ADDR=http://${SERVER_HOST}:${SERVER_PORT}

CLIENT_DIR=${SCRIPT_DIR}/client
CLIENT_HOST=localhost
CLIENT_PORT=4200
CLIENT_ADDR=http://${CLIENT_HOST}:${CLIENT_PORT}


cd ${SERVER_DIR}
echo "Starting API Server in background.."
x-terminal-emulator -e npm start

cd ${CLIENT_DIR}
echo "Building Client Application..."
ng build --prod --aot --build-optimizer --output-hashing=none
echo "Build Complete."

cd ${CLIENT_DIR}/dist/WeatherClient
echo "Starting Client Host in background..."
x-terminal-emulator -e angular-http-server -p ${CLIENT_PORT}

echo "Waitng for API Server to come online..."
while ! nc -z ${SERVER_HOST} ${SERVER_PORT}
do
	sleep 1
done
echo "API Server online."

echo "Waiting for Client Host to come online..."
while ! nc -z ${CLIENT_HOST} ${CLIENT_PORT}
do
	sleep 1
done
echo "Client Host online."

cd ${SCRIPT_DIR}
echo "Launching WeatherDash"
x-terminal-emulator -e chromium-browser --start-fullscreen ${CLIENT_ADDR}

