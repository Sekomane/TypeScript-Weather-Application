import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Current weather by city
export const getWeatherByCity = async (city: string) => {
  const response = await axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`)
  return response.data
}

// Current weather by coordinates
export const getWeatherByCoords = async (lat: number, lon: number) => {
  const response = await axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
  return response.data
}

// 5-day / 3-hour forecast by city
export const getWeatherForecastByCity = async (city: string) => {
  const response = await axios.get(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`)
  return response.data
}
