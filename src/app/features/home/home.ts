import { Component, inject, OnInit, signal } from '@angular/core';
// 1. Necesitamos herramientas para interactuar con el DOM de forma segura
import { AfterViewInit, ElementRef, ViewChild, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { Hero } from './components/hero/hero';
import { MovieSlider } from '../../shared/components/movie-slider/movie-slider';
import { MovieCard } from '../../shared/components/movie-card/movie-card';
import { SkeletonHero } from '../../shared/components/skeleton-hero/skeleton-hero';
import { SkeletonCard } from '../../shared/components/skeleton-card/skeleton-card';
import { Movie } from '../../core/models/movie.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Hero, MovieSlider, MovieCard, SkeletonHero, SkeletonCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {
  private movieService = inject(MovieService);
  private platformId = inject(PLATFORM_ID);

  // 2. Marcamos un elemento del HTML para observarlo
  @ViewChild('infiniteAnchor') infiniteAnchor!: ElementRef;
  
  // Señales para manejar los datos de forma reactiva
  featuredMovie = signal<Movie | null>(null);
  trendingMovies = signal<Movie[]>([]);
  popularMovies = signal<Movie[]>([]);

  catalogMovies = signal<Movie[]>([]);
  currentPage = signal(1);
  isFetchingNextPage = signal(false);

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

    // 2. Obtener Populares (Página 1 para Slider y Catálogo)
    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        this.popularMovies.set(data.results);
        this.catalogMovies.set(data.results);
        this.currentPage.set(2);
      },
      error: (err) => console.error('❌ Error Populares:', err)
    });
  }

  ngAfterViewInit(): void {
    // 3. Solo configuramos el observador en el navegador (SSR Safety)
    if (isPlatformBrowser(this.platformId)) {
      this.initInfiniteScroll();
    }
  }

  private initInfiniteScroll(): void {
    const observer = new IntersectionObserver((entries) => {
      // 4. Si el ancla entra en el campo de visión y no estamos cargando...
      if (entries[0].isIntersecting && !this.isFetchingNextPage()) {
        this.loadMoreMovies();
      }
    }, { rootMargin: '200px' }); // 'rootMargin' permite cargar 200px antes de llegar al final

    observer.observe(this.infiniteAnchor.nativeElement);
  }

  loadMoreMovies(): void {
    this.isFetchingNextPage.set(true);
    this.movieService.getPopularMovies(this.currentPage()).subscribe({
      next: (data) => {
        // 5. Inmutabilidad: Concatenamos los resultados usando el operador spread [...]
        this.catalogMovies.set([...this.catalogMovies(), ...data.results]);
        this.currentPage.update(p => p + 1);
        this.isFetchingNextPage.set(false);
      }
    });
  }
}
