import { AirQualityDescription } from "./models/weather";

export const WEATHER = [
  {
    background: 'clear-blue-sky.jpg',
    weatherCodes: ["clouds", "clear"]
  },
  {
    background: 'dark-cloudy-sky-jpg',
    weatherCodes: ["atmosphere", "drizzle"]
  },
  {
    background: 'snow.jpg',
    weatherCodes: ["snow"]
  },
  {
    background: 'thunderstorm.jpg',
    weatherCodes: ["rain, thunderstorm"]
  }
];

export const AQI_DESCRIPTION: AirQualityDescription[] = [
  {
    score: 19,
    name: 'Excellent',
    description: 'The air quality is superb, suitable for everyone. Feel free to engage in your usual outdoor activities.'
  },
  {
    score: 49,
    name: 'Fair',
    description: 'The air quality is generally good for most people. However, individuals who are sensitive might experience mild to moderate symptoms from prolonged exposure.'
  },
  {
    score: 99,
    name: 'Poor',
    description: 'The air quality has deteriorated, reaching a high level of pollution. It’s unhealthy for sensitive groups. If you’re experiencing symptoms like difficulty breathing or throat irritation, it’s advisable to reduce your time outdoors.'
  },
  {
    score: 149,
    name: 'Unhealthy',
    description: 'Sensitive groups may feel the health effects immediately. Even healthy individuals might experience breathing difficulties and throat irritation with extended exposure. It’s recommended to limit outdoor activities.'
  },
  {
    score: 249,
    name: 'Very Unhealthy',
    description: 'Sensitive groups will experience health effects immediately and should refrain from outdoor activities. Healthy individuals are also likely to experience breathing difficulties and throat irritation. Consider staying indoors and postponing outdoor activities.'
  },
  {
    score: 250,
    name: 'Dangerous',
    description: 'Exposure to the air, even briefly, can lead to severe health effects for everyone. It’s strongly advised to avoid outdoor activities.'
  },
]