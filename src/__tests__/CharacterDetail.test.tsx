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

// Mock SWAPIService.getCharacterDetails to resolve with our mock data
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

    // Initially, the spinner should be present.
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the detail to load.
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
          {/* Fallback route for navigation if applicable */}
          <Route path="/search/:page" element={<div>Search Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    let details: HTMLElement;
    // Wait until the character detail has loaded (i.e. the text "Luke Skywalker" is in the document)
    await waitFor(() => {
      details = screen.getByText(/Luke Skywalker/i);
      expect(details).toBeInTheDocument();
    });

    // Find the close button (assuming it contains the text "close")
    const closeButton = screen.getByText(/close/i);

    // Click the close button. If your component triggers asynchronous state updates,
    // wrapping the event in act can help flush updates.
    await act(async () => {
      fireEvent.click(closeButton);
    });

    // Wait for the component (or a key element) to be removed from the DOM.
    // This asserts that the detail view is hidden.
    waitForElementToBeRemoved(() => details);
  });

  test('renders error when no characterId is provided', async () => {
    // Here, we use a route that only supplies the "page" parameter.
    render(
      <MemoryRouter initialEntries={['/search/1']}>
        <Routes>
          {/* Notice that the route does not include a characterId */}
          <Route path="/search/:page" element={<CharacterDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // The effect should set the error state to "No characterId has been found"
    // and render an error message.
    await waitFor(() => {
      expect(
        screen.getByText(/No characterId has been found/i)
      ).toBeInTheDocument();
    });
  });

  // Test for line 33: Service returns an error.
  test('renders error when the service returns an error response', async () => {
    // Mock getCharacterDetails to return an error response.
    jest
      .spyOn(SWAPIService.prototype, 'getCharacterDetails')
      .mockResolvedValue({
        error: true,
        errorInfo: 'Some error occurred',
      });

    // Render the component using a route that provides both "page" and "characterId".
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

    // The effect should eventually render an error message with the error info.
    await waitFor(async () => {
      expect(
        screen.getByText(/Error details: Some error occurred/i)
      ).toBeInTheDocument();
    });
  });
});
