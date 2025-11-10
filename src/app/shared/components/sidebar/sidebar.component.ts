import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  roles?: string[];
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'design_app', class: '' }, 
  { path: '/pruebas', title: 'Pruebas',  icon: 'shopping_box', class: '' },
  { path: '/categorias', title: 'Categorías', icon:'design_app', class: '', roles: ['admin'] },
  { path: '/usuarios', title: 'Usuarios', icon:'design_app', class: '', roles: ['admin'] },
  { path: '/clientes', title: 'Clientes', icon: 'design_app', class: '' },
  { path: '/empleados', title: 'Empleados', icon: 'design_app', class: '', roles: ['admin'] },
  { path: '/facturas', title: 'Facturas', icon: 'design_app', class: '', roles: ['admin'] },
  { path: '/mesas', title: 'Mesas', icon: 'design_app', class: '' },
  { path: '/ordenes', title: 'Órdenes', icon: 'design_app', class: '' },
  { path: '/platos', title: 'Platos', icon: 'design_app', class: '' },
  { path: '/plato-orden', title: 'Plato-orden', icon: 'design_app', class: '', roles: ['admin'] },
  { path: '/reservas', title: 'Reservas', icon: 'design_app', class: '' },
];


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Mostrar todo mientras desarrollas
    this.menuItems = ROUTES;

    // En producción podrías usar:
    // this.menuItems = ROUTES.filter(menuItem => this.canAccessMenuItem(menuItem));
  }

  canAccessMenuItem(menuItem: RouteInfo): boolean {
    if (!menuItem.roles || menuItem.roles.length === 0) {
      return true;
    }
    const userRole = this.authService.getUserRole();
    return userRole ? menuItem.roles.includes(userRole) : false;
  }

  isMobileMenu() {
    return window.innerWidth <= 991;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
