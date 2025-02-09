/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { Character } from '../types/types';
import CharacterRow from '../components/CharacterRow/CharacterRow';
import CardList from '../components/CardList/CardList';

import {
  mockCharacters,
  mockCharacterDetail,
} from '../__tests__/mockData/mockData';
import SWAPIService from '../service/SWAPIService';

describe('CardList Component', () => {
  test('renders the relevant card data', () => {
    render(
      <CardList<Character>
        results={mockCharacters}
        renderItem={(char) => (
          <CharacterRow
            item={char}
            // The onClick is not relevant for this test so we can use a no-op.
            onClick={() => {}}
            style={{ cursor: 'pointer' }}
          />
        )}
      />
    );

    // Check that the cell containing "Luke Skywalker" is rendered.
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
  });

  test('clicking on a card triggers the onClick callback', () => {
    const handleClick = jest.fn();

    render(
      <CardList<Character>
        results={mockCharacters}
        renderItem={(char) => (
          <CharacterRow
            item={char}
            // Use the test-specific handleClick callback.
            onClick={() => handleClick(char.url)}
            style={{ cursor: 'pointer' }}
          />
        )}
      />
    );

    // Locate the cell with "Luke Skywalker"
    const lukeCell = screen.getByText('Luke Skywalker');
    // Find the closest <tr> ancestor – this is our clickable card row.
    const row = lukeCell.closest('tr');
    expect(row).toBeInTheDocument();

    // Simulate a click on the card row.
    if (row) {
      fireEvent.click(row);
    }

    // Verify that handleClick was called exactly once with Luke's URL.
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith('https://swapi.dev/api/people/1/');
  });

  test('clicking triggers an additional API call to fetch detailed information', async () => {
    // Spy on the getCharacterDetails method.
    const getCharacterDetailsSpy = jest
      .spyOn(SWAPIService.prototype, 'getCharacterDetails')
      .mockResolvedValue(mockCharacterDetail);

    render(
      <CardList<Character>
        results={mockCharacters}
        renderItem={(char) => (
          <CharacterRow
            item={char}
            // When the card is clicked, call getCharacterDetails.
            onClick={() => {
              // Extract the character id from the URL.
              // For example, if char.url === 'https://swapi.dev/api/people/1/',
              // this returns "1".
              const id = char.url.split('/').filter(Boolean).pop();
              if (id) {
                const service = new SWAPIService();
                service.getCharacterDetails(id);
              }
            }}
            style={{ cursor: 'pointer' }}
          />
        )}
      />
    );

    // Simulate clicking on the card for "Luke Skywalker".
    const lukeCell = screen.getByText('Luke Skywalker');
    const row = lukeCell.closest('tr');
    expect(row).toBeInTheDocument();
    if (row) {
      fireEvent.click(row);
    }

    // Wait for any pending promises to resolve.
    // (You could also use waitFor if needed; here we rely on the mock resolution.)
    await Promise.resolve();

    // Verify that getCharacterDetails was called once with the extracted id.
    expect(getCharacterDetailsSpy).toHaveBeenCalledTimes(1);
    expect(getCharacterDetailsSpy).toHaveBeenCalledWith('1');
  });
});
