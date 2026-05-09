import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie.model';
import { CastCard } from '../../shared/components/cast-card/cast-card';
import { Observable, forkJoin } from 'rxjs';
import { CreditsResponse } from '../../core/models/cast.model';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, CastCard],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetails implements OnInit {
  private movieService = inject(MovieService);

  @Input() id!: string;

  // Observable que contendrá tanto los detalles como los créditos
  movieData$!: Observable<{ details: Movie; credits: CreditsResponse }>;

  ngOnInit(): void {
    if (this.id) {
      // forkJoin ejecuta múltiples peticiones en paralelo y emite un solo objeto
      // cuando TODAS han terminado exitosamente.
      this.movieData$ = forkJoin({
        details: this.movieService.getMovieById(this.id),
        credits: this.movieService.getMovieCredits(this.id)
      });
    }
  }

  // Helper para construir la URL del backdrop
  getBackdropUrl(path: string | null | undefined): string {
    return path ? `https://image.tmdb.org/t/p/original${path}` : '';
  }
}
