import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { WeatherData } from '../models/weather';
import { Observable, distinctUntilChanged, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private baseApiUrl = 'https://api.openweathermap.org/data/2.5';
  private geolocationAPIURL = '/weather'
  
  constructor(private http: HttpClient) { }

  public dispatch() {
    return this.getLocation().pipe(
      distinctUntilChanged(),
      tap((coords: GeolocationPosition) => this.saveCoordinates(coords)),
      switchMap((location: GeolocationPosition) => this.getCurrentWeatherByCoords(location)),
    );
  }

  private getCurrentWeatherByCoords(position: GeolocationPosition) {
    const query = `?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${environment.APIKEY}`;
    return this.http.get<WeatherData>(this.baseApiUrl+this.geolocationAPIURL+query);
  }

  private getCurrentWeatherByName(location: string): Observable<WeatherData> {
    const query = `?q=${location}&appid=${environment.APIKEY}`;
    return this.http.get<WeatherData>(this.baseApiUrl+this.geolocationAPIURL+query);
  }

  private getLocation(): Observable<GeolocationPosition> {
    const savedCoordinates = this.getSavedCoordinates();
    return savedCoordinates 
    ? of(savedCoordinates) 
    : new Observable((observer) => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
              observer.next(position);
              observer.complete();
            },
            (error: GeolocationPositionError) => {
              observer.error(error);
            }
        );
      });
  }

  private saveCoordinates(coords: GeolocationPosition): void {
    localStorage.setItem('coords', JSON.stringify(coords));
  }

  private getSavedCoordinates(): GeolocationPosition | null {
    const savedCoords = localStorage.getItem('coords');
    return savedCoords ? JSON.parse(savedCoords) : null;
  }
}
