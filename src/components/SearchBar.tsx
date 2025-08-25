import React, { useState } from 'react'

interface SearchBarProps {
  onSearch: (location: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    if (query.trim() !== '') onSearch(query)
    setQuery('')
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search location..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchBar
