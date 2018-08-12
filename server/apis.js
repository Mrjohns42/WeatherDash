'use strict';

const request = require('request');
const fs = require('fs');

const config = require('./config');

module.exports = APIS;

const HTTP_STATUS_OK = 200;
const OWM_URL = 'https://api.openweathermap.org/data/2.5';
const ECOBEE_URL = 'https://api.ecobee.com';

const TERM_FG_GREEN = '\x1b[32m';
const TERM_FG_BLACK = '\x1b[30m';
const TERM_BG_WHITE = '\x1b[47m';
const TERM_RESET = '\x1b[0m';

function APIS() {
  this.UNIT = config.DEFAULT_UNIT;
  this.ZIP = config.DEFAULT_ZIP_CODE;

  this.WEATHER_JSON = null;
  this.FORECAST_JSON = null;
  this.SUMMARY_JSON = null;
  this.INDOOR_JSON = null;

  this.TOKEN_TIMER = null;
  this.ECOBEE_ACCESS_TOKEN = null;
  this.ECOBEE_REFRESH_TOKEN = null;
}

APIS.prototype.constructor = APIS;

APIS.prototype.getOWMWeather = function() {
  var self = this;
  var url = OWM_URL + '/' + 'weather?';
  url += '&zip=' + this.ZIP;
  if (this.UNIT) {
    url += '&units=' + this.UNIT;
  }
  url += '&APPID=' + config.OWM_API_KEY;
  console.info('Accessing: ' + url);
  return new Promise(resolve => {
    request(url, function(err, res, body) {
      if (!res) {
        console.error('Weather Error: No repsonse');
        resolve(false);
      } else if (err || res.statusCode !== HTTP_STATUS_OK) {
        console.error('Weather Error: ', err, 'Status: ', res.statusCode);
        resolve(false);
      } else {
        let json = JSON.parse(body);
        self.WEATHER_JSON = json;
        console.log('Updated weather data!');
        resolve(true);
      }
    });
  });
};

APIS.prototype.getOWMForecast = function() {
  var self = this;
  var url = OWM_URL + '/' + 'forecast?';
  url += '&zip=' + this.ZIP;
  if (this.UNIT) {
    url += '&units=' + this.UNIT;
  }
  url += '&APPID=' + config.OWM_API_KEY;
  console.info('Accessing: ' + url);
  return new Promise(resolve => {
    request(url, function(err, res, body) {
      if (!res) {
        console.error('Forecast Error: No repsonse');
        resolve(false);
      } else if (err || res.statusCode !== HTTP_STATUS_OK) {
        console.error('Forecast Error: ', err, 'Status: ', res.statusCode);
        resolve(false);
      } else {
        let json = JSON.parse(body);
        self.FORECAST_JSON = json;
        console.log('Updated forecast data!');
        resolve(true);
      }
    });
  });
};

APIS.prototype.ecobeeAuth = function() {
  var self = this;
  return new Promise(resolve => {
    if (fs.existsSync(config.ECOBEE_TOKENS_FILE)) {
      var tokens = JSON.parse(
        fs.readFileSync(config.ECOBEE_TOKENS_FILE, 'utf8')
      );
      self.ECOBEE_REFRESH_TOKEN = tokens['ECOBEE_REFRESH_TOKEN'];
      self.ECOBEE_ACCESS_TOKEN = tokens['ECOBEE_ACCESS_TOKEN'];
      self.ecobeeRefreshTokens().then(success => {
        if (success) {
          console.log('Refreshed Ecobee tokens!');
          resolve(true);
        } else resolve(false);
      });
      return;
    }

    var url = ECOBEE_URL + '/' + 'authorize?';
    url += 'response_type=ecobeePin';
    url += '&scope=smartRead';
    url += '&client_id=' + config.ECOBEE_API_KEY;
    console.info('Accessing: ' + url);
    request(url, function(err, res, body) {
      if (!res) {
        console.error('Authorize Error: No repsonse');
        resolve(false);
      } else if (err || res.statusCode !== HTTP_STATUS_OK) {
        console.error('Authorize Error: ', err, 'Status: ', res.statusCode);
        resolve(false);
      } else {
        let json = JSON.parse(body);
        console.log(
          TERM_FG_GREEN,
          '\n\n  Please log into your Ecobee account at: ' +
          'https://www.ecobee.com' +
          '\n  Navigate to Settings (upper right icon) => My Apps' +
          '\n  Enter the following pin:',
          TERM_FG_BLACK,
          TERM_BG_WHITE,
          json['ecobeePin'],
          TERM_RESET,
          '\n'
        );
        console.log('Pin expires in', json['expires_in'], 'minutes');
        console.log('Polling at', json['interval'], 'seconds');
        self.TOKEN_TIMER = setInterval(() => {
          self.ecobeeGetTokens(json['code']).then(success => {
            if (success) {
              console.log('Authenticated with Ecobee!');
              clearInterval(self.TOKEN_TIMER);
              resolve(true);
            }
          });
        }, json['interval'] * 1000);

      }
    });
  });
};

