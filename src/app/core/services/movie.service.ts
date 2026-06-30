import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Movie, MovieResponse, WatchProvidersResponse } from '../models/movie.model';
import { CreditsResponse } from '../models/cast.model';

/**
 * SERVICIO DE PELÍCULAS (EL MENSAJERO)
 * 
 * ¿Por qué un servicio?
 * Separamos la lógica de "obtener datos" de la lógica de "mostrarlos".
 * Así, cualquier componente puede pedir películas sin saber cómo se conectan.
 */
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = environment.baseUrl;

  /**
   * Obtiene las películas que son tendencia hoy.
   */
  getTrendingMovies() {
    return this.http.get<MovieResponse>(`${this.apiUrl}/trending/movie/day`);
  }

  /**
   * Obtiene las películas más populares con soporte para paginación.
   * @param page Número de página a obtener (por defecto 1)
   */
  getPopularMovies(page: number = 1) {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular`, {
      params: { page: page.toString() }
    });
  }

  /**
   * Obtiene los detalles de una película específica por su ID.
   * @param id ID de la película en TMDB
   */
  getMovieById(id: string | number) {
    return this.http.get<Movie>(`${this.apiUrl}/movie/${id}`);
  }

  /**
   * Obtiene el elenco de actores de una película específica.
   * @param id ID de la película en TMDB
   */
  getMovieCredits(id: string | number) {
    return this.http.get<CreditsResponse>(`${this.apiUrl}/movie/${id}/credits`);
  }

  /**
   * Busca películas por término de búsqueda.
   * @param query Texto a buscar
   */
  searchMovies(query: string) {
    return this.http.get<MovieResponse>(`${this.apiUrl}/search/movie`, {
      params: { query }
    });
  }

  /**
   * Obtiene los videos (tráilers, teasers, etc.) de una película.
   * @param id ID de la película en TMDB
   */
  getMovieVideos(id: string | number) {
    return this.http.get<{ results: Array<{ key: string; site: string; type: string; name: string }> }>(
      `${this.apiUrl}/movie/${id}/videos`
    );
  }

  /**
   * Obtiene los proveedores de streaming para una película (donde verla).
   * @param id ID de la película en TMDB
   */
  getWatchProviders(id: string | number) {
    return this.http.get<WatchProvidersResponse>(`${this.apiUrl}/movie/${id}/watch/providers`);
  }
}
