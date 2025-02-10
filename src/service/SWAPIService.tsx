import {
  type ServiceResponse,
  type ServiceErrorResponse,
  Character,
} from '../types/types';

class SWAPIService {
  #URL = 'https://swapi.dev/api/people/';
  static readonly ITEMS_PER_PAGE = 10;

  #handleError(response: Response): ServiceErrorResponse {
    const errorResponse = {
      error: true,
      errorInfo: 'Failed to fetch data',
    };

    const status = response.status.toString();

    if (status.startsWith('5')) {
      errorResponse.errorInfo = `${status} Internal server error`;
    }

    if (status.startsWith('4')) {
      errorResponse.errorInfo = `${status} Request error`;
    }

    return errorResponse;
  }

  async search(
    searchTerm: string,
    page: number = 1
  ): Promise<ServiceResponse | ServiceErrorResponse> {
    const searchURL = searchTerm
      ? `${this.#URL}?search=${searchTerm.trim()}&page=${page}`
      : `${this.#URL}?page=${page}`;
    const response = await fetch(searchURL);

    if (!response.ok) {
      return this.#handleError(response);
    }

    const data = await response.json();
    const totalPages = Math.ceil(data.count / SWAPIService.ITEMS_PER_PAGE);
    return {
      count: data.count,
      totalPages,
      results: data.results,
      next: data.next,
      previous: data.previous,
    };
  }

  async getCharacterDetails(
    characterId: string
  ): Promise<Character | ServiceErrorResponse> {
    const detailURL = `${this.#URL}${characterId}/`;
    const response = await fetch(detailURL);

    if (!response.ok) {
      return this.#handleError(response);
    }

    return await response.json();
  }
}

export default SWAPIService;
