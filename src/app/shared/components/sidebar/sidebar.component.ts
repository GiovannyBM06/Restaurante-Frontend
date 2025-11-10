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
  { path: '/categoria', title: 'Categorías', icon: 'ui-2_tags', class: '' },
  { path: '/productos', title: 'Productos', icon: 'shopping_box', class: '' },
  { path: '/usuarios', title: 'Usuarios', icon: 'users_single-02', class: '' },
  { path: '/cliente', title: 'Clientes', icon: 'users_circle-08', class: '' },
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
    this.menuItems = ROUTES;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}