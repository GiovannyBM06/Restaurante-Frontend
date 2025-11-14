import { Routes } from '@angular/router';
import { LoginGuard } from '../../core/guards/login.guard';
//import { LoginGuard } from 'src/app/core/guards/login.guard';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [LoginGuard] 
  }
];
