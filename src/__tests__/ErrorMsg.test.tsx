/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import ErrorMsg from '../components/ErrorMsg/ErrorMsg';

describe('ErrorMsg Component', () => {
  const errorDetail = 'Network Error';

  test('renders the static error message text', () => {
    render(<ErrorMsg error={errorDetail} />);

    expect(
      screen.getByText(/Ooops! Something wrong happened/i)
    ).toBeInTheDocument();
  });

  test('displays the error details passed via props', () => {
    render(<ErrorMsg error={errorDetail} />);

    expect(
      screen.getByText(new RegExp(`Error details: ${errorDetail}`, 'i'))
    ).toBeInTheDocument();
  });

  test('has the correct CSS class applied', () => {
    const { container } = render(<ErrorMsg error={errorDetail} />);

    expect(container.firstChild).toHaveClass('error');
  });
});
