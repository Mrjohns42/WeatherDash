#!/bin/bash -xe

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

echo "WEATHERDASH STARTUP"

cd ${SERVER_DIR}
echo "Starting API Server in background.."
x-terminal-emulator -t "WeatherDash Server" -e bash -c "npm start 2>&1 | tee ${SCRIPT_DIR}/server.log"

cd ${CLIENT_DIR}
echo "Building Client Application..."
ng build --prod --aot --build-optimizer --output-hashing=none
echo "Build Complete."

cd ${CLIENT_DIR}/dist/WeatherClient
echo "Starting Client Host in background..."
x-terminal-emulator -t "WeatherDash Client" -e bash -c "angular-http-server -p ${CLIENT_PORT} 2>&1 | tee ${SCRIPT_DIR}/client.log" 

echo "Waiting for API Server to come online..."
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
x-terminal-emulator -t "WeatherDash Console" -e bash -c "chromium-browser --start-fullscreen --enable-logging=stderr -rv=1 ${CLIENT_ADDR} 2>&1 | tee ${SCRIPT_DIR}/browser.log"

echo "DONE"
