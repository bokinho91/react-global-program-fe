import React, { useState } from "react"

interface SearchFormProps {
  initialQuery: string
  onSearch: (query: string) => void
}

const SearchForm: React.FC<SearchFormProps> = ({ initialQuery, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchQuery)
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="What do you want to watch?"
        value={searchQuery}
        onChange={({target}) => setSearchQuery(target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchForm