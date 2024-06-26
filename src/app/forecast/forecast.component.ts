import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { WeatherService } from '../shared/services/weather.service';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { WeatherData } from '../shared/models/weather';
@Component({
  selector: 'sc-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public weatherForecasts$!: Observable<WeatherData[]>;
  public pageSize: number = 7;

  constructor(public weatherService: WeatherService) {
    this.weatherForecasts$ = this.weatherService.weatherForecast$;
  }

  ngAfterViewInit(): void {
    this.weatherService.weatherForecast$.subscribe(forecasts => {
      if (this.paginator) {
        this.paginator.length = forecasts.length;
      }
    });
  }

}
