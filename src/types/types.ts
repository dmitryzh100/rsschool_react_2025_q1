type Character = {
  name: string;
  height: number;
  mass: number;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: [string];
  species: [string];
  vehicles: [string];
  starships: [string];
  created: string;
  edited: string;
  url: string;
};

type ServiceResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<Character>;
};

type ServiceErrorResponse = {
  error: boolean;
  errorInfo: string;
};

export { type Character, type ServiceResponse, type ServiceErrorResponse };
