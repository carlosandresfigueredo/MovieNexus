import { Component, inject, Input, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../../core/services/movie.service';
import { SafePipe } from '../../../../shared/pipes/safe.pipe';

/**
 * COMPONENTE DE TRÁILER (Componente "pesado" que se carga de forma diferida)
 *
 * Este componente incrusta un reproductor de YouTube para mostrar el tráiler oficial.
 * Al ser un iframe de YouTube, es un recurso pesado que no debería cargarse
 * hasta que el usuario realmente quiera verlo.
 */
@Component({
  selector: 'app-movie-trailer',
  standalone: true,
  imports: [CommonModule, SafePipe],
  template: `
    @if (trailerKey()) {
      <div class="trailer-wrapper">
        <iframe
          [src]="'https://www.youtube.com/embed/' + trailerKey() | safe"
          title="Tráiler Oficial"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="trailer-iframe"
        >
        </iframe>
      </div>
    } @else {
      <div class="no-trailer">
        <span class="no-trailer-icon">🎬</span>
        <p>No hay tráiler disponible para esta película.</p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './movie-trailer.css',
})
export class MovieTrailer implements OnInit {
  private movieService = inject(MovieService);

  @Input() movieId!: number;
  trailerKey = signal<string | null>(null);

  ngOnInit(): void {
    if (this.movieId) {
      this.movieService.getMovieVideos(this.movieId).subscribe({
        next: (data) => {
          // Buscamos el tráiler oficial de YouTube
          const trailer = data.results.find(
            (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
          );
          if (trailer) {
            this.trailerKey.set(trailer.key);
          }
        },
      });
    }
  }
}
