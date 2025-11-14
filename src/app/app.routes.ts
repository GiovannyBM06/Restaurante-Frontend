import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
/*import { AuthLogin } from './core/guards/auth.login';*/

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'categoria',
    loadComponent: () => import('./features/categoria/categoria-list/categoria-list.component').then(m => m.CategoriaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./features/usuario/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent),
    canActivate: [AuthGuard]
  },
  {
  path: 'cliente',
  loadComponent: () => import('./features/cliente/cliente-list/cliente-list.component').then(m => m.ClienteListComponent),
  canActivate: [AuthGuard]
  },
  {
    path: 'empleado',
    loadComponent: () => import('./features/empleado/empleado-list/empleado-list.component').then(m => m.EmpleadoListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'mesa',
    loadComponent: () => import('./features/mesa/mesa-list/mesa-list.component').then(m => m.MesaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'orden',
    loadComponent: () => import('./features/orden/orden-list/orden-list.component').then(m => m.OrdenListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'factura',
    loadComponent: () => import('./features/factura/factura-list/factura-list.component').then(m => m.FacturaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'reserva',
    loadComponent: () => import('./features/reserva/reserva-list/reserva-list.component').then(m => m.ReservaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'plato',
    loadComponent: () => import('./features/plato/plato-list/plato-list.component').then(m => m.PlatoListComponent),
  },
  {
    path: 'platoorden',
    loadComponent: () => import('./features/plato-orden/plato-orden-list/plato-orden-list.component').then(m => m.PlatoOrdenListComponent),
    canActivate: [AuthGuard]
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
