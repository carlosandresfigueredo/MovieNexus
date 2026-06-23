import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MovieService } from './movie.service';
import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  movies?: Movie[];
  loading?: boolean;
}

export interface GeminiResponse {
  reply: string;
  movieQueries: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private http = inject(HttpClient);
  private movieService = inject(MovieService);

  // Historial reactivo de mensajes utilizando Signals
  public messages = signal<ChatMessage[]>([
    {
      sender: 'ai',
      text: '¡Hola! Soy **Nexus AI**, tu asistente cinéfilo personal. ¿Qué te apetece ver hoy o sobre qué película tienes dudas?'
    }
  ]);

  // Señal para saber si la IA está "escribiendo" (procesando)
  public isTyping = signal(false);

  /**
   * Envía el mensaje del usuario a Gemini e integra la respuesta
   * @param message El texto ingresado por el usuario
   */
  sendMessage(message: string): Observable<ChatMessage> {
    // 1. Agregar el mensaje del usuario al historial
    const currentMessages = this.messages();
    this.messages.set([
      ...currentMessages,
      { sender: 'user', text: message }
    ]);

    this.isTyping.set(true);

    // 2. Convertir el historial de mensajes al formato de roles que espera Gemini
    // Ignoramos el primer mensaje (el saludo estático de bienvenida de la IA)
    const history = currentMessages
      .filter((_, index) => index > 0)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    // 3. Hacer POST a nuestro proxy Backend
    return this.http.post<GeminiResponse>('/api/chat', { message, history }).pipe(
      switchMap((geminiRes) => {
        const replyText = geminiRes.reply;
        const queries = geminiRes.movieQueries || [];

        // 4. Si la IA recomendó películas, hacemos búsquedas paralelas en TMDB
        if (queries.length > 0) {
          const searchRequests = queries.map(query =>
            this.movieService.searchMovies(query).pipe(
              map(res => (res.results && res.results.length > 0 ? res.results[0] : null)),
              catchError(() => of(null)) // Tolera fallos en búsquedas individuales
            )
          );

          return forkJoin(searchRequests).pipe(
            map((movies) => {
              // Filtrar resultados nulos o no encontrados
              const validMovies = movies.filter((m): m is Movie => m !== null);
              
              const aiMsg: ChatMessage = {
                sender: 'ai',
                text: replyText,
                movies: validMovies
              };

              // Actualizar el historial reactivo con el mensaje completo
              this.messages.set([...this.messages(), aiMsg]);
              this.isTyping.set(false);
              return aiMsg;
            })
          );
        } else {
          // Si no hay recomendaciones, agregar mensaje plano de la IA
          const aiMsg: ChatMessage = {
            sender: 'ai',
            text: replyText
          };

          this.messages.set([...this.messages(), aiMsg]);
          this.isTyping.set(false);
          return of(aiMsg);
        }
      }),
      catchError((error) => {
        console.error('❌ Error en el servicio de Gemini:', error);
        this.isTyping.set(false);
        
        const errorMsg: ChatMessage = {
          sender: 'ai',
          text: 'Lo siento, he tenido problemas para conectar con mi cerebro cinéfilo. ¿Podrías volver a intentarlo?'
        };

        this.messages.set([...this.messages(), errorMsg]);
        return of(errorMsg);
      })
    );
  }

  /**
   * Restablece el chat al mensaje inicial
   */
  clearChat(): void {
    this.messages.set([
      {
        sender: 'ai',
        text: '¡Hola! Soy **Nexus AI**, tu asistente cinéfilo personal. ¿Qué te apetece ver hoy o sobre qué película tienes dudas?'
      }
    ]);
  }
}
