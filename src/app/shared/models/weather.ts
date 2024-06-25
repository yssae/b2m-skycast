export interface WeatherData {
    coord: Coord;
    weather: Weather[];
    base: string;
    main: MainWeatherData;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: Sys;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

interface Coord {
    lon: number;
    lat: number;
}

interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface MainWeatherData {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
}

interface Wind {
    speed: number;
    deg: number;
    gust: number;
}

interface Clouds {
    all: number;
}

interface Sys {
    type?: number,
    id?: number,
    country: string;
    sunrise: number;
    sunset: number;
}

export interface AirQualityDescription {
    score: number,
    name: string,
    description: string
}

export interface AirPollutionData {
    coord: {
        lon: number;
        lat: number;
    };
    list: {
        main: {
            aqi: number;
        };
        components: {
            co: number;
            no: number;
            no2: number;
            o3: number;
            so2: number;
            pm2_5: number;
            pm10: number;
            nh3: number;
        };
        dt: number;
    }[],
    aqiDescription?: AirQualityDescription
}