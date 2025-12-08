import React, { useState } from "react";

const SortMovies: React.FC<{ handleSortChange: (newSortBy: string) => void }> = ({ handleSortChange }) => {
  const [sortBy, setSortBy] = useState<string>('release_date');
  
  return (
    <div>
        <label htmlFor="sort-select">Sort BY:</label>
        <select 
          id="sort-select"
          value={sortBy} 
          onChange={(e) => { handleSortChange(e.target.value); setSortBy(e.target.value); }}
        >
          <option value="release_date">Release Date</option>
          <option value="title">Title</option>
        </select>
    </div>
  );
};

export default SortMovies;