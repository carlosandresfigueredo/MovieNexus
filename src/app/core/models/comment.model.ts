/**
 * MODELO DE COMENTARIO
 *
 * Esta interfaz define la forma de los datos que envía y recibe
 * nuestra API de comentarios. Nos permite tener autocompletado
 * y evitar errores al acceder a propiedades que no existen.
 */
export interface Comment {
  id?: number;           // Lo asigna el servidor automáticamente
  appId: string;         // Identificador único de TU proyecto (ej: "MovieNexus")
  itemId: string;        // ID del elemento comentado (ej: "movie-123")
  author: string;        // Nombre del autor del comentario
  text: string;          // Contenido del comentario
  rating: number;        // Calificación del 1 al 5
  createdAt?: string;    // Fecha de creación (la asigna el servidor)
}
