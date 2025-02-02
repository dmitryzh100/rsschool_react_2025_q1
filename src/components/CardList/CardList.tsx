import React from 'react';
import Card from '../Card/Card';

import './style.scss';

interface CardListProps<T> {
  results: Array<T>;
  renderItem: (item: T) => React.ReactNode;
}

class CardList<T> extends React.Component<CardListProps<T>> {
  render() {
    return (
      <div className="card-list-container">
        {this.props.results.length > 0 ? (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Character Name</th>
                <th>Character Description</th>
              </tr>
            </thead>
            <tbody>
              {this.props.results.map((item, index) => (
                <Card
                  key={index}
                  item={item}
                  renderItem={this.props.renderItem}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-results">No results found</p>
        )}
      </div>
    );
  }
}

export default CardList;
