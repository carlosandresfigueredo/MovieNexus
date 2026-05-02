import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MovieResponse } from '../models/movie.model';

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
}
