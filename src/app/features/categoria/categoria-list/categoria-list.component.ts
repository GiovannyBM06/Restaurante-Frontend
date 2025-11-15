import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../shared/models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.scss']
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  categoriaForm!: FormGroup;

  loading = false;
  showModal = false;
  editingCategoria: Categoria | null = null;
  searchTerm = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

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
        this.filtrarCategorias();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener categorías', err);
        this.loading = false;
      }
    });
  }

  filtrarCategorias(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.categoriasFiltradas = [...this.categorias];
    } else {
      this.categoriasFiltradas = this.categorias.filter(c =>
        c.nombre.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  // 🔹 Actualiza total de páginas
  updatePagination(): void {
    this.totalPages = Math.ceil(this.categoriasFiltradas.length / this.pageSize);
  }

  // 🔹 Cambiar página
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // 🔹 Categorías visibles en la página actual
  get paginatedCategorias(): Categoria[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.categoriasFiltradas.slice(start, end);
  }

  openCreateModal(): void {
    this.editingCategoria = null;
    this.categoriaForm.reset({ nombre: '', descripcion: '' });
    this.showModal = true;
  }

  editCategoria(categoria: Categoria): void {
    this.editingCategoria = categoria;
    this.categoriaForm.patchValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || ''
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCategoria = null;
    this.categoriaForm.reset();
  }

  saveCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    const payload = this.categoriaForm.value;

    if (this.editingCategoria) {
      this.categoriaService.updateCategoria(this.editingCategoria.id, payload).subscribe({
        next: () => {
          this.loadCategorias();
          this.closeModal();
        },
        error: (err) => console.error('Error actualizando categoría', err)
      });
    } else {
      const crearPayload = {
        ...payload,
        id_usuario: '03df7fd7-27c4-42dd-b44d-299a5069de36'
      };
      this.categoriaService.createCategoria(crearPayload).subscribe({
        next: () => {
          this.loadCategorias();
          this.closeModal();
        },
        error: (err) => console.error('Error creando categoría', err)
      });
    }
  }

  deleteCategoria(categoria: Categoria): void {
    if (!confirm(`¿Eliminar categoría "${categoria.nombre}"?`)) return;
    this.categoriaService.deleteCategoria(categoria.id).subscribe({
      next: () => this.loadCategorias(),
      error: (err) => console.error('Error eliminando categoría', err)
    });
  }
}
