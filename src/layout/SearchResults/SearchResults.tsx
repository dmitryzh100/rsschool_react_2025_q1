import React from 'react';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';
import ErrorMsg from '../../components/ErrorMsg/ErrorMsg';
import CardList from '../../components/CardList/CardList';
import { Character } from '../../types/types';
import './style.scss';
import Pagination from '../../components/Pagination/Pagination';

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  results: Character[];
  totalPages: number;
  onTriggerError: () => void;
  onItemClick: (characterId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  isLoading,
  error,
  results,
  totalPages,
  onTriggerError,
  onItemClick,
}) => {
  return (
    <>
      <h2>Search Results</h2>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorMsg error={error} />
      ) : (
        <>
          <CardList<Character>
            results={results}
            renderItem={(char) => (
              <tr
                style={{ cursor: 'pointer' }}
                onClick={() => onItemClick(char.url)}
              >
                <td>{char.name}</td>
              </tr>
            )}
          />
          {totalPages > 1 && (
            <>
              <div className="pagination-container">
                <Pagination totalPages={totalPages} />
              </div>
            </>
          )}
        </>
      )}
      <div className="error-button-conatiner">
        <Button
          onClick={onTriggerError}
          className="error-button"
          disabled={isLoading}
        >
          Throw Error
        </Button>
      </div>
    </>
  );
};

export default SearchResults;