APIS.prototype.ecobeeGetTokens = function(authKey) {
  var self = this;
  var url = ECOBEE_URL + '/' + 'token?';
  url += 'grant_type=ecobeePin';
  url += '&client_id=' + config.ECOBEE_API_KEY;
  url += '&code=' + authKey;
  console.info('Accessing: ' + url);
  return new Promise(resolve => {
    request({url: url, method: 'POST'}, function(err, res, body) {
      if (!res) {
        console.error('Token Error: No repsonse');
        resolve(false);
      } else if (res.statusCode === 401) {
        console.warn('Not yet authenticated!');
        resolve(false);
      } else if (err || res.statusCode !== HTTP_STATUS_OK) {
        console.error('Token Error: ', err, 'Status: ', res.statusCode);
        resolve(false);
      } else {
        let json = JSON.parse(body);
        self.ECOBEE_REFRESH_TOKEN = json['refresh_token'];
        self.ECOBEE_ACCESS_TOKEN = json['access_token'];
        if (fs.existsSync(config.ECOBEE_TOKENS_FILE)) {
          fs.unlinkSync(config.ECOBEE_TOKENS_FILE);
        }
        var ECOBEE_ACCESS_TOKEN = self.ECOBEE_ACCESS_TOKEN;
        var ECOBEE_REFRESH_TOKEN = self.ECOBEE_REFRESH_TOKEN;
        fs.writeFileSync(config.ECOBEE_TOKENS_FILE,
          JSON.stringify({ECOBEE_ACCESS_TOKEN, ECOBEE_REFRESH_TOKEN})
        );
        console.log('Ecobee tokens saved to:', config.ECOBEE_TOKENS_FILE);
        resolve(true);
      }
    });
  });
};

APIS.prototype.ecobeeRefreshTokens = function() {
  var self = this;
  var url = ECOBEE_URL + '/' + 'token?';
  url += 'grant_type=refresh_token';
  url += '&code=' + this.ECOBEE_REFRESH_TOKEN;
  url += '&client_id=' + config.ECOBEE_API_KEY;
  console.info('Accessing: ' + url);
  return new Promise(resolve => {
    request({url: url, method: 'POST'}, function(err, res, body) {
      if (!res) {
        console.error('Refresh Error: No repsonse');
        resolve(false);
      } else if (err || res.statusCode !== HTTP_STATUS_OK) {
        console.error('Refresh Error: ', err, 'Status: ', res.statusCode);
        resolve(false);
      } else {
        let json = JSON.parse(body);
        self.ECOBEE_REFRESH_TOKEN = json['refresh_token'];
        self.ECOBEE_ACCESS_TOKEN = json['access_token'];
        if (fs.existsSync(config.ECOBEE_TOKENS_FILE)) {
          fs.unlinkSync(config.ECOBEE_TOKENS_FILE);
        }
        var ECOBEE_ACCESS_TOKEN = self.ECOBEE_ACCESS_TOKEN;
        var ECOBEE_REFRESH_TOKEN = self.ECOBEE_REFRESH_TOKEN;
        fs.writeFileSync(config.ECOBEE_TOKENS_FILE,
          JSON.stringify({ECOBEE_ACCESS_TOKEN, ECOBEE_REFRESH_TOKEN})
        );
        console.log('Ecobee tokens saved to:', config.ECOBEE_TOKENS_FILE);
        resolve(true);
      }
    });
  });
};

