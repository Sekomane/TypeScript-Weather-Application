import React from 'react'

interface LocationListProps {
  locations: string[]
  onSelect: (location: string) => void
}

const LocationList: React.FC<LocationListProps> = ({ locations, onSelect }) => {
  if (locations.length === 0) return null

  return (
    <div className="location-list">
      <h3>Saved Locations</h3>
      <ul>
        {locations.map((loc, idx) => (
          <li key={idx}>
            <button onClick={() => onSelect(loc)}>{loc}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LocationList
