import SWAPIService from '../service/SWAPIService';
import { mockCharacters, mockCharacterDetail } from './mockData/mockData';

describe('SWAPIService', () => {
  // Save the original fetch so we can restore it later.
  const originalFetch = global.fetch;

  afterEach(() => {
    // Restore the original fetch after each test.
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  describe('search', () => {
    it('returns a successful response when fetch is ok', async () => {
      const dummyData = {
        count: 20,
        results: mockCharacters,
        next: 'https://swapi.dev/api/people/?page=2',
        previous: null,
      };

      // Override fetch to simulate a successful API call.
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(dummyData),
      });

      const service = new SWAPIService();
      const result = await service.search('Luke', 1);

      // The returned object should include:
      // - count from dummyData,
      // - totalPages computed as Math.ceil(count / ITEMS_PER_PAGE),
      // - results, next, and previous as in dummyData.
      expect(result).toEqual({
        count: dummyData.count,
        totalPages: Math.ceil(dummyData.count / SWAPIService.ITEMS_PER_PAGE),
        results: dummyData.results,
        next: dummyData.next,
        previous: dummyData.previous,
      });

      // Verify that fetch was called with the proper URL.
      expect(global.fetch).toHaveBeenCalledWith(
        `https://swapi.dev/api/people/?search=Luke&page=1`
      );
    });

    it('returns an error response when fetch is not ok (4xx)', async () => {
      // Simulate a 404 Not Found response.
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      const service = new SWAPIService();
      const result = await service.search('anything', 1);

      expect(result).toEqual({
        error: true,
        errorInfo: '404 Request error',
      });
    });

    it('returns an error response when fetch is not ok (5xx)', async () => {
      // Simulate a 500 Internal Server Error response.
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      const service = new SWAPIService();
      const result = await service.search('', 1);

      expect(result).toEqual({
        error: true,
        errorInfo: '500 Internal server error',
      });
    });
  });

  describe('getCharacterDetails', () => {
    it('returns character details when fetch is ok', async () => {
      // Override fetch to simulate a successful detail API call.
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockCharacterDetail),
      });

      const service = new SWAPIService();
      const result = await service.getCharacterDetails('1');

      expect(result).toEqual(mockCharacterDetail);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://swapi.dev/api/people/1/'
      );
    });

    it('returns an error response when fetch is not ok', async () => {
      // Simulate a 400 Bad Request response.
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
      });

      const service = new SWAPIService();
      const result = await service.getCharacterDetails('1');

      expect(result).toEqual({
        error: true,
        errorInfo: '400 Request error',
      });
    });
  });
});
