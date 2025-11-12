import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlatoService } from '../../../core/services/plato.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Plato } from '../../../shared/models/plato.model';
import { Categoria } from '../../../shared/models/categoria.model';

@Component({
  selector: 'app-plato-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './plato-list.component.html',
  styleUrls: ['./plato-list.component.scss']
})
export class PlatoListComponent implements OnInit {
  platos: Plato[] = [];
  platosFiltrados: Plato[] = [];
  categorias: Categoria[] = [];

  platoForm!: FormGroup;
  showModal = false;
  editingPlato: Plato | null = null;
  loading = false;

  // filtros
  searchTerm = '';
  categoriaFiltro = '';

  // paginación
  currentPage = 1;
  itemsPerPage = 5;

  // ID de usuario por defecto (como en tu otro componente)
  private readonly defaultUserId = '03df7fd7-27c4-42dd-b44d-299a5069de36';

  constructor(
    private platoService: PlatoService,
    private categoriaService: CategoriaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPlatos();
    this.loadCategorias();
  }

  initForm(): void {
    this.platoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      precio_unidad: [0, [Validators.required, Validators.min(0)]],
      descripcion: [''],
      id_categoria: ['', Validators.required],
    });
  }

  get totalPages(): number {
    return Math.ceil(this.platosFiltrados.length / this.itemsPerPage);
  }

  get paginatedPlatos(): Plato[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.platosFiltrados.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  loadPlatos(): void {
    this.loading = true;
    this.platoService.getPlatos().subscribe({
      next: (data) => {
        this.platos = data;
        this.platosFiltrados = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener platos:', err);
        this.loading = false;
      },
    });
  }

  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al obtener categorías:', err),
    });
  }

  filtrarPlatos(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.platosFiltrados = this.platos.filter((p) => {
      const coincideBusqueda =
        p.nombre?.toLowerCase().includes(term) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(term));
      const coincideCategoria =
        !this.categoriaFiltro || p.id_categoria === this.categoriaFiltro;
      return coincideBusqueda && coincideCategoria;
    });
    if (this.currentPage > this.totalPages) this.currentPage = 1;
  }

  openModal(plato?: Plato): void {
    this.showModal = true;
    if (plato) {
      this.editingPlato = plato;
      this.platoForm.patchValue({
        nombre: plato.nombre,
        precio_unidad: plato.precio_unidad,
        descripcion: plato.descripcion,
        id_categoria: plato.id_categoria,
      });
    } else {
      this.editingPlato = null;
      this.platoForm.reset({
        nombre: '',
        precio_unidad: 0,
        descripcion: '',
        id_categoria: '',
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.platoForm.reset();
  }

  savePlato(): void {
    if (this.platoForm.invalid) {
      this.platoForm.markAllAsTouched();
      return;
    }

    const payload: any = {
      ...this.platoForm.value,
      id_usuario: this.defaultUserId,
    };

    if (this.editingPlato) {
      this.platoService.updatePlato(this.editingPlato.id, payload).subscribe({
        next: () => {
          this.loadPlatos();
          this.closeModal();
        },
        error: (err) => console.error('Error al actualizar plato:', err),
      });
    } else {
      this.platoService.createPlato(payload).subscribe({
        next: () => {
          this.loadPlatos();
          this.closeModal();
        },
        error: (err) => console.error('Error al crear plato:', err),
      });
    }
  }

  deletePlato(plato: Plato): void {
    if (confirm(`¿Eliminar el plato "${plato.nombre}"?`)) {
      this.platoService.deletePlato(plato.id).subscribe({
        next: () => this.loadPlatos(),
        error: (err) => console.error('Error al eliminar plato:', err),
      });
    }
  }
}
