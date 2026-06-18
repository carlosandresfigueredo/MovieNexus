import { Component, inject, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../../core/services/comment.service';
import { Comment } from '../../../../core/models/comment.model';

@Component({
  selector: 'app-movie-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-comments.html',
  styleUrl: './movie-comments.css',
})
export class MovieComments implements OnInit {
  private commentService = inject(CommentService);
  private cdr = inject(ChangeDetectorRef);

  /** ID de la película (se recibe desde el componente padre) */
  @Input() movieId!: number;

  /** Lista de comentarios cargados */
  comments: Comment[] = [];

  /** Estado de carga */
  loading = false;

  /** Mensaje de error */
  error = '';

  /** Campos del formulario */
  authorName = '';
  commentText = '';
  selectedRating = 5;

  /** Control para mostrar/ocultar el formulario */
  showForm = false;

  /** Estado de envío */
  submitting = false;

  /** Mensaje de éxito */
  successMessage = '';

  /** El itemId que usamos para identificar la película */
  get itemId(): string {
    return `movie-${this.movieId}`;
  }

  ngOnInit(): void {
    this.loadComments();
  }

  /** Carga los comentarios desde la API */
  loadComments(): void {
    this.loading = true;
    this.error = '';

    this.commentService.getComments(this.itemId).subscribe({
      next: (data) => {
        // Ordenar por fecha, más nuevos primero
        this.comments = data.sort(
          (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los comentarios. Verifica que la API esté activa.';
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error cargando comentarios:', err);
      },
    });
  }

  /** Alterna la visibilidad del formulario */
  toggleForm(): void {
    this.showForm = !this.showForm;
    this.successMessage = '';
  }

  /** Selecciona una calificación con las estrellas */
  setRating(value: number): void {
    this.selectedRating = value;
  }

  /** Envía un nuevo comentario a la API */
  submitComment(): void {
    // Validación
    if (!this.authorName.trim() || !this.commentText.trim()) {
      return;
    }

    this.submitting = true;

    this.commentService
      .addComment(this.itemId, this.authorName.trim(), this.commentText.trim(), this.selectedRating)
      .subscribe({
        next: (newComment) => {
          // Agregar el comentario nuevo al inicio de la lista
          this.comments.unshift(newComment);

          // Limpiar el formulario
          this.authorName = '';
          this.commentText = '';
          this.selectedRating = 5;
          this.showForm = false;
          this.submitting = false;
          this.successMessage = '¡Comentario publicado exitosamente! ✅';
          this.cdr.detectChanges();

          // Ocultar mensaje de éxito después de 3 segundos
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err) => {
          this.submitting = false;
          this.error = 'Error al enviar el comentario. Intenta de nuevo.';
          this.cdr.detectChanges();
          console.error('Error enviando comentario:', err);
        },
      });
  }
}
