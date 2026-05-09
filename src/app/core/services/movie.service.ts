import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Movie, MovieResponse } from '../models/movie.model';
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
   * Obtiene las películas más populares.
   */
  getPopularMovies() {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular`);
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
}
