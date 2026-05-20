import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  // Inyectamos el PLATFORM_ID para saber si estamos en el navegador o en el servidor
  private platformId = inject(PLATFORM_ID);
  
  // Clave para guardar en localStorage
  private readonly STORAGE_KEY = 'movienexus_favorites';

  // Nuestra tienda de estado global (Signal)
  public favorites = signal<Movie[]>([]);

  constructor() {
    this.loadFavorites();
  }

  /**
   * Carga los favoritos desde el localStorage (solo si estamos en el navegador)
   */
  private loadFavorites(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.favorites.set(JSON.parse(stored));
        } catch (error) {
          console.error('Error parseando favoritos de localStorage', error);
          this.favorites.set([]);
        }
      }
    }
  }

  /**
   * Guarda los favoritos actuales en el localStorage (solo en navegador)
   */
  private saveFavorites(movies: Movie[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(movies));
    }
  }

  /**
   * Añade o quita una película de la lista de favoritos
   * @param movie Película a alternar
   */
  toggleFavorite(movie: Movie): void {
    const currentFavorites = this.favorites();
    const isAlreadyFavorite = currentFavorites.some(f => f.id === movie.id);

    let updatedFavorites: Movie[];

    if (isAlreadyFavorite) {
      // Si ya es favorita, la filtramos (la quitamos)
      updatedFavorites = currentFavorites.filter(f => f.id !== movie.id);
    } else {
      // Si no es favorita, la añadimos al principio de la lista
      updatedFavorites = [movie, ...currentFavorites];
    }

    // Actualizamos la Signal y guardamos en localStorage
    this.favorites.set(updatedFavorites);
    this.saveFavorites(updatedFavorites);
  }

  /**
   * Comprueba si una película específica está en favoritos
   * @param movieId ID de la película
   * @returns boolean indicando si es favorita
   */
  isFavorite(movieId: number): boolean {
    return this.favorites().some(f => f.id === movieId);
  }
}
