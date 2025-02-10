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

    await waitFor(() =>
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/Search Results/i)).toBeInTheDocument();

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

    const input = await screen.findByPlaceholderText(/Enter character name/i);
    fireEvent.change(input, { target: { value: 'Darth Vader' } });
    const searchButton = screen.getByRole('button', { name: /Search/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

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

    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());

    const page2Button = screen.getByText('2');
    await act(async () => {
      fireEvent.click(page2Button);
    });

    expect(mockedNavigate).toHaveBeenCalledWith('/search/2');
  });

  test('clicking on a character row navigates to details when no details are active', async () => {
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

    expect(mockedNavigate).toHaveBeenCalledWith('/search/1/details/1');
  });

  test('clicking on a character row closes details pane if same row is clicked when details are active', async () => {
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

    expect(mockedNavigate).toHaveBeenCalledWith('/search/1');
  });

  test('renders the Outlet (details pane) when the details route is active', async () => {
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

    expect(screen.getByText(/Detail Content/i)).toBeInTheDocument();
  });
});
