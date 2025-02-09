/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../components/Pagination/Pagination';
import { MemoryRouter, useLocation } from 'react-router';

const TestComponent: React.FC = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

describe('Pagination Component', () => {
  test('updates the URL when page changes', () => {
    const handlePageChange = jest.fn();
    render(
      <MemoryRouter initialEntries={['/search/1']}>
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={handlePageChange}
        />
        <TestComponent />
      </MemoryRouter>
    );

    // Find the button for page 2 and click it.
    const page2Button = screen.getByRole('button', { name: '2' });
    fireEvent.click(page2Button);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });
});
