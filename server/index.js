'use strict';

const dateFormat = require('dateformat');
require('./betterlog')(function() {
  var now = new Date();
  var date = dateFormat(now, '[yyyy-mm-dd HH:MM:ss.l]');
  var log = date + ' ' + '%s';
  return log;
}, true);

const express = require('express');
const cors = require('cors');

const config = require('./config');
const APIS = require('./apis');

var api = new APIS();
var WEATHER_TIMER = null;
var FORECAST_TIMER = null;
var INDOOR_TIMER = null;

function startup() {
  scheduleAPICalls().then(() => {
    startAPIServer();
  });
}

function startAPIServer() {
  console.log('Starting API Server');
  const app = express();
  var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  app.route('/api/reset').get((req, res) => {
    console.info('Client accessing reset!');
    unscheduleAPICalls();
    api.WEATHER_JSON = null;
    api.FORECAST_JSON = null;
    api.SUMMARY_JSON = null;
    api.INDOOR_JSON = null;
    startup();
    res.send();
  });
  app.route('/api/weather').get((req, res) => {
    console.info('Client accessing weather!');
    res.send(api.WEATHER_JSON);
  });
  app.route('/api/forecast').get((req, res) => {
    console.info('Client accessing forecast!');
    res.send(api.FORECAST_JSON);
  });
  app.route('/api/indoor').get((req, res) => {
    console.info('Client accessing indoor!');
    res.send(api.INDOOR_JSON);
  });
  app.route('/api/settings').post((req, res) => {
    console.info('Client accessing settings!');
    if (req.query.units) {
      if (config.UNIT_CHOICES.includes(req.query.units)) {
        api.UNIT = req.query.units;
      } else {
        res.status(422).send('Bad value for unit parameter');
        return;
      }
    }
    if (req.query.zip) {
      if (/(^\d{5}$)/.test(req.query.zip)) {
        api.ZIP = req.query.zip;
      } else {
        res.status(422).send('Bad value for zip parameter');
        return;
      }
    }
    api.WEATHER_JSON = null;
    api.FORECAST_JSON = null;
    api.SUMMARY_JSON = null;
    api.INDOOR_JSON = null;
    var weatherPromise = api.getOWMWeather();
    var forecastPromise = api.getOWMForecast();
    var thermostatPromise = api.getEcobeeThermostats();
    Promise.all([weatherPromise, forecastPromise, thermostatPromise])
      .then(data => {
        var weatherStatus = data[0];
        var forecastStatus = data[1];
        var thermostatStatus = data[2];
        if (!weatherStatus) {
          res.status(500).send('Failed to update weather data');
          return;
        }
        if (!forecastStatus) {
          res.status(500).send('Failed to update forecast data');
          return;
        }
        if (!thermostatStatus) {
          res.status(500).send('Failed to update thermostat data');
          return;
        }
        res.send();
      });
  });

  app.listen(8000, () => {
    console.log('Server started!');
  });
}

function scheduleAPICalls() {
  return api.ecobeeAuth().then(success => {
    var weatherPromise = api.getOWMWeather();
    var forecastPromise = api.getOWMForecast();
    var thermostatPromise = api.getEcobeeThermostats();
    Promise.all([weatherPromise, forecastPromise, thermostatPromise])
      .then(data => {
        WEATHER_TIMER = setInterval(
          function() { api.getOWMWeather(); },
          config.OWM_WEATHER_POLL_FREQ_MS
        );
        FORECAST_TIMER = setInterval(
          function() { api.getOWMForecast(); },
          config.OWM_FORECAST_POLL_FREQ_MS
        );
        INDOOR_TIMER = setInterval(
          function() {
            api.getEcobeeSummary().then(success => {
              if (success) api.getEcobeeThermostats();
            });
          }, config.ECOBEE_POLL_FREQ_MS
        );
      });
  }, (err) => { console.error(err); });
}

function unscheduleAPICalls() {
  clearInterval(WEATHER_TIMER);
  clearInterval(FORECAST_TIMER);
  clearInterval(INDOOR_TIMER);
}

startup();
