import React from 'react';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';
import ErrorMsg from '../../components/ErrorMsg/ErrorMsg';
import CharacterRow from '../../components/CharacterRow/CharacterRow';
import CardList from '../../components/CardList/CardList';
import { type Character } from '../../types/types';

import './style.scss';

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  results: Character[];
  onTriggerError: () => void;
}

class SearchResults extends React.Component<SearchResultsProps> {
  render() {
    const { isLoading, error, results, onTriggerError } = this.props;

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
            renderItem={(char) => <CharacterRow item={char} />}
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
  }
}

export default SearchResults;
