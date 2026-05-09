import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  /**
   * @Input permite que este componente reciba una película desde su padre (Home).
   * El signo '!' indica a TypeScript que confiaremos en que el padre siempre la enviará.
   */
  @Input({ required: true }) movie!: Movie;

  /**
   * Genera la URL completa para la imagen de fondo.
   * Usamos el tamaño 'original' para máxima calidad en el Hero.
   */
  get backdropUrl(): string {
    return `https://image.tmdb.org/t/p/original${this.movie.backdrop_path}`;
  }
}
