import SWAPIService from '../service/SWAPIService';
import { mockCharacters, mockCharacterDetail } from './mockData/mockData';

describe('SWAPIService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
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

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(dummyData),
      });

      const service = new SWAPIService();
      const result = await service.search('Luke', 1);

      expect(result).toEqual({
        count: dummyData.count,
        totalPages: Math.ceil(dummyData.count / SWAPIService.ITEMS_PER_PAGE),
        results: dummyData.results,
        next: dummyData.next,
        previous: dummyData.previous,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `https://swapi.dev/api/people/?search=Luke&page=1`
      );
    });

    it('returns an error response when fetch is not ok (4xx)', async () => {
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
