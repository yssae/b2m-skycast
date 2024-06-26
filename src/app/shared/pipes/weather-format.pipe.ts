import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weatherFormat'
})
export class WeatherFormatPipe implements PipeTransform {

  transform(weatherData: any): string {
    if (!weatherData) return '';

    const country = weatherData.sys.country;
    const timestamp = weatherData.dt;
    const dateObj = new Date(timestamp * 1000);
    const formattedDate = dateObj.toLocaleString('en-US', {
      timeZone: 'Asia/Manila',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    return `${country}, ${formattedDate}`;
  }

}
