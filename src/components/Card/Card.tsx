import React from 'react';

interface CardProps<T> {
  item: T;
  renderItem: (item: T) => React.ReactNode;
}

class Card<T> extends React.Component<CardProps<T>> {
  render() {
    return <>{this.props.renderItem(this.props.item)}</>;
  }
}

export default Card;
