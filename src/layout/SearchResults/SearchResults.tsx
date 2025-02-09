import React from 'react';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';
import ErrorMsg from '../../components/ErrorMsg/ErrorMsg';
import CharacterRow from '../../components/CharacterRow/CharacterRow';
import CardList from '../../components/CardList/CardList';
import { Character } from '../../types/types';
import './style.scss';

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  results: Character[];
  onTriggerError: () => void;
  onItemClick: (characterId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  isLoading,
  error,
  results,
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
        <CardList<Character>
          results={results}
          renderItem={(char) => (
            <CharacterRow
              item={char}
              onClick={() => onItemClick(char.url)}
              style={{ cursor: 'pointer' }}
            />
          )}
        />
      )}
      <Button
        onClick={onTriggerError}
        className="error-button"
        disabled={isLoading}
      >
        Throw Error
      </Button>
    </>
  );
};

export default SearchResults;
