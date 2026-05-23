import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * PIPE DE SEGURIDAD (Safe Pipe)
 * 
 * Angular bloquea por seguridad las URLs dinámicas en iframes para prevenir ataques XSS.
 * Este pipe le dice a Angular: "confío en esta URL, déjala pasar".
 * Solo se debe usar con URLs controladas (como las de YouTube).
 */
@Pipe({
  name: 'safe',
  standalone: true
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
