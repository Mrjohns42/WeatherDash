import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private http: HttpClient) { }

  getWeather() {
    const url = 'http://localhost:8000/api/weather';
    console.log('Accessing: ' + url);
    return this.http.get(url);
  }

  getForecast() {
    const url = 'http://localhost:8000/api/forecast';
    console.log('Accessing: ' + url);
    return this.http.get(url);
  }

  getIndoor() {
    const url = 'http://localhost:8000/api/indoor';
    console.log('Accessing: ' + url);
    return this.http.get(url);
  }

  configureSettings(zip, unit) {
    let url = 'http://localhost:8000/api/settings?';
    if (zip != null) { url += '&zip=' + zip; }
    if (unit != null) { url += '&units=' + unit; }
    console.log('Accessing: ' + url);
    return this.http.post(url, null, {observe: 'response'});
  }
}
