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
echo "Cleaning up Chromium"
#Delete SingletonLock
rm -f ~/.config/chromium/SingletonLock
rm -rf ~/.cache/chromium
#Clean up the randomly-named file(s)
for i in ~/.config/chromium/Default/.org.chromium.Chromium.*; do
    sed -i 's/"exited_cleanly": false/"exited_cleanly": true/' $i
    sed -i 's/"exit_state": "Crashed"/"exit_state": "Normal"/' $i
    sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' $i
done
#Clean up Preferences
sed -i 's/"exited_cleanly": false/"exited_cleanly": true/' ~/.config/chromium/Default/Preferences
sed -i 's/"exit_state": "Crashed"/"exit_state": "Normal"/' ~/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences
#Clean up Local State
sed -i 's/"exited_cleanly": false/"exited_cleanly": true/' ~/.config/chromium/"Local State"

echo "Launching WeatherDash"
x-terminal-emulator -t "WeatherDash Console" -e bash -c "chromium-browser --start-fullscreen --enable-logging=stderr -rv=1 ${CLIENT_ADDR} 2>&1 | tee ${SCRIPT_DIR}/browser.log"

echo "DONE"
