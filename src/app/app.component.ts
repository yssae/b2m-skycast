import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';

import { GeolocationService } from './shared/services/geolocation.service';

import { WeatherData } from './shared/models/weather';
import { weather } from './shared/constants';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'skycast';
  private ngUnsubscribe = new Subject<void>();
  public background: string = 'assets/clear-blue-sky.jpg';

  constructor(private geolocationService: GeolocationService) {
  }
 
  ngOnInit(): void {
    console.log(environment);
    this.geolocationService.dispatch()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: WeatherData) => {
        this.setBackground(response)
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  private setBackground(weatherData: WeatherData): void {
    this.background = `assets/${weather.find(item => item.weatherCodes.includes(weatherData.weather[0].main.toLowerCase()))?.background}` ?? '';
  }
}
