import React from "react";

interface SortMoviesProps {
  sortBy: string;
  handleSortChange: (newSortBy: string) => void;
}

const SortMovies: React.FC<SortMoviesProps> = ({ sortBy, handleSortChange }) => {
  return (
    <div>
        <label htmlFor="sort-select">Sort BY:</label>
        <select 
          id="sort-select"
          value={sortBy} 
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="release_date">Release Date</option>
          <option value="title">Title</option>
        </select>
    </div>
  );
};

export default SortMovies;