import { useRef } from 'react';
import './GenreChips.css';

const GenreChips = ({ genres, selectedGenre, onSelect }) => {
  const scrollRef = useRef(null);

  return (
    <div className="genre-chips">
      <div className="genre-chips__scroll" ref={scrollRef}>
        <button
          className={`genre-chip ${!selectedGenre ? 'genre-chip--active' : ''}`}
          onClick={() => onSelect(null)}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genre-chip ${selectedGenre === genre.id ? 'genre-chip--active' : ''}`}
            onClick={() => onSelect(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreChips;
