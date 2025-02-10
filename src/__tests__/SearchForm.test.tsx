/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchForm from '../layout/SearchForm/SearchForm';

describe('SearchForm Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('clicking the Search button saves the entered value to the local storage', async () => {
    const onSearchMock = jest.fn((value: string) => {
      localStorage.setItem('searchTerm', value);
    });

    render(
      <SearchForm searchTerm="" isLoading={false} onSearch={onSearchMock} />
    );

    const input = screen.getByPlaceholderText(
      'Enter character name'
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Darth Vader' } });

    const button = screen.getByRole('button', { name: /Search/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(onSearchMock).toHaveBeenCalledWith('Darth Vader');
    expect(localStorage.getItem('searchTerm')).toBe('Darth Vader');
  });

  test('component retrieves the value from the local storage upon mounting', () => {
    localStorage.setItem('searchTerm', 'Yoda');

    render(
      <SearchForm
        searchTerm={localStorage.getItem('searchTerm') || ''}
        isLoading={false}
        onSearch={() => {}}
      />
    );

    const input = screen.getByPlaceholderText(
      'Enter character name'
    ) as HTMLInputElement;
    expect(input.value).toBe('Yoda');
  });
});
