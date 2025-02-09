import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Outlet, useMatch } from 'react-router';
import SearchForm from '../../layout/SearchForm/SearchForm';
import SWAPIService from '../../service/SWAPIService';
import { Character } from '../..//types/types';
import Header from '../../components/Header/Header';
import Main from '../../components/Main/Main';
import SearchResults from '../../layout/SearchResults/SearchResults';
import Pagination from '../../components/Pagination/Pagination';
import useLocalStorage from '../../hooks/useLocalStorage';

const MainPage: React.FC = () => {
  // Create a single instance of the service.
  const searchServiceRef = useRef(new SWAPIService());

  // Manage the search term via a custom hook that syncs with localStorage.
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');

  const [results, setResults] = useState<Character[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get the current page from the route params.
  const { page } = useParams<{ page: string }>();
  const currentPage = page ? parseInt(page, 10) : 1;
  const navigate = useNavigate();

  // Determine if the details route is active.
  const matchDetails = useMatch('/search/:page/details/:characterId');

  const fetchData = async (inputValue: string, page: number) => {
    setIsLoading(true);
    setError(null);
    const response = await searchServiceRef.current.search(inputValue, page);
    if ('error' in response) {
      setError(response.errorInfo);
      setIsLoading(false);
    } else {
      // The service returns results and pagination info.
      setResults(response.results);
      setTotalPages(response.totalPages);
      setIsLoading(false);
    }
  };

  // Re-fetch data when the search term or current page changes.
  useEffect(() => {
    fetchData(searchTerm, currentPage);
  }, [searchTerm, currentPage]);

  // When a new search is submitted.
  const handleSearch = (inputValue: string) => {
    setSearchTerm(inputValue);
    // Navigate to page 1 (clearing any details route).
    navigate(`/search/1`);
  };

  // Handle pagination.
  const handlePageChange = (newPage: number) => {
    // Navigate to the new page (closing any details pane).
    navigate(`/search/${newPage}`);
  };

  const handleItemClick = (url: string) => {
    const characterId = url.split('/').slice(-2, -1)[0];
    if (matchDetails && matchDetails.params.characterId === characterId) {
      // If the same row is clicked, close the details pane.
      navigate(`/search/${currentPage}`);
    } else {
      // If a different row is clicked, show the details for that row.
      navigate(`/search/${currentPage}/details/${characterId}`);
    }
  };

  return (
    <>
      <Header className="header">
        <SearchForm
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />
      </Header>
      <Main className="main">
        <div style={{ display: 'flex' }}>
          {/* Left Section: Search Results & Pagination */}
          <div style={{ flex: 1 }}>
            <SearchResults
              isLoading={isLoading}
              results={results}
              error={error}
              onTriggerError={() => {}}
              onItemClick={handleItemClick}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
          {/* Right Section: Render details using Outlet if the details route is active */}
          {matchDetails && (
            <div
              style={{
                flex: 1,
                borderLeft: '1px solid #ccc',
                padding: '1rem',
                position: 'relative',
              }}
            >
              <Outlet />
            </div>
          )}
        </div>
      </Main>
    </>
  );
};

export default MainPage;