APIS.prototype.getEcobeeSummary = function() {
  var self = this;
  var url = ECOBEE_URL + '/' + '1' + '/' + 'thermostatSummary?';
  var body =
  {
    selection:
    {
      selectionType: 'registered',
      selectionMatch: '',
      includeEquipmentStatus: 'true',
    },
  };
  url += 'json=' + encodeURIComponent(JSON.stringify(body));
  var options = {
    url: url,
    headers: {
      Authorization: 'Bearer ' + this.ECOBEE_ACCESS_TOKEN,
      'content-type': 'application/json',
    },
    method: 'GET',
  };
  console.info('Accessing: ' + url);
  return new Promise(resolve => {
    request(options, function(err, res, body) {
      if (!res) {
        console.error('Summary Error: No repsonse');
        resolve(false);
      } else if (err || res.statusCode !== HTTP_STATUS_OK) {
        console.error('Summary Error: ', err, 'Status: ', res.statusCode);
        if (res.statusCode === 500) {
          self.ecobeeRefreshTokens();
        }
        resolve(false);
      } else {
        let json = JSON.parse(body);
        switch (json['status']['code']) {
          case 14:
            self.ecobeeRefreshTokens();
            resolve(false);
            break;
          case 0:
            if (JSON.stringify(json) !== JSON.stringify(self.SUMMARY_JSON)) {
              self.SUMMARY_JSON = json;
              console.log('Updated summary data!');
              resolve(true);
            } else {
              console.log('No new summary data!');
              resolve(false);
            }
            break;
          default:
            console.error(
              'Summary Status Error' +
              json['status']['code'] +
              ':' +
              json['status']['message']
            );
            resolve(false);
            break;
        }
      }
    });
  });
};


APIS.prototype.getEcobeeThermostats = function() {
  var self = this;
  var url = ECOBEE_URL + '/' + '1' + '/' + 'thermostat?';
  var body =
  {
    selection:
    {
      selectionType: 'registered',
      selectionMatch: '',
      includeAlerts: 'true',
      includeEvents: 'true',
      includeSettings: 'true',
      includeRuntime: 'true',
    },
  };
  url += 'json=' + encodeURIComponent(JSON.stringify(body));
  var options = {
    url: url,
    headers: {
      Authorization: 'Bearer ' + this.ECOBEE_ACCESS_TOKEN,
      'content-type': 'application/json',
    },
    method: 'GET',
  };
  console.info('Accessing: ' + url);
  return new Promise(resolve => {
    request(options, function(err, res, body) {
      if (!res) {
        console.error('Thermostat Error: No repsonse');
        resolve(false);
      } else if (err || res && res.statusCode !== HTTP_STATUS_OK) {
        console.error('Thermostat Error: ', err, 'Status: ', res.statusCode);
        resolve(false);
      } else {
        let json = JSON.parse(body);
        switch (json['status']['code']) {
          case 14:
            self.ecobeeRefreshTokens();
            resolve(false);
            break;
          case 0:
            if (self.UNIT === config.UNIT_METRIC) {
              console.log('Converting to metric');
              self.ecobeeTempConvert(json, convertDegreesFtoC);
            }
            self.INDOOR_JSON = json;
            console.log('Updated thermostat data!');
            resolve(true);
            break;
          default:
            console.error(
              'Thermostat Status Error' +
              json['status']['code'] +
               ':' +
               json['status']['message']
            );
            resolve(false);
            break;
        }
      }
    });
  });
};

APIS.prototype.ecobeeTempConvert = function(json, conversionFn) {
  for (var therm of json['thermostatList']) {
    if (therm.hasOwnProperty('runtime')) {
      var rt = therm['runtime'];
      rt['actualTemperature'] = conversionFn(rt['actualTemperature']);
      rt['desiredCool'] = conversionFn(rt['desiredCool']);
      rt['desiredHeat'] = conversionFn(rt['desiredHeat']);
      for (let temp of rt['desiredCoolRange']) {
        temp = conversionFn(temp);
      }
      for (let temp of rt['desiredHeatRange']) {
        temp = conversionFn(temp);
      }
    }
  }
};

function convertDegreesFtoC(degreesF) {
  var degreesC = (degreesF - 320) * 5 / 9;
  return degreesC;
}


