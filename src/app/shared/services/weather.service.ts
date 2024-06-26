import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AirPollutionData, Coord, WeatherData, WeatherForecast } from '../models/weather';
import { BehaviorSubject, Observable, Subject, catchError, combineLatest, distinctUntilChanged, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { GeolocationService } from './geolocation.service';
import { AQI_DESCRIPTION } from '../constants';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements OnDestroy {
  private ngUnsubscribe = new Subject<void>(); 
  private baseApiUrl = 'https://api.openweathermap.org/data/2.5';
  private weatherApiUrl = '/weather';
  private weatherForecastApiUrl = '/forecast';
  private airQualityApiUrl = '/air_pollution';
  
  public currentWeather$ = new BehaviorSubject<WeatherData>({} as WeatherData);
  public currentAirQualityData$ = new BehaviorSubject<AirPollutionData>({} as AirPollutionData);
  public weatherForecast$ = new BehaviorSubject<WeatherData[]>([] as WeatherData[]);
  public isInCelsius$ = new BehaviorSubject<boolean>(true);

  constructor(
    private http: HttpClient,
    private geolocationService: GeolocationService,
  ) { }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  } 

  public dispatch() {    
    return combineLatest([
      this.geolocationService.getCoords$(),
      this.isInCelsius$.pipe(distinctUntilChanged())
    ]).pipe(
      switchMap(([coords, isCelsius]) => {
        const units = isCelsius ? 'metric' : 'standard';
        if (coords) {
          const units = isCelsius ? 'metric' : 'standard';
          this.determineAQI(coords); 
          this.geolocationService.saveCoordinates(coords);
          this.getWeatherForecast(coords, units)
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
      tap((air: AirPollutionData) => this.currentAirQualityData$.next(air)),
      takeUntil(this.ngUnsubscribe),
    ).subscribe();
  }
  
  private setAQIDescription(air: AirPollutionData) {
    const currentAQI = air.list[0]?.main.aqi;
    const matchedDescription = AQI_DESCRIPTION.find(aqi => currentAQI < aqi.score);
  
    if (matchedDescription) {
      air.aqiDescription = matchedDescription;
    }
  }

  private getFutureForecast(coords: Coord, units: string = 'metric'): Observable<WeatherForecast> {
    const query = `?lat=${coords.lat}&lon=${coords.lon}&appid=${environment.APIKEY}&units=${units}`;
    return this.http.get<WeatherForecast>(this.baseApiUrl+this.weatherForecastApiUrl+query)
  }

  private getWeatherForecast(coords: Coord, units: string = 'metric') {
    this.getFutureForecast(coords, units).pipe(
      map((forecast: WeatherForecast) => forecast.list),
      tap((weather: WeatherData[]) => this.weatherForecast$.next(weather)),
      takeUntil(this.ngUnsubscribe),
      catchError((error) => of([]))
    ).subscribe();
  }
}
