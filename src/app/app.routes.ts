import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'categoria',
    loadComponent: () => import('./features/categoria/categoria-list/categoria-list.component').then(m => m.CategoriaListComponent),
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./features/usuario/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent),
  },
  {
  path: 'cliente',
  loadComponent: () => import('./features/cliente/cliente-list/cliente-list.component').then(m => m.ClienteListComponent)
  },
  {
    path: 'empleado',
    loadComponent: () => import('./features/empleado/empleado-list/empleado-list.component').then(m => m.EmpleadoListComponent),
  },
  {
    path: 'mesa',
    loadComponent: () => import('./features/mesa/mesa-list/mesa-list.component').then(m => m.MesaListComponent),
  },
  {
    path: 'orden',
    loadComponent: () => import('./features/orden/orden-list/orden-list.component').then(m => m.OrdenListComponent),
  },
  {
    path: 'factura',
    loadComponent: () => import('./features/factura/factura-list/factura-list.component').then(m => m.FacturaListComponent),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
