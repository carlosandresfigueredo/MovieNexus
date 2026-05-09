import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie.model';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetails implements OnInit {
  private movieService = inject(MovieService);

  // Recibimos el ID directamente desde la URL gracias a withComponentInputBinding()
  @Input() id!: string;

  // Signal para almacenar la película actual
  movie = signal<Movie | null>(null);

  ngOnInit(): void {
    if (this.id) {
      this.movieService.getMovieById(this.id).subscribe({
        next: (movie) => this.movie.set(movie),
        error: (err) => console.error('Error al cargar la película', err)
      });
    }
  }

  get backdropUrl() {
    return this.movie()?.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${this.movie()?.backdrop_path}`
      : '';
  }
}
