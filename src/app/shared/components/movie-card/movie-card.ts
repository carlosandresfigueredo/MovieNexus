import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-card.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './movie-card.css',
})
export class MovieCard {
  @Input({ required: true }) movie!: Movie;

  private favoritesService = inject(FavoritesService);

  get posterUrl() {
    return this.movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
      : 'assets/no-poster.png';
  }

  // Comprueba si esta película específica es favorita
  get isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.movie.id);
  }

  // Alterna el estado de favorito
  toggleFavorite(event: Event) {
    event.preventDefault(); // Evita que el click siga al routerLink del card
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.movie);
  }
}
