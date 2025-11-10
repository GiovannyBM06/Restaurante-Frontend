import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  filtro: string = '';
  loading = false;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsuarios();
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
    });
  }

  loadUsuarios(): void {
    this.loading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = [...this.usuarios];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        this.loading = false;
      }
    });
  }

  filtrarUsuarios(): void {
    const term = this.filtro.toLowerCase().trim();
    if (!term) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(term) ||
      usuario.apellido.toLowerCase().includes(term)
    );
  }

  openModal(usuario?: Usuario): void {
    this.showModal = true;
    if (usuario) {
      this.editingUsuario = usuario;
      this.usuarioForm.patchValue(usuario);
    } else {
      this.editingUsuario = null;
      this.usuarioForm.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.usuarioForm.reset();
  }

  saveUsuario(): void {
    if (this.usuarioForm.invalid) return;
    const data = this.usuarioForm.value;

    if (this.editingUsuario) {
      this.usuarioService.updateUsuario(this.editingUsuario.id, data).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: err => console.error('Error al editar usuario:', err)
      });
    } else {
      this.usuarioService.createUsuario(data).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: err => console.error('Error al crear usuario:', err)
      });
    }
  }

  deleteUsuario(usuario: Usuario): void {
    if (confirm(`¿Eliminar al usuario "${usuario.nombre} ${usuario.apellido}"?`)) {
      this.usuarioService.deleteUsuario(usuario.id).subscribe({
        next: () => this.loadUsuarios(),
        error: err => console.error('Error al eliminar usuario:', err)
      });
    }
  }
}
