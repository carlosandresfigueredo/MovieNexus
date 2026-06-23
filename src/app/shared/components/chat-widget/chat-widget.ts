import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GeminiService, ChatMessage } from '../../../core/services/gemini.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.css'
})
export class ChatWidget implements AfterViewChecked {
  public geminiService = inject(GeminiService);
  
  // Referencia al contenedor de mensajes para auto-scroll
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  // Estado del widget
  isOpen = signal(false);
  userMessage = signal('');

  // Preguntas sugeridas para iniciar la conversación rápidamente
  suggestionChips = [
    '¿Qué películas de ciencia ficción me recomiendas?',
    'Dame 3 buenas películas de suspenso psicológico',
    '¿De qué trata la película Inception?',
    'Recomiéndame una comedia romántica divertida'
  ];

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  /**
   * Alterna la visibilidad de la ventana del chat
   */
  toggleChat(): void {
    this.isOpen.update(val => !val);
  }

  /**
   * Envía el mensaje actual a través del servicio
   */
  sendMessage(text?: string): void {
    const msgToSend = text || this.userMessage().trim();
    if (!msgToSend || this.geminiService.isTyping()) return;

    // Limpiar input si se envió escribiendo
    if (!text) {
      this.userMessage.set('');
    }

    this.geminiService.sendMessage(msgToSend).subscribe();
  }

  /**
   * Limpia la conversación
   */
  clearChat(event: Event): void {
    event.stopPropagation();
    if (confirm('¿Seguro que deseas vaciar el historial de chat?')) {
      this.geminiService.clearChat();
    }
  }

  /**
   * Cierra el chat (usado al hacer clic en ver detalles de una película)
   */
  closeChat(): void {
    this.isOpen.set(false);
  }

  /**
   * Auto-scroll al final del contenedor de mensajes
   */
  private scrollToBottom(): void {
    if (this.scrollContainer) {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch (err) {
        // Ignorar fallas menores de render
      }
    }
  }

  /**
   * Convierte texto markdown básico en HTML seguro
   * @param text Texto con formato markdown
   */
  parseMarkdown(text: string): string {
    if (!text) return '';
    
    // 1. Escapar HTML para evitar ataques XSS
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
      
    // 2. Formatear negritas (**texto**)
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 3. Formatear cursivas (*texto*)
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 4. Formatear listas de viñetas simples (* elemento o - elemento)
    escaped = escaped.replace(/(?:^|\n)[*\-]\s+(.+)/g, '<div class="chat-bullet-item">• $1</div>');

    // 5. Convertir saltos de línea a etiquetas <br>
    escaped = escaped.replace(/\n/g, '<br>');
    
    return escaped;
  }
}
