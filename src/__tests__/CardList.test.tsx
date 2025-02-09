/// <reference types="@testing-library/jest-dom" />
import { render, screen, within } from '@testing-library/react';
import CardList from '../components/CardList/CardList';
import { Character } from '../types/types';
import CharacterRow from '../components/CharacterRow/CharacterRow';

import { mockCharacters } from './mockData/mockData';

describe('CardList Component', () => {
  const onItemClick = jest.fn();

  test('renders the specified number of cards as table rows', () => {
    render(
      <CardList<Character>
        results={mockCharacters}
        renderItem={(char) => (
          <CharacterRow
            item={char}
            onClick={() => onItemClick(char.url)}
            style={{ cursor: 'pointer' }}
          />
        )}
      />
    );

    const table = screen.getByRole('table');

    const rows = within(table).getAllByRole('row');

    expect(rows.slice(1)).toHaveLength(mockCharacters.length);
  });

  test('displays an appropriate message when no cards are present', () => {
    render(
      <CardList<Character>
        results={[]}
        renderItem={(char) => (
          <CharacterRow
            item={char}
            onClick={() => onItemClick(char.url)}
            style={{ cursor: 'pointer' }}
          />
        )}
      />
    );

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });
});
