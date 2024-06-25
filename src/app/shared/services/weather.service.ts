import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { WeatherData } from '../models/weather';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseApiUrl = 'https://api.openweathermap.org/data/2.5';
  private weatherApiUrl = '/weather'

  constructor(private http: HttpClient) { }

  public getCurrentWeatherByName(location: string): Observable<WeatherData> {
    const query = `?q=${location}&appid=${environment.APIKEY}`;
    return this.http.get<WeatherData>(this.baseApiUrl+this.weatherApiUrl+query);
  }

  public getCurrentWeatherByCoords(position: GeolocationPosition) {
    const query = `?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${environment.APIKEY}`;
    return this.http.get<WeatherData>(this.baseApiUrl+this.weatherApiUrl+query);
  }

}
