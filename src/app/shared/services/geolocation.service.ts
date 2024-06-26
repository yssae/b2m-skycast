import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Coord } from '../models/weather';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  public coords$ = new BehaviorSubject<Coord | null>(null);

  constructor() { 
    this.getLocation();
  }

  public getCoords$(): Observable<Coord | null> {
    return this.coords$.asObservable();
  }

  public getLocation(): void {
    const savedCoordinates = this.getSavedCoordinates();
    if (savedCoordinates) {
      this.coords$.next(savedCoordinates);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const coords = { lat: position.coords.latitude, lon: position.coords.longitude };
          console.log('coords geo', coords)
          this.coords$.next(coords);
        },
        (error: GeolocationPositionError) => {
          console.error(error);
        }
      );
    }
  }

  public saveCoordinates(coords: Coord): void {
    localStorage.setItem('coords', JSON.stringify(coords));
  }

  public clearCoordinates(): void {
    localStorage.removeItem('coords');
  }

  public getSavedCoordinates(): Coord | null {
    const savedCoords = localStorage.getItem('coords');
    return savedCoords ? JSON.parse(savedCoords) : null;
  }

}
