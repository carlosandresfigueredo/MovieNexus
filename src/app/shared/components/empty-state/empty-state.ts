import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css'
})
export class EmptyState {
  @Input() icon: string = '🔍';
  @Input() title: string = 'No hay resultados';
  @Input() message: string = 'No encontramos lo que estabas buscando.';
  @Input() actionText?: string;
  @Input() actionLink?: string;
}
