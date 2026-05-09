import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieService } from '../../core/services/movie.service';
import { Hero } from './components/hero/hero';
import { MovieSlider } from '../../shared/components/movie-slider/movie-slider';
import { Movie } from '../../core/models/movie.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Hero, MovieSlider],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private movieService = inject(MovieService);
  
  // Señales para manejar los datos de forma reactiva
  featuredMovie = signal<Movie | null>(null);
  trendingMovies = signal<Movie[]>([]);
  popularMovies = signal<Movie[]>([]);

  ngOnInit(): void {
    // 1. Obtener Tendencias
    this.movieService.getTrendingMovies().subscribe({
      next: (data) => {
        if (data.results.length > 0) {
          this.featuredMovie.set(data.results[0]);
          this.trendingMovies.set(data.results);
        }
      },
      error: (err) => console.error('❌ Error Tendencias:', err)
    });

    // 2. Obtener Populares
    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        this.popularMovies.set(data.results);
      },
      error: (err) => console.error('❌ Error Populares:', err)
    });
  }
}
