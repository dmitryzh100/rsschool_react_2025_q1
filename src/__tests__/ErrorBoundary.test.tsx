/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import MyErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

jest.mock('../components/Fallback/Fallback', () => ({
  __esModule: true,
  default: () => <div data-testid="fallback">Fallback Component</div>,
}));

describe('MyErrorBoundary', () => {
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

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  test('handleRefresh calls window.location.reload', () => {
    const reloadMock = jest.fn();
    const originalLocation = window.location;

    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { ...window.location, reload: reloadMock },
    });

    const instance = new MyErrorBoundary({ children: null });
    instance.handleRefresh();

    expect(reloadMock).toHaveBeenCalled();

    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
  });
});
