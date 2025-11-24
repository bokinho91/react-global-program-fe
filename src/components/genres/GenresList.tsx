import React from 'react';
import Genre from './Genre';

interface GenresProps {
  genreList: string[]
  selectedGenre: string
  onSelect: (genre: string) => void
}

const GenresList: React.FC<GenresProps> = ({genreList, selectedGenre, onSelect}) => {

  return (
    <div>
      <ul style={{display:'flex', flexWrap: 'wrap', gap:'10px', padding:'0'}}>
        {genreList.map((genre) => (
          <Genre genre={genre} selectedGenre={selectedGenre} onSelect={onSelect} key={genre} />
        ))}
      </ul>
    </div>
  )
}

export default GenresList;