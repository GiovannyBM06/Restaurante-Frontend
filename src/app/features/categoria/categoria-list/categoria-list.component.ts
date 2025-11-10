import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../shared/models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.scss']
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  categoriaForm!: FormGroup;

  loading = false;
  showModal = false;               // controla la visibilidad del modal
  editingCategoria: Categoria | null = null;

  searchTerm = '';

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategorias();
  }

  initForm(): void {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['']
    });
  }

  loadCategorias(): void {
    this.loading = true;
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.categoriasFiltradas = [...this.categorias];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener categorias', err);
        this.loading = false;
      }
    });
  }

  filtrarCategorias(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.categoriasFiltradas = [...this.categorias];
      return;
    }
    this.categoriasFiltradas = this.categorias.filter(c =>
      c.nombre.toLowerCase().includes(term)
    );
  }

  // Abrir modal para crear
  openCreateModal(): void {
    console.log('openCreateModal()');
    this.editingCategoria = null;
    this.categoriaForm.reset({ nombre: '', descripcion: '' });
    this.showModal = true;
    // enfocamos el campo nombre después de un tick si quieres (opcional)
    setTimeout(() => {
      const el = document.getElementById('categoria-nombre') as HTMLInputElement | null;
      el?.focus();
    });
  }

  // Abrir modal para editar
  editCategoria(categoria: Categoria): void {
    console.log('editCategoria()', categoria);
    this.editingCategoria = categoria;
    this.categoriaForm.patchValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || ''
    });
    this.showModal = true;
    setTimeout(() => {
      const el = document.getElementById('categoria-nombre') as HTMLInputElement | null;
      el?.focus();
    });
  }

  // Cerrar modal
  closeModal(): void {
    this.showModal = false;
    this.editingCategoria = null;
    this.categoriaForm.reset();
  }

  // Guardar (crear o actualizar)
  saveCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    const payload = this.categoriaForm.value;

    if (this.editingCategoria) {
      // actualizar
      this.categoriaService.updateCategoria(this.editingCategoria.id, payload).subscribe({
        next: (updated) => {
          this.loadCategorias();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error actualizando categoría', err);
        }
      });
    } else {
      // crear (ajusta id_usuario según tu auth)
      const crearPayload = {
        ...payload,
        id_usuario: payload.id_usuario || '00000000-0000-0000-0000-000000000001'
      };
      this.categoriaService.createCategoria(crearPayload).subscribe({
        next: (created) => {
          this.loadCategorias();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creando categoría', err);
        }
      });
    }
  }

  // Eliminar
  deleteCategoria(categoria: Categoria): void {
    if (!confirm(`¿Eliminar categoría "${categoria.nombre}"?`)) return;
    this.categoriaService.deleteCategoria(categoria.id).subscribe({
      next: (res) => this.loadCategorias(),
      error: (err) => console.error('Error eliminando categoría', err)
    });
  }

  // Cerrar modal al clickear backdrop
  onBackdropClick(event: MouseEvent): void {
    // si el click fue en el overlay (no en el contenido)
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }
}
