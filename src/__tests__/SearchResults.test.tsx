/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchResults from '../layout/SearchResults/SearchResults';

import { mockCharacters } from './mockData/mockData';

describe('SearchResults Component', () => {
  test('renders spinner when isLoading is true', () => {
    render(
      <SearchResults
        isLoading={true}
        error={null}
        results={[]}
        totalPages={0}
        onTriggerError={jest.fn()}
        onItemClick={jest.fn()}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Throw Error/i })
    ).toBeInTheDocument();
  });

  test('renders error message when error is provided', () => {
    render(
      <SearchResults
        isLoading={false}
        error="Error occurred"
        results={[]}
        totalPages={0}
        onTriggerError={jest.fn()}
        onItemClick={jest.fn()}
      />
    );

    expect(
      screen.getByText(/Ooops! Something wrong happened/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Error details: Error occurred/i)
    ).toBeInTheDocument();
  });

  test('renders CardList when not loading and no error', () => {
    render(
      <SearchResults
        isLoading={false}
        error={null}
        results={mockCharacters}
        totalPages={1}
        onTriggerError={jest.fn()}
        onItemClick={jest.fn()}
      />
    );

    expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
  });

  test('clicking the "Throw Error" button calls onTriggerError callback', () => {
    const onTriggerErrorMock = jest.fn();
    render(
      <SearchResults
        isLoading={false}
        error={null}
        results={mockCharacters}
        totalPages={1}
        onTriggerError={onTriggerErrorMock}
        onItemClick={jest.fn()}
      />
    );

    const errorButton = screen.getByRole('button', {
      name: /Throw Error/i,
    });
    fireEvent.click(errorButton);
    expect(onTriggerErrorMock).toHaveBeenCalledTimes(1);
  });

  test('clicking on a character row calls onItemClick callback with the correct URL', async () => {
    const onItemClickMock = jest.fn();
    render(
      <SearchResults
        isLoading={false}
        error={null}
        results={mockCharacters}
        totalPages={1}
        onTriggerError={jest.fn()}
        onItemClick={onItemClickMock}
      />
    );

    const characterElement = screen.getByText(/Luke Skywalker/i);

    await act(async () => {
      fireEvent.click(characterElement);
    });

    expect(onItemClickMock).toHaveBeenCalledTimes(1);
    expect(onItemClickMock).toHaveBeenCalledWith(
      'https://swapi.dev/api/people/1/'
    );
  });
});
