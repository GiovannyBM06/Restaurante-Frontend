import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card slide-in-up">
        <div class="card glass">
          <div class="card-header text-center">
            <div class="register-icon">✨</div>
            <h2 class="card-title text-title-contrast">Crear Cuenta</h2>
            <p class="register-subtitle text-high-contrast">Únete a nuestro sistema</p>
          </div>
          
          <div class="card-body">
            <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
              <div class="form-group">
                <label for="email" class="form-label">
                  📧 Email
                </label>
                <input 
                  type="email" 
                  id="email"
                  class="form-control" 
                  [(ngModel)]="registerData.email"
                  name="email"
                  required
                  email
                  placeholder="tu@email.com"
                  #email="ngModel"
                  [class.is-invalid]="email.invalid && email.touched"
                >
                <div class="invalid-feedback" *ngIf="email.invalid && email.touched">
                  <div *ngIf="email.errors?.['required']">El email es requerido</div>
                  <div *ngIf="email.errors?.['email']">El email no es válido</div>
                </div>
              </div>

              <div class="form-group">
                <label for="password" class="form-label">
                  🔑 Contraseña
                </label>
                <input 
                  type="password" 
                  id="password"
                  class="form-control" 
                  [(ngModel)]="password"
                  name="password"
                  required
                  minlength="6"
                  placeholder="••••••••"
                  #passwordInput="ngModel"
                  [class.is-invalid]="passwordInput.invalid && passwordInput.touched"
                >
                <div class="invalid-feedback" *ngIf="passwordInput.invalid && passwordInput.touched">
                  <div *ngIf="passwordInput.errors?.['required']">La contraseña es requerida</div>
                  <div *ngIf="passwordInput.errors?.['minlength']">Debe tener al menos 6 caracteres</div>
                </div>
              </div>

              <div class="form-group">
                <label for="nombre" class="form-label">👤 Nombre</label>
                <input 
                  type="text" 
                  id="nombre"
                  class="form-control" 
                  [(ngModel)]="registerData.nombre"
                  name="nombre"
                  required
                  minlength="2"
                  placeholder="Tu nombre"
                  #nombre="ngModel"
                  [class.is-invalid]="nombre.invalid && nombre.touched"
                >
                <div class="invalid-feedback" *ngIf="nombre.invalid && nombre.touched">
                  <div *ngIf="nombre.errors?.['required']">El nombre es requerido</div>
                </div>
              </div>

              <div class="form-group">
                <label for="apellido" class="form-label">👥 Apellido</label>
                <input 
                  type="text" 
                  id="apellido"
                  class="form-control" 
                  [(ngModel)]="registerData.apellido"
                  name="apellido"
                  required
                  minlength="2"
                  placeholder="Tu apellido"
                  #apellido="ngModel"
                  [class.is-invalid]="apellido.invalid && apellido.touched"
                >
                <div class="invalid-feedback" *ngIf="apellido.invalid && apellido.touched">
                  <div *ngIf="apellido.errors?.['required']">El apellido es requerido</div>
                </div>
              </div>

              <div class="form-group">
                <button 
                  type="submit" 
                  class="btn btn-primary w-100 btn-lg"
                  [disabled]="registerForm.invalid || loading"
                >
                  <span *ngIf="loading" class="spinner"></span>
                  <span *ngIf="!loading">✨ Crear Cuenta</span>
                </button>
              </div>

              <div class="form-options">
                <div class="text-center">
                  <span class="login-text">¿Ya tienes cuenta?</span>
                  <a routerLink="/auth/login" class="link">🔐 Inicia sesión aquí</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 2rem; }
    .register-card { width: 100%; max-width: 500px; }
    .register-icon { font-size: 3rem; margin-bottom: 1rem; animation: pulse 2s infinite; }
    .form-control { margin-top: 0.5rem; transition: all 0.3s ease; }
    .is-invalid { border-color: #dc3545; }
    .invalid-feedback { color: #dc3545; font-size: 0.875rem; }
    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
  `]
})
export class RegisterComponent implements OnInit {
  registerData: Usuario = {
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    contraseña: ''
  };

  loading = false;

  // ✅ Proxy property para evitar el error del parser con "ñ"
  get password(): string {
    return this.registerData.contraseña;
  }

  set password(value: string) {
    this.registerData.contraseña = value;
  }

  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loading) return;
    this.loading = true;

    this.usuarioService.createUsuario(this.registerData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Usuario registrado exitosamente');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.notificationService.showError('Error al registrar usuario');
      },
      complete: () => this.loading = false
    });
  }
}
