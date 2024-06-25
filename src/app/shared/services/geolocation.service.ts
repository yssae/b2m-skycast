import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environtment';

import { WeatherData } from '../models/weather';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private baseApiUrl = 'https://api.openweathermap.org/data/2.5';
  private geolocationAPIURL = '/weather'
  
  constructor(private http: HttpClient) { }

  getCurrentWeather(location: string): Observable<WeatherData> {
    const query = `?q=${location}&appid=${environment.apiKey}`;
    return this.http.get<WeatherData>(this.baseApiUrl+this.geolocationAPIURL+query);
  }
}
