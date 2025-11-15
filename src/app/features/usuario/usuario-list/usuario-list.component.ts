import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.scss']
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuarioForm!: FormGroup;
  showModal = false;
  editingUsuario: Usuario | null = null;
  loading = false;
  searchTerm = '';

  // Paginación
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsuarios();
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  loadUsuarios(): void {
    this.loading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.filtrarUsuarios();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener usuarios', err);
        this.loading = false;
      }
    });
  }

  filtrarUsuarios(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(term) ||
      u.apellido.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.usuariosFiltrados.length / this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  get paginatedUsuarios(): Usuario[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.usuariosFiltrados.slice(start, end);
  }

  openCreateModal(): void {
    this.editingUsuario = null;
    this.usuarioForm.reset();
    this.showModal = true;
  }

  editUsuario(usuario: Usuario): void {
    this.editingUsuario = usuario;
    this.usuarioForm.patchValue(usuario);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUsuario = null;
    this.usuarioForm.reset();
  }

  saveUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const payload = this.usuarioForm.value;

    if (this.editingUsuario) {
      this.usuarioService.updateUsuario(this.editingUsuario.id, payload).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (err) => console.error('Error actualizando usuario', err)
      });
    } else {
      this.usuarioService.createUsuario(payload).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (err) => console.error('Error creando usuario', err)
      });
    }
  }

  deleteUsuario(usuario: Usuario): void {
    if (!confirm(`¿Eliminar usuario "${usuario.nombre} ${usuario.apellido}"?`)) return;
    this.usuarioService.deleteUsuario(usuario.id).subscribe({
      next: () => this.loadUsuarios(),
      error: (err) => console.error('Error eliminando usuario', err)
    });
  }
}
