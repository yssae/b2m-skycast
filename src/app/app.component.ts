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

  constructor(
    private weatherService: WeatherService,
  ) {
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
    const weather = WEATHER.find(item => {
      const weatherCondition = weatherData.weather[0].main.toLowerCase();
      return item.weatherCodes.includes(weatherCondition);
    });

    this.background = `assets/${weather?.background}` ?? 'assets/clear-blue-sky.jpg';
  }
}
