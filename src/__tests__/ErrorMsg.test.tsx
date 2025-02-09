/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import ErrorMsg from '../components/ErrorMsg/ErrorMsg';

describe('ErrorMsg Component', () => {
  const errorDetail = 'Network Error';

  test('renders the static error message text', () => {
    render(<ErrorMsg error={errorDetail} />);

    // Verify that the default error message is displayed.
    expect(
      screen.getByText(/Ooops! Something wrong happened/i)
    ).toBeInTheDocument();
  });

  test('displays the error details passed via props', () => {
    render(<ErrorMsg error={errorDetail} />);

    // Verify that the error details text is rendered.
    expect(
      screen.getByText(new RegExp(`Error details: ${errorDetail}`, 'i'))
    ).toBeInTheDocument();
  });

  test('has the correct CSS class applied', () => {
    const { container } = render(<ErrorMsg error={errorDetail} />);

    // Assuming that the top-level element in ErrorMsg should have the "error" class.
    expect(container.firstChild).toHaveClass('error');
  });
});
