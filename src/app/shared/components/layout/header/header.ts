import { Component, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MovieService } from '../../../../core/services/movie.service';
import { Movie, MovieResponse } from '../../../../core/models/movie.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.css',
})
export class Header {
  private movieService = inject(MovieService);

  // Signals para el estado de búsqueda
  searchQuery = signal('');
  searchResults = signal<Movie[]>([]);
  isSearching = signal(false);

  constructor() {
    // El effect se ejecuta cada vez que 'searchQuery' cambia
    effect((onCleanup) => {
      const query = this.searchQuery();

      if (query.length < 3) {
        this.searchResults.set([]);
        this.isSearching.set(false);
        return;
      }

      this.isSearching.set(true);

      // Implementamos un debounce manual usando setTimeout
      const timeoutId = setTimeout(() => {
        this.movieService.searchMovies(query).subscribe({
          next: (response: MovieResponse) => {
            // Tomamos solo los 5 primeros resultados
            this.searchResults.set(response.results.slice(0, 5));
            this.isSearching.set(false);
          },
          error: () => this.isSearching.set(false),
        });
      }, 300); // Espera 300ms antes de buscar

      // onCleanup se ejecuta si el effect se vuelve a disparar ANTES de que termine el timeout
      // Esto cancela el timeout anterior (cancela la búsqueda si sigues escribiendo rápido)
      onCleanup(() => clearTimeout(timeoutId));
    });
  }

  // Método llamado desde el HTML cuando el usuario escribe
  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  // Método para cerrar el buscador al hacer clic en un resultado
  closeSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
  }
}
