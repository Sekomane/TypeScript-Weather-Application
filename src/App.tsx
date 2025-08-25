import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/HomePage'
import WeatherPage from './components/WeatherPage'

function App() {
  return (
    <BrowserRouter basename="/TypeScript-Weather-Application/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weather/:location" element={<WeatherPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
