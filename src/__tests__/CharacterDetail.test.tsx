/// <reference types="@testing-library/jest-dom" />
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import CharacterDetail from '../components/CharacterDetail/CharacterDetail';
import SWAPIService from '../service/SWAPIService';

import { MemoryRouter, Route, Routes } from 'react-router';

import { mockCharacterDetail } from './mockData/mockData';

jest
  .spyOn(SWAPIService.prototype, 'getCharacterDetails')
  .mockResolvedValue(mockCharacterDetail);

const mockedUsedNavigate = jest.fn();

describe('CharacterDetail Component', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockReset();
  });

  test('shows a loading indicator while fetching data and then displays details', async () => {
    render(
      <MemoryRouter initialEntries={['/search/1/details/1']}>
        <Routes>
          <Route
            path="/search/:page/details/:characterId"
            element={<CharacterDetail />}
          />
          {/* Add a fallback route for when navigation occurs */}
          <Route path="/search/:page" element={<div>Search Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument()
    );
  });

  test('clicking the close button hides the component', async () => {
    render(
      <MemoryRouter initialEntries={['/search/1/details/1']}>
        <Routes>
          <Route
            path="/search/:page/details/:characterId"
            element={<CharacterDetail />}
          />
          <Route path="/search/:page" element={<div>Search Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    let details: HTMLElement;
    await waitFor(() => {
      details = screen.getByText(/Luke Skywalker/i);
      expect(details).toBeInTheDocument();
    });

    const closeButton = screen.getByText(/close/i);

    await act(async () => {
      fireEvent.click(closeButton);
    });

    waitForElementToBeRemoved(() => details);
  });

  test('renders error when no characterId is provided', async () => {
    render(
      <MemoryRouter initialEntries={['/search/1']}>
        <Routes>
          <Route path="/search/:page" element={<CharacterDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No characterId has been found/i)
      ).toBeInTheDocument();
    });
  });

  test('renders error when the service returns an error response', async () => {
    jest
      .spyOn(SWAPIService.prototype, 'getCharacterDetails')
      .mockResolvedValue({
        error: true,
        errorInfo: 'Some error occurred',
      });

    render(
      <MemoryRouter initialEntries={['/search/1/details/1']}>
        <Routes>
          <Route
            path="/search/:page/details/:characterId"
            element={<CharacterDetail />}
          />
          <Route path="/search/:page" element={<div>Search Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(async () => {
      expect(
        screen.getByText(/Error details: Some error occurred/i)
      ).toBeInTheDocument();
    });
  });
});
