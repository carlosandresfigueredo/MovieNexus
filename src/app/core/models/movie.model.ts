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
}

export interface MovieResponse {
  results: Movie[]; // La API siempre devuelve una lista en el campo 'results'
  page: number;
  total_pages: number;
  total_results: number;
}
