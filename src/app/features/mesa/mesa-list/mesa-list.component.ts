import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MesaService } from '../../../core/services/mesa.service';
import { Mesa } from '../../../shared/models/mesa.model';

@Component({
  selector: 'app-mesa-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './mesa-list.component.html',
  styleUrls: ['./mesa-list.component.scss']
})
export class MesaListComponent implements OnInit {
  mesas: Mesa[] = [];
  mesasFiltradas: Mesa[] = [];
  mesaForm!: FormGroup;
  showModal = false;
  editingMesa: Mesa | null = null;
  loading = false;

  // 🔹 Filtros por rango
  filtroMin: number | null = null;
  filtroMax: number | null = null;

  // 🔹 Paginación
  currentPage = 1;
  pageSize = 5;

  constructor(
    private mesaService: MesaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadMesas();
    this.initForm();
  }

  initForm(): void {
    this.mesaForm = this.fb.group({
      capacidad: ['', [Validators.required, Validators.min(1)]]
    });
  }

  loadMesas(): void {
    this.loading = true;
    this.mesaService.getMesas().subscribe({
      next: (data) => {
        this.mesas = data;
        this.mesasFiltradas = [...this.mesas];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener mesas:', err);
        this.loading = false;
      }
    });
  }

  // 🔹 Filtro por rango de capacidad
  filtrarMesas(): void {
    this.mesasFiltradas = this.mesas.filter(mesa => {
      const min = this.filtroMin ?? 0;
      const max = this.filtroMax ?? Number.MAX_SAFE_INTEGER;
      return mesa.capacidad >= min && mesa.capacidad <= max;
    });

    // Reiniciar paginación al aplicar filtro
    this.currentPage = 1;
  }

  openModal(mesa?: Mesa): void {
    this.showModal = true;
    if (mesa) {
      this.editingMesa = mesa;
      this.mesaForm.patchValue({ capacidad: mesa.capacidad });
    } else {
      this.editingMesa = null;
      this.mesaForm.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.mesaForm.reset();
  }

  saveMesa(): void {
    if (this.mesaForm.invalid) {
      this.mesaForm.markAllAsTouched();
      return;
    }

    const payload = { ...this.mesaForm.value };

    if (this.editingMesa) {
      // 🔄 Actualizar mesa existente
      this.mesaService.updateMesa(this.editingMesa.id, payload).subscribe({
        next: () => {
          this.loadMesas();
          this.closeModal();
        },
        error: err => console.error('Error actualizando mesa:', err)
      });
    } else {
      // 🆕 Crear nueva mesa (id_usuario fijo)
      const crearPayload = {
        ...payload,
        id_usuario: '03df7fd7-27c4-42dd-b44d-299a5069de36'
      };
      this.mesaService.createMesa(crearPayload).subscribe({
        next: () => {
          this.loadMesas();
          this.closeModal();
        },
        error: err => console.error('Error creando mesa:', err)
      });
    }
  }

  deleteMesa(mesa: Mesa): void {
    if (confirm(`¿Eliminar la mesa con capacidad ${mesa.capacidad}?`)) {
      this.mesaService.deleteMesa(mesa.id).subscribe({
        next: () => this.loadMesas(),
        error: err => console.error('Error eliminando mesa:', err)
      });
    }
  }

  // 🔹 Métodos de paginación
  get totalPages(): number {
    return Math.ceil(this.mesasFiltradas.length / this.pageSize);
  }

  get paginatedMesas(): Mesa[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.mesasFiltradas.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
