import React from 'react';
import { Outlet, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import SearchForm from '../searchForm/SearchForm';

interface SearchPageProps {
  initialQuery: string;
  onSearch: (query: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ initialQuery, onSearch }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  const showSearchForm = location.pathname === '/';

  const handleAddMovie = () => {
    const paramsString = searchParams.toString();
    navigate(`/new${paramsString ? `?${paramsString}` : ''}`);
  };

  return (
    <>
      {showSearchForm && (
        <>
          <span>SEARCH</span>
          <SearchForm initialQuery={initialQuery} onSearch={onSearch} />
          <section>
            <button onClick={handleAddMovie}>+ Add Movie</button>
          </section>
        </>
      )}
      
      {/* Outlet for nested routes (AddMovieForm) */}
      <Outlet />
    </>
  );
};

export default SearchPage;
