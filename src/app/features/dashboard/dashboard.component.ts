import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard fade-in">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="card glass">
          <div class="card-body text-center">
            <div class="welcome-icon"></div>
            <h1 class="welcome-title text-title-contrast">¡Bienvenido al Sistema!</h1>
            <p class="welcome-subtitle text-high-contrast">Sistema de gestión de Restaurante</p>
          </div>
        </div>
      </div>

      <!-- Modules Grid -->
      <div class="modules-grid">
        <div class="module-card slide-in-up" style="animation-delay: 0.1s">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">📁</div>
              <h3 class="module-title">Categorías</h3>
              <p class="module-description">Gestiona las categorías de lo platos</p>
              <a routerLink="/categoria" class="btn btn-primary btn-lg">
                Ver Categorías
              </a>
            </div>
          </div>
        </div>

        <div class="module-card slide-in-up" style="animation-delay: 0.2s">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">👥</div>
              <h3 class="module-title">Usuarios</h3>
              <p class="module-description">Administra los usuarios del sistema</p>
              <a routerLink="/usuarios" class="btn btn-primary btn-lg">
                Ver Usuarios
              </a>
            </div>
          </div>
        </div>

        <div class="module-card slide-in-up" style="animation-delay: 0.3s">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">🍽️</div>
              <h3 class="module-title">Platos</h3>
              <p class="module-description">Visualiza los platos del sistema</p>
              <a routerLink="/plato" class="btn btn-primary btn-lg">
                Ver Platos
              </a>
            </div>
          </div>
        </div>

        <div class="module-card slide-in-up" style="animation-delay: 0.3s">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">🧔🏻‍♂️</div>
              <h3 class="module-title">Clientes</h3>
              <p class="module-description">Visualiza los clientes del sistema</p>
              <a routerLink="/cliente" class="btn btn-primary btn-lg">
                Ver Clientes
              </a>
            </div>
          </div>
        </div>

        <div class="module-card slide-in-up" style="animation-delay: 0.3s">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">🧑🏻‍🍳</div>
              <h3 class="module-title">Empleados</h3>
              <p class="module-description">Visualiza los empleados</p>
              <a routerLink="/empleado" class="btn btn-primary btn-lg">
                Ver Empleados
              </a>
            </div>
          </div>
        </div>

        <div class="module-card slide-in-up" style="animation-delay: 0.3s">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">🪑</div>
              <h3 class="module-title">Mesas</h3>
              <p class="module-description">Visualiza las mesas del restaurante</p>
              <a routerLink="/mesa" class="btn btn-primary btn-lg">
                Ver Mesas
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem 0;
    }

    .welcome-section {
      margin-bottom: 3rem;
      color: black;
      background-color: rgba(161, 161, 161, 1); 
      border-radius: 0;
    }

    .welcome-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 2s infinite;
    }

    .welcome-title {
      color: rgba(0, 0, 0, 0.95);
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .welcome-subtitle {
      font-size: 1.125rem;
      color: rgba(0, 0, 0, 0.95);
      margin-bottom: 0;
      font-weight: 500;
    }


    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .module-card {
      transition: transform 0.3s ease;
    }

    .module-card:hover {
      transform: translateY(-5px);
    }

    .module-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .module-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--dark-color);
    }

    .module-description {
      color: #475569;
      margin-bottom: 1.5rem;
      line-height: 1.6;
      font-weight: 500;
    }

    .module-features {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .feature-tag {
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .btn-icon {
      margin-right: 0.5rem;
    }

    .quick-actions {
      margin-top: 2rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: var(--radius-md);
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .action-text {
      font-weight: 500;
      font-size: 0.875rem;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    @media (max-width: 768px) {
      .welcome-title {
        font-size: 2rem;
      }

      .stats-row {
        gap: 1rem;
      }

      .stat-number {
        font-size: 1.5rem;
      }

      .modules-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .dashboard {
        padding: 1rem 0;
      }

      .welcome-title {
        font-size: 1.75rem;
      }

      .stats-row {
        flex-direction: column;
        gap: 0.5rem;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // Aquí se pueden cargar estadísticas del dashboard
  }
}
