import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { WeatherService } from './weather.service';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  
  constructor(
    private http: HttpClient,
    private weatherService: WeatherService,
  ) { }

  public dispatch() {
    return this.getLocation().pipe(
      distinctUntilChanged(),
      tap((coords: GeolocationPosition) => this.saveCoordinates(coords)),
      switchMap((location: GeolocationPosition) => this.weatherService.getCurrentWeatherByCoords(location)),
    );
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
