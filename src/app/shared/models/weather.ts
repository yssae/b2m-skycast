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
    dt_txt? :string,
}

export interface Coord {
    lon: number;
    lat: number;
}

export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export  interface MainWeatherData {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
}

export interface Wind {
    speed: number;
    deg: number;
    gust: number;
}

export interface Clouds {
    all: number;
}

export interface Sys {
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


export interface WeatherForecast {
    cod: string;
    message: number;
    cnt: number;
    list: WeatherData[],
    city: City,
}

export interface City {
    id: number;
    name: string;
    coord: {
        lat: number;
        lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
}