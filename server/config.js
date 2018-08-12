'use strict';

const fs = require('fs');

const UNIT_IMPERIAL = 'imperial';
const UNIT_METRIC = 'metric';
const UNIT_CHOICES = [UNIT_IMPERIAL, UNIT_METRIC];


// Change these to desired values
const DEFAULT_UNIT = UNIT_IMPERIAL;
const DEFAULT_ZIP_CODE = '60613';


const OWM_WEATHER_POLL_FREQ_MS = (1000 * 30);
const OWM_FORECAST_POLL_FREQ_MS = (1000 * 60 * 15);
const ECOBEE_POLL_FREQ_MS = (1000 * 60 * 1);

const ECOBEE_TOKENS_FILE = './keys/ecobee_tokens.json';

const OWM_API_KEY_FILE = './keys/owm.key';
const OWM_API_KEY = readKey(OWM_API_KEY_FILE);

const ECOBEE_API_KEY_FILE = './keys/ecobee.key';
const ECOBEE_API_KEY = readKey(ECOBEE_API_KEY_FILE);

function readKey(keyFile) {
  if (fs.existsSync(keyFile)){
    var contents = fs.readFileSync(keyFile, {encoding: 'utf8'});
    contents = contents.trim();
    if (contents === '') {
      console.error('API key file is empty:', keyFile);
      console.error('Please populate this file with an API key in plaintext');
      process.exit(1);
    } else return contents;
  } else {
    console.error('Couldn\'t find API key file:', keyFile);
    console.error(
      'Please create a file at this location ' +
      'and populate with API key in plaintext'
    );
    process.exit(1);
  }
}


module.exports = {
  DEFAULT_ZIP_CODE,
  DEFAULT_UNIT,
  UNIT_IMPERIAL,
  UNIT_METRIC,
  UNIT_CHOICES,
  OWM_WEATHER_POLL_FREQ_MS,
  OWM_FORECAST_POLL_FREQ_MS,
  OWM_API_KEY,
  ECOBEE_POLL_FREQ_MS,
  ECOBEE_API_KEY,
  ECOBEE_TOKENS_FILE,
};
