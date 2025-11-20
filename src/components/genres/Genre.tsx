import React from 'react';

interface GenreProps {
  genre: string
  selectedGenre: string
  onSelect: (genre: string) => void
}

const Genre: React.FC<GenreProps> = ({genre, selectedGenre, onSelect}) => {

  return (
      <>

          <li key={genre} style={{listStyle:'none'}}>
            <button
              onClick={() => onSelect(genre)}
              style={genre===selectedGenre ? { backgroundColor:"red"} : {}}
            >
              {genre}
            </button>
          </li>

    </>
  )
}

export default Genre;