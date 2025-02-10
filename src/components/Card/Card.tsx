import React from 'react';

interface CardProps<T> {
  item: T;
  renderItem: (item: T) => React.ReactNode;
}

const Card = <T,>({ item, renderItem }: CardProps<T>): React.ReactElement => {
  return <>{renderItem(item)}</>;
};

export default Card;
