import { Component } from '@angular/core';
import { WeatherService } from '../shared/services/weather.service';

@Component({
  selector: 'sc-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent {

  constructor(public weatherService: WeatherService) {}

}
