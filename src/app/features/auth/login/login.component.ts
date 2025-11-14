import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem;
    }
    
    .login-card {
      width: 100%;
      max-width: 450px;
    }

    .login-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: pulse 2s infinite;
      color: var(--primary-color);
    }

    .login-icon i {
      font-size: 3rem;
      color: var(--primary-color);
    }

    .login-subtitle {
      color: #2c3e50;
      font-size: 1rem;
      margin-bottom: 0;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .login-form {
      margin-top: 1.5rem;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .label-icon {
      font-size: 1.125rem;
      color: var(--primary-color);
    }

    .label-icon i {
      font-size: 1.125rem;
      color: var(--primary-color);
    }

    .form-control {
      margin-top: 0.5rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    }

    .form-options {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 0.5rem;
      border-radius: var(--radius-sm);
    }

    .link:hover {
      background: rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }

    .link-icon {
      font-size: 1rem;
    }

    .link-icon i {
      font-size: 1rem;
      margin-right: 0.25rem;
    }

    .btn.loading {
      opacity: 0.8;
      cursor: not-allowed;
    }

    .btn-icon {
      margin-right: 0.5rem;
    }

    .btn-icon i {
      font-size: 1rem;
      margin-right: 0.25rem;
    }

    .demo-credentials {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: var(--radius-md);
      padding: 1rem;
      margin: 1.5rem 0;
      text-align: center;
    }

    .demo-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      color: var(--primary-color);
      font-size: 0.875rem;
    }

    .demo-icon {
      font-size: 1.125rem;
    }

    .demo-icon i {
      font-size: 1.125rem;
      color: var(--primary-color);
    }

    .demo-info {
      color: #2c3e50;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .demo-info p {
      margin: 0.25rem 0;
    }

    .credential-group {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-sm);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .credential-group:last-child {
      margin-bottom: 0;
    }

    .credential-group h4 {
      margin: 0 0 0.75rem 0;
      color: var(--primary-color);
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .credential-group h4 i {
      font-size: 1rem;
      color: var(--primary-color);
    }

    .role-info {
      font-style: italic;
      color: #7f8c8d;
      font-size: 0.8rem;
      margin-top: 0.5rem !important;
    }


    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    @media (max-width: 768px) {
      .login-container {
        padding: 1rem;
      }

      .login-card {
        max-width: 100%;
      }

      .login-icon {
        font-size: 2.5rem;
      }
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 0.5rem;
      }

      .form-label {
        font-size: 0.875rem;
      }

      .link {
        font-size: 0.875rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginData: LoginRequest = {
    email: '',
    contrasena: ''
  };
  
  loading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  onSubmit(): void {
    if (this.loading) return;
    console.log('Intentando login con:', this.loginData);
    this.loading = true;
    
    this.authService.login(this.loginData).subscribe({
    next: (response) => {
      console.log('Respuesta del login:', response);
      this.authService.setUserData(response);
      this.notificationService.showSuccess('Inicio de sesión exitoso');
      this.router.navigate(['/dashboard']);
      this.loading = false;
    },
    error: (error) => {
      console.error('Error en login:', error);
      console.error('Error completo:', JSON.stringify(error));
      const errorMsg = error?.error?.detail || 'Error al iniciar sesión. Verifica tus credenciales.';
      this.notificationService.showError(errorMsg);
      this.loading = false;
    }
  });
  }
}
