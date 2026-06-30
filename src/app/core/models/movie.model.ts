/**
 * CONTRATO DE DATOS (MODELOS)
 * 
 * ¿Por qué estas interfaces?
 * En TypeScript, definimos la "forma" de los datos que esperamos de la API.
 * Esto nos da autocompletado y evita que intentemos acceder a propiedades que no existen.
 */

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

export interface MovieResponse {
  results: Movie[]; // La API siempre devuelve una lista en el campo 'results'
  page: number;
  total_pages: number;
  total_results: number;
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface CountryProviders {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface WatchProvidersResponse {
  id: number;
  results: {
    [countryCode: string]: CountryProviders;
  };
}

