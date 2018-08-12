
const UNIT_IMPERIAL = 'imperial';
const UNIT_METRIC = 'metric';
const UNIT_LIST = [UNIT_IMPERIAL, UNIT_METRIC];
const TEMP_UNITS = {[UNIT_IMPERIAL]: '°F', [UNIT_METRIC]: '°C'};
const SPEED_UNITS = {[UNIT_IMPERIAL]: 'mph', [UNIT_METRIC]: 'm/s'};


// Change these to desired values
const defaultZip = '92104';
const defaultUnit = UNIT_IMPERIAL;


export class Settings {
  UNIT_KEY = 'WEATHERDASH_UNIT';
  ZIP_KEY = 'WEATHERDASH_ZIP';

  UNIT = defaultUnit;
  ZIP = defaultZip;

  constructor() {
    if (typeof(Storage) !== 'undefined') {
      const unit = localStorage.getItem(this.UNIT_KEY);
      if (unit != null) {
        this.UNIT = unit;
      }
      const zip = localStorage.getItem(this.ZIP_KEY);
      if (zip != null) {
        this.ZIP = zip;
      }
    }
  }

  getTempSymbol() {
    return TEMP_UNITS[this.UNIT];
  }

  getSpeedSymbol() {
    return SPEED_UNITS[this.UNIT];
  }

  nextUnit() {
    const idx = UNIT_LIST.indexOf(this.UNIT);
    return UNIT_LIST[ (idx + 1) % UNIT_LIST.length ];
  }

  setUnit(unit) {
    if (typeof(Storage) !== 'undefined') {
      localStorage.setItem(this.UNIT_KEY, unit);
    }
    this.UNIT = unit;

  }

  setZip(zip) {
    if (typeof(Storage) !== 'undefined') {
      localStorage.setItem(this.ZIP_KEY, zip);
    }
    this.ZIP = zip;
  }
}
