import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrdenService } from '../../../core/services/orden.service';
import { Orden } from '../../../shared/models/orden.model';
import { MesaService } from '../../../core/services/mesa.service';
import { EmpleadoService } from '../../../core/services/empleado.service';

@Component({
  selector: 'app-orden-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './orden-list.component.html',
  styleUrls: ['./orden-list.component.scss']
})
export class OrdenListComponent implements OnInit {
  ordenes: Orden[] = [];
  ordenesFiltradas: Orden[] = [];
  ordenForm!: FormGroup;
  showModal = false;
  editingOrden: Orden | null = null;
  searchEstado = '';
  loading = false;
  estadoFiltro: string = '';
  searchTerm: string = '';

  mesas: any[] = [];
  empleados: any[] = [];

  // Paginación
  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private ordenService: OrdenService,
    private mesaService: MesaService,
    private empleadoService: EmpleadoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadOrdenes();
    this.loadMesas();
    this.loadEmpleados();
    this.initForm();
  }

  initForm(): void {
    this.ordenForm = this.fb.group({
      estado: ['', Validators.required],
      id_mesa: ['', Validators.required],
      id_empleado: ['', Validators.required]
    });
  }

  get totalPages(): number {
    return Math.ceil(this.ordenesFiltradas.length / this.itemsPerPage);
  }

  get paginatedOrdenes(): Orden[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.ordenesFiltradas.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  loadOrdenes(): void {
    this.loading = true;
    this.ordenService.getOrdenes().subscribe({
      next: (data) => {
        this.ordenes = data;
        this.ordenesFiltradas = [...this.ordenes];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener órdenes:', err);
        this.loading = false;
      }
    });
  }

  loadMesas(): void {
    this.mesaService.getMesas().subscribe({
      next: (data) => (this.mesas = data),
      error: (err) => console.error('Error al obtener mesas:', err)
    });
  }

  loadEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe({
      next: (data) => (this.empleados = data),
      error: (err) => console.error('Error al obtener empleados:', err)
    });
  }

  filtrarOrdenes(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    this.ordenesFiltradas = this.ordenes.filter(orden => {
      const coincideBusqueda =
        orden.id.toLowerCase().includes(term) ||
        (orden.id_mesa && orden.id_mesa.toLowerCase().includes(term));

      const coincideEstado =
        !this.estadoFiltro || orden.estado === this.estadoFiltro;

      return coincideBusqueda && coincideEstado;
    });
  }
  openModal(orden?: Orden): void {
    this.showModal = true;
    if (orden) {
      this.editingOrden = orden;
      this.ordenForm.patchValue({
        estado: orden.estado,
        id_mesa: orden.id_mesa,
        id_empleado: orden.id_empleado
      });
    } else {
      this.editingOrden = null;
      this.ordenForm.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.ordenForm.reset();
  }

  saveOrden(): void {
    if (this.ordenForm.invalid) {
      this.ordenForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.ordenForm.value,
      id_usuario: '03df7fd7-27c4-42dd-b44d-299a5069de36'
    };

    if (this.editingOrden) {
      this.ordenService.updateOrden(this.editingOrden.id, payload).subscribe({
        next: () => {
          this.loadOrdenes();
          this.closeModal();
        },
        error: (err) => console.error('Error actualizando orden:', err)
      });
    } else {
      this.ordenService.createOrden(payload).subscribe({
        next: () => {
          this.loadOrdenes();
          this.closeModal();
        },
        error: (err) => console.error('Error creando orden:', err)
      });
    }
  }

  deleteOrden(orden: Orden): void {
    if (confirm(`¿Eliminar la orden con estado "${orden.estado}"?`)) {
      this.ordenService.deleteOrden(orden.id).subscribe({
        next: () => this.loadOrdenes(),
        error: (err) => console.error('Error al eliminar orden:', err)
      });
    }
  }
}
