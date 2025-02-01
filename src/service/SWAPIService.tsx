import {
  type ServiceResponse,
  type ServiceErrorResponse,
} from '../types/types';

class SWAPIService {
  #URL = 'https://swapi.dev/api/people/';

  #handleError = (response: Response): ServiceErrorResponse => {
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
  };

  search = async (
    searchTerm: string
  ): Promise<ServiceResponse | ServiceErrorResponse> => {
    const searchURL = searchTerm
      ? `${this.#URL}?search=${searchTerm.trim()}`
      : this.#URL;
    const response = await fetch(searchURL);

    if (!response.ok) {
      return this.#handleError(response);
    }

    return response.json();
  };
}

export default SWAPIService;
