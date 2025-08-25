import { Routes, Route } from 'react-router-dom'
import Home from './components/HomePage'
import WeatherPage from './components/WeatherPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather/:location" element={<WeatherPage />} />
    </Routes>
  )
}

export default App
