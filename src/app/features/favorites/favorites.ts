import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../core/services/favorites.service';
import { MovieCard } from '../../shared/components/movie-card/movie-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MovieCard, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites {
  public favoritesService = inject(FavoritesService);

  get favoriteMovies() {
    return this.favoritesService.favorites();
  }
}
