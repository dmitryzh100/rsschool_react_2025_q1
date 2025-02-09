/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Pagination from '../components/Pagination/Pagination';
import { MemoryRouter, useLocation } from 'react-router';

const TestComponent: React.FC = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

describe('Pagination Component', () => {
  test('updates the URL when page changes', async () => {
    render(
      <MemoryRouter initialEntries={['/search/1']}>
        <Pagination totalPages={3} />
        <TestComponent />
      </MemoryRouter>
    );

    // Find the button for page 2 and click it.
    const page2Button = screen.getByRole('button', { name: '2' });
    fireEvent.click(page2Button);

    // Wait for the navigation to occur.
    await waitFor(async () => {
      // Assume TestComponent displays the current pathname, e.g., "/search/2"
      expect(screen.getByText(/\/search\/2/)).toBeInTheDocument();
    });
  });
});
