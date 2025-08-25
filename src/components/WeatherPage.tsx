import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getWeatherByCity } from '../service/weather'

interface WeatherData {
  location: string
  temperature: number
  humidity: number
  windSpeed: number
}

const WeatherPage = () => {
  const { location } = useParams<{ location: string }>()
  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    if (location) {
      getWeatherByCity(location).then((data) => {
        setWeather({
          location: data.name,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
        })
      })
    }
  }, [location])

  if (!weather) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</p>

  return (
    <div className="weather-card">
      <h2 className="weather-location">{weather.location}</h2>
      <p>Temperature: {weather.temperature}°C</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind Speed: {weather.windSpeed} km/h</p>
    </div>
  )
}

export default WeatherPage
