
const OWM_ICON_URL = 'https://openweathermap.org/img/w/';
export function formOWMIconURL(icon) {
  return OWM_ICON_URL + icon + '.png';
}



class Coord {
  lat = null;
  lon = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('lon')) { this.lon = obj['lon']; }
      if (obj.hasOwnProperty('lat')) { this.lat = obj['lat']; }
    }
  }
}

class Weather {
  id = null;
  main = null;
  description = null;
  icon = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('id')) { this.id = obj['id']; }
      if (obj.hasOwnProperty('main')) { this.main = obj['main']; }
      if (obj.hasOwnProperty('description')) { this.description = obj['description']; }
      if (obj.hasOwnProperty('icon')) { this.icon = obj['icon']; }
    }
  }
}

class Main {
  temp = null;
  pressure = null;
  humidity = null;
  temp_min = null;
  temp_max = null;
  sea_level = null;
  grnd_level = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('temp')) { this.temp = obj['temp']; }
      if (obj.hasOwnProperty('pressure')) { this.pressure = obj['pressure']; }
      if (obj.hasOwnProperty('humidity')) { this.humidity = obj['humidity']; }
      if (obj.hasOwnProperty('temp_min')) { this.temp_min = obj['temp_min']; }
      if (obj.hasOwnProperty('temp_max')) { this.temp_max = obj['temp_max']; }
      if (obj.hasOwnProperty('sea_level')) { this.sea_level = obj['sea_level']; }
      if (obj.hasOwnProperty('grnd_level')) { this.grnd_level = obj['grnd_level']; }
    }
  }
}

class Wind {
  speed = null;
  deg = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('speed')) { this.speed = obj['speed']; }
      if (obj.hasOwnProperty('deg')) { this.deg = obj['deg']; }
    }
  }
}

class Cloud {
  all = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('all')) { this.all = obj['all']; }
    }
  }
}

class Rain {
  threehour = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('3h')) { this.threehour = obj['3h']; } // converted '3h' to 'threehour', a valid JS variable name
    }
  }
}

class Snow {
  threehour = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('3h')) { this.threehour = obj['3h']; } // converted '3h' to 'threehour', a valid JS variable name
    }
  }
}

class Sys {
  type = null;
  id = null;
  message = null;
  country = null;
  sunrise = null;
  sunset = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('type')) { this.type = obj['type']; }
      if (obj.hasOwnProperty('id')) { this.id = obj['id']; }
      if (obj.hasOwnProperty('message')) { this.message = obj['message']; }
      if (obj.hasOwnProperty('country')) { this.country = obj['country']; }
      if (obj.hasOwnProperty('sunrise')) { this.sunrise = obj['sunrise'] * 1000; } // convert to ms to be compatible with Date lib
      if (obj.hasOwnProperty('sunset')) { this.sunset = obj['sunset'] * 1000; } // convert to ms to be compatible with Date lib
    }
  }
}

export class OWMWeather {
  code = null;
  name = null;
  id = null;
  dt = null;
  sys: Sys = null;
  rain: Rain = null;
  snow: Snow = null;
  clouds: Cloud = null;
  wind: Wind = null;
  main: Main = null;
  base = null;
  weather: Weather[] = null;
  coord: Coord = null;

  constructor(obj) {
    if (obj.hasOwnProperty('cod')) { this.code = obj['cod']; }
    if (obj.hasOwnProperty('name')) { this.name = obj['name']; }
    if (obj.hasOwnProperty('id')) { this.id = obj['id']; }
    if (obj.hasOwnProperty('dt')) { this.dt = obj['dt'] * 1000; } // convert to ms to be compatible with Date lib
    if (obj.hasOwnProperty('base')) { this.base = obj['base']; }

    if (obj.hasOwnProperty('sys')) { this.sys = new Sys(obj['sys']); }
    if (obj.hasOwnProperty('rain')) { this.rain = new Rain(obj['rain']); }
    if (obj.hasOwnProperty('snow')) { this.snow = new Snow(obj['snow']); }
    if (obj.hasOwnProperty('clouds')) { this.clouds = new Cloud(obj['clouds']); }
    if (obj.hasOwnProperty('wind')) { this.wind = new Wind(obj['wind']); }
    if (obj.hasOwnProperty('main')) { this.main = new Main(obj['main']); }
    if (obj.hasOwnProperty('coord')) { this.coord = new Coord(obj['coord']); }

    if (obj.hasOwnProperty('weather')) {
      this.weather = [];
      for (const idx in obj['weather']) {
        if (!idx) { continue; }
        const elem = obj['weather'][idx];
        const report = new Weather(elem);
        this.weather.push(report);
      }
    }
  }
}

class City {
  id = null;
  name = null;
  coord: Coord = null;
  country = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('id')) { this.id = obj['id']; }
      if (obj.hasOwnProperty('name')) { this.name = obj['name']; }
      if (obj.hasOwnProperty('country')) { this.country = obj['country']; }

      if (obj.hasOwnProperty('coord')) { this.coord = new Coord(obj['coord']); }
    }
  }
}

class Forecast {
  dt = null;
  main: Main = null;
  weather: Weather[] = null;
  clouds: Cloud = null;
  wind: Wind = null;
  rain: Rain = null;
  snow: Snow = null;
  dt_txt = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('dt')) { this.dt = obj['dt'] * 1000; } // convert to ms to be compatible with Date lib
      if (obj.hasOwnProperty('dt_txt')) { this.dt_txt = obj['dt_txt']; }

      if (obj.hasOwnProperty('main')) { this.main = new Main(obj['main']); }
      if (obj.hasOwnProperty('clouds')) { this.clouds = new Cloud(obj['clouds']); }
      if (obj.hasOwnProperty('wind')) { this.wind = new Wind(obj['wind']); }
      if (obj.hasOwnProperty('rain')) { this.rain = new Rain(obj['rain']); }
      if (obj.hasOwnProperty('snow')) { this.snow = new Snow(obj['snow']); }

      if (obj.hasOwnProperty('weather')) {
        this.weather = [];
        for (const idx in obj['weather']) {
          if (!idx) { continue; }
          const elem = obj['weather'][idx];
          const report = new Weather(elem);
          this.weather.push(report);
        }
      }
    }
  }
}

export class OWMForecast {
  code = null;
  message = null;
  city: City = null;
  cnt = null;
  list: Forecast[] = null;

  constructor(obj) {
    if (obj.hasOwnProperty('cod')) { this.code = obj['cod']; }
    if (obj.hasOwnProperty('message')) { this.message = obj['message']; }
    if (obj.hasOwnProperty('cnt')) { this.cnt = obj['cnt']; }

    if (obj.hasOwnProperty('city')) { this.city = new City(obj['city']); }

    if (obj.hasOwnProperty('list')) {
      this.list = [];
      for (const idx in obj['list']) {
        if (!idx) { continue; }
        const elem = obj['list'][idx];
        const forecast = new Forecast(elem);
        this.list.push(forecast);
      }
    }
  }
}
