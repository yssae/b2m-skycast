import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  
  constructor() { }

  public getLocation(): Observable<GeolocationPosition> {
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

  public saveCoordinates(coords: GeolocationPosition): void {
    localStorage.setItem('coords', JSON.stringify(coords));
  }

  public getSavedCoordinates(): GeolocationPosition | null {
    const savedCoords = localStorage.getItem('coords');
    return savedCoords ? JSON.parse(savedCoords) : null;
  }

}
