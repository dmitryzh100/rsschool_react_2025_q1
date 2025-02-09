/// <reference types="@testing-library/jest-dom" />
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import * as reactRouter from 'react-router';
import { MemoryRouter, Routes, Route } from 'react-router';
import MainPage from '../pages/MainPage/MainPage';
import SWAPIService from '../service/SWAPIService';

import { mockCharacters } from './mockData/mockData';

// Dummy responses for our tests.
const dummySuccessResponse = {
  count: 20,
  next: null,
  previous: null,
  results: mockCharacters,
  totalPages: 2,
};

const dummyErrorResponse = { error: true, errorInfo: 'Some error occurred' };

const mockUseMatch = jest.fn();
const mockedNavigate = jest.fn();

jest.mock('react-router', () => {
  const actual = jest.requireActual('react-router');
  return {
    __esModule: true,
    ...actual,
    useMatch: () => mockUseMatch,
    useNavigate: () => mockedNavigate,
  };
});

describe('MainPage Component', () => {
  // Clear mocks between tests.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches data on mount and renders results and pagination', async () => {
    jest
      .spyOn(SWAPIService.prototype, 'search')
      .mockResolvedValue(dummySuccessResponse);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/search/1']}>
          <Routes>
            <Route path="/search/:page/*" element={<MainPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Wait for the result to appear.
    await waitFor(() =>
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument()
    );

    // Verify that the "Search Results" header is rendered.
    expect(screen.getByText(/Search Results/i)).toBeInTheDocument();

    // Verify that Pagination is rendered. (Assuming the Pagination component renders a button with "2")
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('displays error message when service returns an error', async () => {
    jest
      .spyOn(SWAPIService.prototype, 'search')
      .mockResolvedValue(dummyErrorResponse);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/search/1']}>
          <Routes>
            <Route path="/search/:page/*" element={<MainPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() =>
      expect(screen.getByText(/Error details:/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Some error occurred/i)).toBeInTheDocument();
  });

  test('submitting a new search navigates to "/search/1"', async () => {
    // Start at page 2 to see the navigation change.
    jest
      .spyOn(SWAPIService.prototype, 'search')
      .mockResolvedValue(dummySuccessResponse);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/search/2']}>
          <Routes>
            <Route path="/search/:page/*" element={<MainPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Wait until the SearchForm is rendered.
    const input = await screen.findByPlaceholderText(/Enter character name/i);
    fireEvent.change(input, { target: { value: 'Darth Vader' } });
    const searchButton = screen.getByRole('button', { name: /Search/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // The handleSearch function should navigate to page 1.
    expect(mockedNavigate).toHaveBeenCalledWith('/search/1');
  });

  test('clicking a pagination button navigates to the selected page', async () => {
    jest
      .spyOn(SWAPIService.prototype, 'search')
      .mockResolvedValue(dummySuccessResponse);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/search/1']}>
          <Routes>
            <Route path="/search/:page/*" element={<MainPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Wait for pagination to render (a button with "2" appears).
    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());

    const page2Button = screen.getByText('2');
    await act(async () => {
      fireEvent.click(page2Button);
    });

    // The handlePageChange should navigate to page 2.
    expect(mockedNavigate).toHaveBeenCalledWith('/search/2');
  });

  test('clicking on a character row navigates to details when no details are active', async () => {
    // Simulate no active details.
    jest.spyOn(reactRouter, 'useMatch').mockReturnValue(null);
    jest
      .spyOn(SWAPIService.prototype, 'search')
      .mockResolvedValue(dummySuccessResponse);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/search/1']}>
          <Routes>
            <Route path="/search/:page/*" element={<MainPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() =>
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument()
    );

    const characterRow = screen.getByText(/Luke Skywalker/i);
    await act(async () => {
      fireEvent.click(characterRow);
    });

    // Expect navigation to the details route; the characterId is extracted from the URL.
    expect(mockedNavigate).toHaveBeenCalledWith('/search/1/details/1');
  });

  test('clicking on a character row closes details pane if same row is clicked when details are active', async () => {
    // Simulate that details are active for character "1".
    jest.spyOn(reactRouter, 'useMatch').mockReturnValue({
      params: { characterId: '1' },
      pathname: '/search/1/details/1',
      pathnameBase: '/search/1/details/1',
      pattern: {
        path: '/search/:page/details/:characterId',
        caseSensitive: false,
        end: false,
      },
    });
    jest
      .spyOn(SWAPIService.prototype, 'search')
      .mockResolvedValue(dummySuccessResponse);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/search/1/details/1']}>
          <Routes>
            <Route path="/search/:page/*" element={<MainPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() =>
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument()
    );

    const characterRow = screen.getByText(/Luke Skywalker/i);

    await act(async () => {
      fireEvent.click(characterRow);
    });

    // Since the same row is clicked and details are active, it should close the details pane.
    expect(mockedNavigate).toHaveBeenCalledWith('/search/1');
  });

  test('renders the Outlet (details pane) when the details route is active', async () => {
    // Provide a dummy component for the Outlet.
    const DummyOutlet = () => <div>Detail Content</div>;
    jest
      .spyOn(SWAPIService.prototype, 'search')
      .mockResolvedValue(dummySuccessResponse);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/search/1/details/1']}>
          <Routes>
            <Route path="/search/:page/*" element={<MainPage />}>
              <Route path="details/:characterId" element={<DummyOutlet />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() =>
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument()
    );

    // Verify that the Outlet content is rendered.
    expect(screen.getByText(/Detail Content/i)).toBeInTheDocument();
  });
});
