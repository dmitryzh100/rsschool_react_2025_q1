/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import SearchResults from '../layout/SearchResults/SearchResults';

import { mockCharacters } from './mockData/mockData';

describe('SearchResults Component', () => {
  test('renders spinner when isLoading is true', () => {
    render(
      <SearchResults
        isLoading={true}
        error={null}
        results={[]}
        onTriggerError={jest.fn()}
        onItemClick={jest.fn()}
      />
    );

    // For testing, we assume the Spinner component renders text "Loading..."
    // (Adjust this query if your Spinner renders differently.)
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Also check that the "Throw Error" button is rendered.
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
        onTriggerError={jest.fn()}
        onItemClick={jest.fn()}
      />
    );

    // Verify that the error message from ErrorMsg appears.
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
        onTriggerError={jest.fn()}
        onItemClick={jest.fn()}
      />
    );

    // The header "Search Results" is always rendered.
    expect(screen.getByText(/Search Results/i)).toBeInTheDocument();

    // Verify that the CardList renders a character row.
    // We assume CharacterRow renders the character's name.
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
  });

  test('clicking the "Throw Error" button calls onTriggerError callback', () => {
    const onTriggerErrorMock = jest.fn();
    render(
      <SearchResults
        isLoading={false}
        error={null}
        results={mockCharacters}
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

  test('clicking on a character row calls onItemClick callback with the correct URL', () => {
    const onItemClickMock = jest.fn();
    render(
      <SearchResults
        isLoading={false}
        error={null}
        results={mockCharacters}
        onTriggerError={jest.fn()}
        onItemClick={onItemClickMock}
      />
    );

    // Find the element that shows the character's name.
    // We assume CharacterRow renders the character's name and is clickable.
    const characterElement = screen.getByText(/Luke Skywalker/i);
    fireEvent.click(characterElement);

    // The onItemClick callback should be called with Luke's URL.
    expect(onItemClickMock).toHaveBeenCalledTimes(1);
    expect(onItemClickMock).toHaveBeenCalledWith(
      'https://swapi.dev/api/people/1/'
    );
  });
});
