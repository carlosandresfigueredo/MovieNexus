import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { environment } from '../../../environments/environment';
import { MovieResponse } from '../models/movie.model';

// 1. DESCRIBE: Agrupa todas las pruebas relacionadas con MovieService
describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  // 2. BEFORE EACH: Se ejecuta ANTES de cada 'it'. Es nuestro "Arrange" global.
  beforeEach(() => {
    // TestBed es el entorno de pruebas de Angular. Nos permite configurar qué módulos inyectar.
    TestBed.configureTestingModule({
      providers: [
        MovieService,
        provideHttpClient(),
        // Usamos este módulo especial para interceptar peticiones HTTP y que no salgan a internet
        provideHttpClientTesting() 
      ]
    });
    
    // Inyectamos las instancias para poder usarlas en las pruebas
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // 3. AFTER EACH: Se ejecuta DESPUÉS de cada 'it'. Limpiamos la casa.
  afterEach(() => {
    // Verificamos que no hayan quedado peticiones HTTP pendientes en el limbo
    httpMock.verify();
  });

  // --- PRIMERA PRUEBA ---
  it('debería ser creado correctamente', () => {
    // Assert: Comprobamos que la variable 'service' tiene un valor válido (true).
    expect(service).toBeTruthy(); 
  });

  // --- SEGUNDA PRUEBA ---
  it('debería buscar películas y devolver datos de la API simulada', () => {
    // 1. ARRANGE (Preparar)
    // Creamos datos falsos ("Mocks") exactamente con la estructura que devolvería la API real
    const mockResponse: MovieResponse = { 
      page: 1, 
      results: [
        { 
          id: 1, 
          title: 'Inception', 
          overview: 'Dreams', 
          poster_path: '/poster.jpg',
          backdrop_path: '/backdrop.jpg',
          release_date: '2010-07-16',
          vote_average: 8.8
        }
      ],
      total_pages: 1,
      total_results: 1
    };
    const searchTerm = 'Inception';

    // 2. ACT (Actuar)
    service.searchMovies(searchTerm).subscribe(response => {
      // 3. ASSERT (Comprobar)
      expect(response.results.length).toBe(1);
      expect(response.results[0].title).toEqual('Inception');
    });

    // --- MAGIA DEL HTTP MOCK ---
    // Le decimos a Angular qué URL exacta esperamos que el servicio haya intentado llamar
    const req = httpMock.expectOne(`${environment.baseUrl}/search/movie?query=${searchTerm}`);
    
    // Comprobamos que la petición haya sido por el método GET
    expect(req.request.method).toBe('GET');
    
    // Simulamos que el servidor respondió exitosamente devolviendo nuestro mockResponse.
    req.flush(mockResponse); 
  });
});
