import { useEffect, useState } from 'react'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import LocationList from '../components/LocationList'
import { getWeatherByCity, getWeatherByCoords, getWeatherForecastByCity } from '../service/weather'

interface WeatherData {
  location: string
  temperature: number
  humidity: number
  windSpeed: number
  icon: string
  description: string
}

interface ForecastItem {
  dt_txt: string
  main: {
    temp: number
    humidity: number
  }
  wind: {
    speed: number
  }
  weather: {
    icon: string
    description: string
  }[]
}

const HomePage = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastItem[]>([])
  const [savedLocations, setSavedLocations] = useState<string[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [unit, setUnit] = useState<'C' | 'F'>('C')
  const [viewMode, setViewMode] = useState<'daily' | 'hourly'>('daily')

  // Toggle theme
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  // Toggle units
  const toggleUnit = () => setUnit(prev => (prev === 'C' ? 'F' : 'C'))

  // Convert temperature
  const displayTemp = (tempC: number) =>
    unit === 'C' ? tempC.toFixed(1) : ((tempC * 9) / 5 + 32).toFixed(1)

  // Save location to localStorage
  const handleSaveLocation = (location: string) => {
    setSavedLocations(prev => {
      if (!prev.includes(location)) {
        const updated = [...prev, location]
        localStorage.setItem('savedLocations', JSON.stringify(updated))
        return updated
      }
      return prev
    })
  }

  // Clear saved locations
  const clearSavedLocations = () => {
    setSavedLocations([])
    localStorage.removeItem('savedLocations')
  }

  // Fetch weather by city
  const fetchWeather = async (location: string) => {
    try {
      const data = await getWeatherByCity(location)
      const weatherData: WeatherData = {
        location: data.name,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
        description: data.weather[0].description,
      }
      setWeather(weatherData)
      localStorage.setItem('lastWeather', JSON.stringify(weatherData))
      handleSaveLocation(location)
      fetchForecast(location)
    } catch (err) {
      console.error('Error fetching weather:', err)
      alert('Could not fetch weather. Please check the location name.')
    }
  }

  // Fetch forecast by city
  const fetchForecast = async (location: string) => {
    try {
      const data = await getWeatherForecastByCity(location)
      setForecast(data.list)
    } catch (err) {
      console.error('Error fetching forecast:', err)
    }
  }

  // Fetch weather using geolocation
  const fetchUserLocation = () => {
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords
      try {
        const data = await getWeatherByCoords(latitude, longitude)
        const weatherData: WeatherData = {
          location: data.name,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          icon: data.weather[0].icon,
          description: data.weather[0].description,
        }
        setWeather(weatherData)
        localStorage.setItem('lastWeather', JSON.stringify(weatherData))
        handleSaveLocation(data.name)
        fetchForecast(data.name)
      } catch (err) {
        console.error('Error fetching geolocation weather:', err)
      }
    })
  }

  // Daily forecast aggregation
  const getDailyForecast = (hourly: ForecastItem[]) => {
    const dailyMap: Record<string, ForecastItem[]> = {}
    hourly.forEach(item => {
      const day = item.dt_txt.split(' ')[0]
      if (!dailyMap[day]) dailyMap[day] = []
      dailyMap[day].push(item)
    })
    return Object.entries(dailyMap).map(([day, items]) => {
      const avgTemp =
        items.reduce((sum, i) => sum + i.main.temp, 0) / items.length
      const avgHumidity =
        items.reduce((sum, i) => sum + i.main.humidity, 0) / items.length
      const icon = items[0].weather[0].icon
      const description = items[0].weather[0].description
      return {
        dt_txt: day,
        main: { temp: avgTemp, humidity: avgHumidity },
        wind: { speed: items[0].wind.speed },
        weather: [{ icon, description }],
      } as ForecastItem
    })
  }

  // Format date for Daily forecast
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  // Format hourly time
  const formatHour = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
  }

  useEffect(() => {
    const cachedWeather = localStorage.getItem('lastWeather')
    if (cachedWeather) {
      const parsed = JSON.parse(cachedWeather)
      setWeather(parsed)
      fetchForecast(parsed.location)
    } else {
      fetchUserLocation()
    }

    const storedLocations = localStorage.getItem('savedLocations')
    if (storedLocations) setSavedLocations(JSON.parse(storedLocations))
  }, [])

  const displayForecast =
    viewMode === 'daily' ? getDailyForecast(forecast) : forecast

  return (
    <div className={`container ${theme}`}>
      <Header />
      <div className="controls">
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
        <button onClick={toggleUnit}>
          Show in {unit === 'C' ? 'Fahrenheit' : 'Celsius'}
        </button>
        <button
          className={viewMode === 'daily' ? 'active' : ''}
          onClick={() => setViewMode('daily')}
        >
          Daily
        </button>
        <button
          className={viewMode === 'hourly' ? 'active' : ''}
          onClick={() => setViewMode('hourly')}
        >
          Hourly
        </button>
      </div>
      <SearchBar onSearch={fetchWeather} />
      <LocationList locations={savedLocations} onSelect={fetchWeather} />
      {savedLocations.length > 0 && (
        <button className="clear-btn" onClick={clearSavedLocations}>
          Clear Recent Searches
        </button>
      )}
      {weather && (
        <div className={`weather-card ${theme}`}>
          <h2>{weather.location}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
          />
          <p>{weather.description}</p>
          <p>Temperature: {displayTemp(weather.temperature)}°{unit}</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.windSpeed} km/h</p>
        </div>
      )}
      {displayForecast.length > 0 && (
        <div className="forecast">
          <h3>{viewMode === 'daily' ? 'Daily Forecast' : 'Hourly Forecast'}</h3>
          <div className="forecast-list">
            {displayForecast
              .slice(0, viewMode === 'daily' ? 7 : 24)
              .map(item => (
                <div key={item.dt_txt} className="forecast-item">
                  <p>{viewMode === 'daily' ? formatDate(item.dt_txt) : formatHour(item.dt_txt)}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt={item.weather[0].description}
                  />
                  <p>{displayTemp(item.main.temp)}°{unit}</p>
                  <p>{item.weather[0].description}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
