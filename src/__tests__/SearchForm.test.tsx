/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from '../layout/SearchForm/SearchForm';

describe('SearchForm Component', () => {
  // Clear local storage before each test to ensure a clean slate.
  beforeEach(() => {
    localStorage.clear();
  });

  test('clicking the Search button saves the entered value to the local storage', () => {
    // Create a mock onSearch callback that saves the value to local storage.
    const onSearchMock = jest.fn((value: string) => {
      localStorage.setItem('searchTerm', value);
    });

    // Render the component with an empty initial searchTerm.
    render(
      <SearchForm searchTerm="" isLoading={false} onSearch={onSearchMock} />
    );

    // Get the input element by its placeholder text.
    const input = screen.getByPlaceholderText(
      'Enter character name'
    ) as HTMLInputElement;
    // Simulate entering a new search term.
    fireEvent.change(input, { target: { value: 'Darth Vader' } });

    // Get the Search button (by its role and accessible name).
    const button = screen.getByRole('button', { name: /Search/i });
    // Simulate clicking the Search button.
    fireEvent.click(button);

    // Verify that the onSearch callback was called with the entered value.
    expect(onSearchMock).toHaveBeenCalledWith('Darth Vader');
    // Verify that the entered value was saved to local storage.
    expect(localStorage.getItem('searchTerm')).toBe('Darth Vader');
  });

  test('component retrieves the value from the local storage upon mounting', () => {
    // Prepopulate local storage with a search term.
    localStorage.setItem('searchTerm', 'Yoda');

    // When mounting, pass the stored value as the searchTerm prop.
    render(
      <SearchForm
        searchTerm={localStorage.getItem('searchTerm') || ''}
        isLoading={false}
        onSearch={() => {}}
      />
    );

    // Verify that the input field is initialized with the stored value.
    const input = screen.getByPlaceholderText(
      'Enter character name'
    ) as HTMLInputElement;
    expect(input.value).toBe('Yoda');
  });
});
