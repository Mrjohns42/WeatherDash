import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

import { APIService } from '../api.service';
import { OWMWeather, OWMForecast, formOWMIconURL } from './owm.types';
import { EcobeeIndoor } from './ecobee.types';
import { Settings } from './weatherdash.config';
import { TouchScroll } from '../touchscroll.module';

const HTTP_STATUS_OK = 200;

@Component({
  selector: 'app-weatherdash',
  templateUrl: './weatherdash.component.html',
  styleUrls: ['./weatherdash.component.css']
})
export class WeatherdashComponent implements OnInit {
  settings = null;
  clockTimer;
  clock = null ;
  weatherTimer;
  weather = null;
  weatherErr = true;
  forecastTimer;
  forecast = null;
  indoorTimer;
  indoor = null;
  indoorErr = true;
  thermostatId = null;
  idx = null;
  forecastScroll = null;

  constructor(private apiService: APIService) {
    this.clockTimer = interval(300);
    this.weatherTimer = interval(1000 * 30);
    this.forecastTimer = interval(1000 * 60 * 1);
    this.indoorTimer = interval(1000 * 30);
  }

  ngOnInit() {
    const self = this;
    this.settings = new Settings();
    this.forecastScroll = new TouchScroll();
    this.forecastScroll.init({
            id: 'forecast',
            draggable: true,
            wait: false
        });

    this.clockTimer.subscribe(() => {
      this.clock = Date.now();
    });

    this.updateSettings(this.settings.ZIP, this.settings.UNIT, true);

    this.weatherTimer.subscribe(() => {
      self.updateWeather();
    });
    this.forecastTimer.subscribe(() => {
      self.updateForecast();
    });
    this.indoorTimer.subscribe(() => {
      self.updateIndoor();
    });
  }

  updateSettings(zip, unit, refresh = true) {
    const self = this;
    if (refresh) {
      self.weather = self.forecast = self.indoor = null;
    }
    return new Promise(resolve => {
      self.apiService.configureSettings(zip, unit).subscribe(response => {
        resolve(Number(response.status) === HTTP_STATUS_OK);
      });
    }).then(success => {
      if (success && refresh) {
        self.updateWeather();
        self.updateForecast();
        self.updateIndoor();
      } else {
        window.alert('Error configuring settings. Refresh recommended.');
      }
    });
  }

  updateWeather() {
    this.apiService.getWeather().subscribe((data) => {
      const weather = new OWMWeather(data);
      console.log('Weather:', weather);
      if (Number(weather.code) === HTTP_STATUS_OK) {
        this.weatherErr = false;
        this.weather = weather;
      } else {
        this.weatherErr = true;
      }
    });
  }

  updateForecast() {
    this.apiService.getForecast().subscribe((data) => {
      const forecast = new OWMForecast(data);
      console.log('Forecast:', forecast);
      if (Number(forecast.code) === HTTP_STATUS_OK) {
        this.forecast = forecast;
      }
    });
  }

  updateIndoor() {
    this.apiService.getIndoor().subscribe((data) => {
      const indoor = new EcobeeIndoor(data);
      console.log('Indoor:', indoor);
      if (Number(indoor.status.code) === 0) {
        this.indoorErr = false;
        this.indoor = indoor;
      } else {
        this.indoorErr = true;
      }
    });
  }

  daysAway(ts) {
    const msInDay = 1000 * 60 * 60 * 24;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTs = today.getTime();
    const delta = ts - todayTs;
    const days = delta / msInDay;
    return Math.floor(days);
  }

  dayOrNight(ts) {
    const hour = (new Date(ts)).getHours();
    if (hour >= 6 && hour < 18) { return 'd'; } else { return 'n'; }
  }

  formIconUrl(icon) {
    return formOWMIconURL(icon);
  }

  getThermostatIdx() {
    const self = this;
    if (this.thermostatId == null) {
      return 0;
    }
    const index = this.indoor.thermostatList.findIndex(function(thermostat) {
      return thermostat.identifier === self.thermostatId;
    });
    if (index === -1) {
      this.thermostatId = null;
      return 0;
    }
    return index;
  }

  setThermostatId(id) {
    this.thermostatId = id;
  }

  promptZip() {
    const self = this;
    const zip = window.prompt('Please enter a 5 digit ZIP code:');
    if (zip != null) {
      if (/(^\d{5}$)/.test(zip)) {
        this.updateSettings(zip, null).then( () => {
          self.settings.setZip(zip);
        });
      } else {
        window.alert('Invalid 5 digit ZIP!');
      }
    }
  }

  toggleUnit() {
    const self = this;
    const unit = this.settings.nextUnit();
    self.settings.setUnit(unit);
    this.updateSettings(null, unit);
  }

  refreshPage() {
    window.location.reload();
  }
}
