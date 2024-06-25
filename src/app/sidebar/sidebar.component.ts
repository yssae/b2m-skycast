import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../shared/services/weather.service';
import { WeatherData } from '../shared/models/weather';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'sc-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();
  public currentWeatherData!: WeatherData;
  
  constructor(public weatherService: WeatherService) {}

  public ngOnInit(): void {
    this.weatherService.currentWeather$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((weather: WeatherData) => {
      this.currentWeatherData = weather;
    });
    this.weatherService.currentAirQualityData$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((air: any) => {
      console.log('air', air)
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  public toggleToCelsius() {
    this.weatherService.isInCelsius$.next(true);
  }

  public toggleToFahrenheit() {
    this.weatherService.isInCelsius$.next(false);
  }


}
