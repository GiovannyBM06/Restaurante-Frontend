
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../../shared/models/usuario.model';
import { ApiService } from './api.service';


export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  /*
  Se toman las credenciales del backend
  */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('AuthService: Intentando login con credenciales:', credentials);
    return this.apiService.post<LoginResponse>('/auth/login', credentials);
  }
  /* 
  Se guardan los datos del login
  */
  setUserData(response: LoginResponse): void {
        console.log('AuthService: Guardando datos del usuario:', response);

    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.usuario));

    this.currentUserSubject.next(response.usuario);

    console.log('AuthService: Datos guardados exitosamente');
  }
  /*
    Cierra sesión del usuario
  */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el usuario actual
   */
  getUser(): Usuario | null {
    const u = localStorage.getItem(this.USER_KEY);
    return u ? JSON.parse(u) : null;
  }
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Carga los datos del usuario desde el almacenamiento local
   */
  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        const user: Usuario = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        this.logout();
      }
    }
  }

  canAccess(route: string): boolean {
    return true;
  }
}
