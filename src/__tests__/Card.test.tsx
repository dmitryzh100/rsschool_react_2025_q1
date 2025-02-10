/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { Character } from '../types/types';
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
          <tr style={{ cursor: 'pointer' }} onClick={() => {}}>
            <td>{char.name}</td>
          </tr>
        )}
      />
    );

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
  });

  test('clicking on a card triggers the onClick callback', () => {
    const handleClick = jest.fn();

    render(
      <CardList<Character>
        results={mockCharacters}
        renderItem={(char) => (
          <tr
            style={{ cursor: 'pointer' }}
            onClick={() => handleClick(char.url)}
          >
            <td>{char.name}</td>
          </tr>
        )}
      />
    );

    const lukeCell = screen.getByText('Luke Skywalker');
    const row = lukeCell.closest('tr');
    expect(row).toBeInTheDocument();

    if (row) {
      fireEvent.click(row);
    }

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith('https://swapi.dev/api/people/1/');
  });

  test('clicking triggers an additional API call to fetch detailed information', async () => {
    const getCharacterDetailsSpy = jest
      .spyOn(SWAPIService.prototype, 'getCharacterDetails')
      .mockResolvedValue(mockCharacterDetail);

    render(
      <CardList<Character>
        results={mockCharacters}
        renderItem={(char) => (
          <tr
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const id = char.url.split('/').filter(Boolean).pop();
              if (id) {
                const service = new SWAPIService();
                service.getCharacterDetails(id);
              }
            }}
          >
            <td>{char.name}</td>
          </tr>
        )}
      />
    );

    const lukeCell = screen.getByText('Luke Skywalker');
    const row = lukeCell.closest('tr');
    expect(row).toBeInTheDocument();
    if (row) {
      fireEvent.click(row);
    }

    await Promise.resolve();

    expect(getCharacterDetailsSpy).toHaveBeenCalledTimes(1);
    expect(getCharacterDetailsSpy).toHaveBeenCalledWith('1');
  });
});
