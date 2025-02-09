import React from 'react';
import Card from '../Card/Card';
import './style.scss';

interface CardListProps<T> {
  results: Array<T>;
  renderItem: (item: T) => React.ReactNode;
}

const CardList = <T,>({
  results,
  renderItem,
}: CardListProps<T>): React.ReactElement => {
  return (
    <div className="card-list-container">
      {results.length > 0 ? (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Character Name</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <Card key={index} item={item} renderItem={renderItem} />
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-results">No results found</p>
      )}
    </div>
  );
};

export default CardList;
