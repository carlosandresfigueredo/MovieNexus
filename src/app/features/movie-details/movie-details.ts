import { Component, inject, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { Movie, CountryProviders } from '../../core/models/movie.model';
import { CastCard } from '../../shared/components/cast-card/cast-card';
import { MovieTrailer } from './components/movie-trailer/movie-trailer';
import { MovieComments } from './components/movie-comments/movie-comments';
import { Observable, forkJoin, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreditsResponse } from '../../core/models/cast.model';
import { FavoritesService } from '../../core/services/favorites.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, CastCard, MovieTrailer, MovieComments],
  templateUrl: './movie-details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './movie-details.css',
})
export class MovieDetails implements OnInit {
  private movieService = inject(MovieService);
  private favoritesService = inject(FavoritesService);

  @Input() id!: string;

  // Observable que contendrá detalles, créditos y proveedores de streaming
  movieData$!: Observable<{ details: Movie; credits: CreditsResponse; providers: CountryProviders | null }>;

  ngOnInit(): void {
    if (this.id) {
      const userCountry = (navigator.language || 'es-MX').split('-')[1]?.toUpperCase() || 'MX';
      
      // forkJoin ejecuta múltiples peticiones en paralelo y emite un solo objeto
      // cuando TODAS han terminado exitosamente.
      this.movieData$ = forkJoin({
        details: this.movieService.getMovieById(this.id),
        credits: this.movieService.getMovieCredits(this.id),
        providers: this.movieService.getWatchProviders(this.id).pipe(
          map(res => {
            const results = res.results || {};
            return results[userCountry] || results['MX'] || results['ES'] || results['US'] || null;
          }),
          catchError(() => of(null))
        )
      });
    }
  }

  // Helper para construir la URL del backdrop
  getBackdropUrl(path: string | null | undefined): string {
    return path ? `https://image.tmdb.org/t/p/original${path}` : '';
  }

  isFavorite(movieId: number): boolean {
    return this.favoritesService.isFavorite(movieId);
  }

  toggleFavorite(movie: Movie): void {
    this.favoritesService.toggleFavorite(movie);
  }
}
