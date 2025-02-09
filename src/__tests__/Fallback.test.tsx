/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import Fallback from '../components/Fallback/Fallback';

describe('Fallback Component', () => {
  test('renders the fallback UI', () => {
    render(<Fallback />);

    // Check that the expected texts are rendered.
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(
      screen.getByText('Please try refreshing the page or searching again.')
    ).toBeInTheDocument();

    // Check that the "Back" button is present.
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
  });

  test('clicking the Back button calls window.location.reload', () => {
    const reloadMock = jest.fn();
    const originalLocation = window.location;

    // Override window.location with a new object that has a mocked reload method.
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { ...window.location, reload: reloadMock },
    });

    render(<Fallback />);
    const button = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(button);

    expect(reloadMock).toHaveBeenCalled();

    // Restore the original window.location to avoid affecting other tests.
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
  });
});
