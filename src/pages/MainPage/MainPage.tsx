import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Outlet, useMatch } from 'react-router';
import SearchForm from '../../layout/SearchForm/SearchForm';
import SWAPIService from '../../service/SWAPIService';
import { Character } from '../../types/types';
import Header from '../../components/Header/Header';
import Main from '../../components/Main/Main';
import SearchResults from '../../layout/SearchResults/SearchResults';
import useLocalStorage from '../../hooks/useLocalStorage';

import './style.scss';

const MainPage: React.FC = () => {
  const searchServiceRef = useRef(new SWAPIService());

  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');

  const [results, setResults] = useState<Character[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorBoundary, setIsErrorBoundary] = useState<boolean>(false);

  const { page } = useParams<{ page: string }>();
  const currentPage = page ? parseInt(page, 10) : 1;
  const navigate = useNavigate();

  const matchDetails = useMatch('/search/:page/details/:characterId');

  const fetchData = async (inputValue: string, page: number) => {
    setIsLoading(true);
    setError(null);

    const response = await searchServiceRef.current.search(inputValue, page);

    if ('error' in response) {
      setError(response.errorInfo);
      setIsLoading(false);
    } else {
      setResults(response.results);
      setTotalPages(response.totalPages);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchTerm, currentPage);
  }, [searchTerm, currentPage]);

  const handleSearch = (inputValue: string) => {
    setSearchTerm(inputValue);
    navigate(`/search/1`);
  };

  const handleTriggerError = () => {
    setIsErrorBoundary(true);
  };

  const handleItemClick = (url: string) => {
    const characterId = url.split('/').slice(-2, -1)[0];
    if (matchDetails && matchDetails.params.characterId === characterId) {
      navigate(`/search/${currentPage}`);
    } else {
      navigate(`/search/${currentPage}/details/${characterId}`);
    }
  };

  if (isErrorBoundary) {
    throw new Error('Triggered error boundary');
  }

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
        <section className="left-container">
          <SearchResults
            isLoading={isLoading}
            results={results}
            totalPages={totalPages}
            error={error}
            onTriggerError={handleTriggerError}
            onItemClick={handleItemClick}
          />
        </section>
        {matchDetails && (
          <section className="right-containter">
            <Outlet />
          </section>
        )}
      </Main>
    </>
  );
};

export default MainPage;
