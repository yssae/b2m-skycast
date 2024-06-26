import { WeatherFormatPipe } from './weather-format.pipe';

describe('WeatherFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new WeatherFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
