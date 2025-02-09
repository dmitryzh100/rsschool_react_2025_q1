/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import MyErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

// Mock the Fallback component so we can assert its render
jest.mock('../components/Fallback/Fallback', () => ({
  __esModule: true,
  default: () => <div data-testid="fallback">Fallback Component</div>,
}));

describe('MyErrorBoundary', () => {
  // Suppress error logging from React when a component throws.
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders children when no error is thrown', () => {
    render(
      <MyErrorBoundary>
        <div data-testid="child">Child component</div>
      </MyErrorBoundary>
    );

    // Expect the child content to be present.
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  test('handleRefresh calls window.location.reload', () => {
    const reloadMock = jest.fn();
    const originalLocation = window.location;

    // Override window.location with a custom object containing our mock.
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { ...window.location, reload: reloadMock },
    });

    // Create an instance of MyErrorBoundary and call handleRefresh.
    const instance = new MyErrorBoundary({ children: null });
    instance.handleRefresh();

    expect(reloadMock).toHaveBeenCalled();

    // Restore window.location.
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
  });
});
