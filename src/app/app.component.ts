import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { WeatherService } from './shared/services/weather.service';

import { WeatherData } from './shared/models/weather';
import { WEATHER } from './shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  public background: string = 'assets/clear-blue-sky.jpg';

  constructor(public weatherService: WeatherService) {
  }
 
  public ngOnInit(): void {
    this.weatherService.dispatch()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: WeatherData) => {
        this.setBackground(response)
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  private setBackground(weatherData: WeatherData): void {
    let background: string | undefined;
    const currentTime = weatherData.dt;
    const isPM = currentTime > weatherData.sys.sunset || currentTime < weatherData.sys.sunrise;
    const weatherCondition = weatherData.weather[0].main.toLowerCase();

    if (isPM && ["clear", "clouds"].includes(weatherCondition)) {
      background = 'clear-night-sky.jpg';
    } else {
      const weather = WEATHER.find(item => item.weatherCodes.includes(weatherCondition));
      background = weather?.background ?? 'clear-blue-sky.jpg';
    }

    this.background = `assets/${background}`;
  }
}
