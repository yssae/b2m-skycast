import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AirPollutionData, Coord, WeatherData } from '../models/weather';
import { BehaviorSubject, Observable, catchError, combineLatest, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
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
      this.geolocationService.getCoords$(),
      this.isInCelsius$.pipe(distinctUntilChanged())
    ]).pipe(
      tap(([coords, isCelscoordsius]) => {
        if(coords) {
          this.geolocationService.saveCoordinates(coords);
          this.determineAQI(coords);  
        }
      }),
      switchMap(([coords, isCelsius]) => {
        const units = isCelsius ? 'metric' : 'standard';
        if (coords) {
          const units = isCelsius ? 'metric' : 'standard';
          return this.getCurrentWeatherByCoords(coords, units);
        } else {
          return of({} as WeatherData); // Return an empty WeatherData or handle as needed
        }
      }),
      tap((weather: WeatherData) => this.currentWeather$.next(weather))
    );
  }

  public setNewLocation(searchTerm: string) {
    return this.getCurrentWeatherByName(searchTerm).pipe(
      tap((weather) => {
        this.geolocationService.clearCoordinates();
        this.geolocationService.coords$.next(weather.coord);
        this.isInCelsius$.next(true);
        this.geolocationService.saveCoordinates(weather.coord)
      }),
      catchError((error) => of([]))
    )
  }
  
  private getCurrentWeatherByName(location: string, units: string = 'metric'): Observable<WeatherData> {
    const query = `?q=${location}&appid=${environment.APIKEY}&units=${units}`;
    return this.http.get<WeatherData>(this.baseApiUrl+this.weatherApiUrl+query);
  }

  private getCurrentWeatherByCoords(coords: Coord, units: string = 'metric') {
    const query = `?lat=${coords.lat}&lon=${coords.lon}&appid=${environment.APIKEY}&units=${units}`;
    return this.http.get<WeatherData>(this.baseApiUrl+this.weatherApiUrl+query);
  }

  public getAirPollutionData(coords: Coord): Observable<AirPollutionData> {
    const query = `?lat=${coords.lat}&lon=${coords.lon}&appid=${environment.APIKEY}`;
    return this.http.get<AirPollutionData>(this.baseApiUrl+this.airQualityApiUrl+query);
  }

  private determineAQI(position: Coord) {
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
