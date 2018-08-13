# WeatherDash

**Smart weather dashboard.**

**Integrates with OpenWeatherMaps and Ecobee.**

**Designed to run on RaspberryPi.**

**Written with Node and Angular.**
 
 
## Server
The WeatherDash server is a Node application.

This server is designed to:

- Access the configured APIs (currently OpenWeatherMaps and Ecobee)
- Process and cache API reponses
- Host WeatherDash API endpoints to provide this data to the client application.
### Setting Up the Server
	cd server
#### Install Dependencies
	npm install
#### Confgure
##### OpenWeatherMaps
- Go to: https://openweathermap.org/appid
- Login or Create an account
- Generate an API key
- Under the **keys** directory, populate your API key in a file called **owm.key**
- In **config.js**, set the values of **DEFAULT_UNIT** and **DEFAULT_ZIP_CODE** to your preference. 
( *Note*: these settings can be overridden via the WeatherDash API by the client application config and UI)
##### Ecobee
- Go to: https://www.ecobee.com/developers/
- Login or Create Account
- Enable developer dashboard
- Generate an API key (you'll only need read permissions)
- Under the **keys** directory, populate your API key in a file called **ecobee.key**
### Starting the Server
	npm start
**You'll need to run the server manually the first time.**
The first time you run the server, you'll be presented with instructions for pairing the application with your Ecobee account, using a pin code.
After that succeeds, no further manual interaction with the server should be necessary.
From that point, the server will access the OpenWeatherMaps and Ecobee APIs, negotiate token refreshes, and host an API endpoint for the client application.
The WeatherDash API endpoint will be hosted at localhost:8000

## Client
The WeatherDash client is an Angular application.

The client is designed to:

- Access API data from server application
- Display time and date info
- Display Ecobee indoor climate info
- Display OpenWeatherMaps city climate info
- Display OpenWeatherMaps city forecast info
### Setting Up the Client
	cd client
#### Install Dependencies
	npm install
#### Confgure
 In **src/app/weatherdash/weatherdash.config.ts**, set the values of **defaultZip** and **defaultUnit** to your preference. 
 ( *Note*: these settings can be overridden by the UI and will persist via localstorage)
### Starting the Client
	ng serve
**The WeatherDash UI will be hosted at localhost:4200**


## Using the App
In your browser, navigate to: **localhost:4200**

There's just a few interactions possible with the app:

- If multiple thermostats are connected to your Ecobee account, you will be prompted to select the one you wish to display.  If you change your mind, simply refresh the page and change your selection.
- Clicking the City Name will allow you to change the zip code.  Your choice will be saved across sessions via localStorage.
- Clicking the Unit Symbol (in the upperleft corner of either Indoor or Local weather) will allow you switch between Imperial and Metric units.  Your choice will be saved across sessions via localStorage.
- The Forecast can be dragged horizontally to view up to 5 days of weather outlook.
