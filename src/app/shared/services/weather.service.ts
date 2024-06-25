import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { WeatherData } from '../models/weather';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { GeolocationService } from './geolocation.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseApiUrl = 'https://api.openweathermap.org/data/2.5';
  private weatherApiUrl = '/weather'

  public currentWeather$ = new BehaviorSubject<WeatherData>({} as WeatherData);
  public isInCelsius$ = new BehaviorSubject<boolean>(true);

  constructor(
    private http: HttpClient,
    private geolocationService: GeolocationService,
  ) { }

  public dispatch() {
    return combineLatest([
      this.geolocationService.getLocation().pipe(distinctUntilChanged()),
      this.isInCelsius$.pipe(distinctUntilChanged())
    ]).pipe(
      tap(([coords, isCelsius]) => this.geolocationService.saveCoordinates(coords)),
      switchMap(([location, isCelsius]) => {
        const units = isCelsius ? 'metric' : 'standard';
        return this.getCurrentWeatherByCoords(location, units);
      }),
      tap((weather: WeatherData) => this.currentWeather$.next(weather))
    );
  }
  
  public getCurrentWeatherByName(location: string, units: string = 'metric'): Observable<WeatherData> {
    const query = `?q=${location}&appid=${environment.APIKEY}&units=${units}`;
    return this.http.get<WeatherData>(this.baseApiUrl+this.weatherApiUrl+query);
  }

  public getCurrentWeatherByCoords(position: GeolocationPosition, units: string = 'metric') {
    const query = `?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${environment.APIKEY}&units=${units}`;
    return this.http.get<WeatherData>(this.baseApiUrl+this.weatherApiUrl+query);
  }

}
