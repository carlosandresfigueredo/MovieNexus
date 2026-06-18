import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Comment } from '../models/comment.model';
import { Observable } from 'rxjs';

/**
 * SERVICIO DE COMENTARIOS
 *
 * Este servicio se conecta a la API de comentarios del instructor.
 * Permite obtener y enviar comentarios para cada película.
 *
 * IMPORTANTE: Cada aprendiz debe cambiar:
 *   - APP_ID: un nombre único para su proyecto (ej: "MovieNexus-Juan")
 *   - API_URL: la URL donde el instructor tiene corriendo su API
 */
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);

  // ============================================================
  //  👉 CONFIGURACIÓN DEL APRENDIZ - ¡CAMBIA ESTOS VALORES!
  // ============================================================

  /** URL de la API de comentarios del instructor */
  private API_URL = 'http://localhost:3000/api/comments';

  /** Nombre único de tu proyecto. Cámbialo por el tuyo */
  private APP_ID = 'MovieNexus';

  // ============================================================

  /**
   * Obtiene los comentarios de un ítem específico (ej: una película).
   * Filtra por appId y itemId en el servidor.
   * @param itemId Identificador del ítem (ej: "movie-550")
   */
  getComments(itemId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.API_URL}/${this.APP_ID}/${itemId}`
    );
  }

  /**
   * Envía un nuevo comentario a la API.
   * El servidor le asignará un ID y fecha automáticamente.
   * @param itemId Identificador del ítem comentado
   * @param author Nombre del autor
   * @param text Texto del comentario
   * @param rating Calificación del 1 al 5
   */
  addComment(itemId: string, author: string, text: string, rating: number): Observable<Comment> {
    const body = {
      appId: this.APP_ID,
      itemId,
      author,
      text,
      rating
    };
    return this.http.post<Comment>(this.API_URL, body);
  }
}
