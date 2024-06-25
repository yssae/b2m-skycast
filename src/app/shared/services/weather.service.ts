import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AirPollutionData, WeatherData } from '../models/weather';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { GeolocationService } from './geolocation.service';
import { AQI_DESCRIPTION } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseApiUrl = 'https://api.openweathermap.org/data/2.5';
  private weatherApiUrl = '/weather'
  private airQualityApiUrl = '/air_pollution'

  public currentWeather$ = new BehaviorSubject<WeatherData>({} as WeatherData);
  public currentAirQualityData$ = new BehaviorSubject<AirPollutionData>({} as AirPollutionData);

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
      tap(([coords, isCelsius]) => {
        this.geolocationService.saveCoordinates(coords);
        this.determineAQI(coords);
      }),
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

  public getAirPollutionData(position: GeolocationPosition): Observable<AirPollutionData> {
    const query = `?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${environment.APIKEY}`;
    return this.http.get<AirPollutionData>(this.baseApiUrl+this.airQualityApiUrl+query);
  }

  private determineAQI(position: GeolocationPosition) {
    this.getAirPollutionData(position).pipe(
      tap((air: AirPollutionData) => this.setAQIDescription(air)),
      tap((air: AirPollutionData) => this.currentAirQualityData$.next(air))
    ).subscribe();
  }
  
  private setAQIDescription(air: AirPollutionData) {
    const currentAQI = air.list[0]?.main.aqi;
    const matchedDescription = AQI_DESCRIPTION.find(aqi => currentAQI < aqi.score);
  
    if (matchedDescription) {
      air.aqiDescription = matchedDescription;
    }
  }
}
