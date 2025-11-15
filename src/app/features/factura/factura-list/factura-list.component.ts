import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FacturaService } from '../../../core/services/factura.service';
import { Factura } from '../../../shared/models/factura.model';
import { OrdenService } from '../../../core/services/orden.service';

@Component({
  selector: 'app-factura-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './factura-list.component.html',
  styleUrls: ['./factura-list.component.scss']
})
export class FacturaListComponent implements OnInit {
  facturas: Factura[] = [];
  facturasFiltradas: Factura[] = [];
  facturaForm!: FormGroup;
  showModal = false;
  editingFactura: Factura | null = null;
  loading = false;

  // Filtros
  metodoPagoFiltro = '';
  searchTerm = '';

  // Relaciones
  ordenes: any[] = [];

  // Paginación
  currentPage = 1;
  itemsPerPage = 5;

  metodosPago = ['Efectivo', 'Tarjeta', 'Transferencia'];

  constructor(
    private facturaService: FacturaService,
    private ordenService: OrdenService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadFacturas();
    this.loadOrdenes();
    this.initForm();
  }

  initForm(): void {
    this.facturaForm = this.fb.group({
      total: ['', [Validators.required, Validators.min(0)]],
      metodo_pago: ['', Validators.required],
      id_orden: ['', Validators.required]
    });
  }

  get totalPages(): number {
    return Math.ceil(this.facturasFiltradas.length / this.itemsPerPage);
  }

  get paginatedFacturas(): Factura[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.facturasFiltradas.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  loadFacturas(): void {
    this.loading = true;
    this.facturaService.getFacturas().subscribe({
      next: (data) => {
        this.facturas = data;
        this.facturasFiltradas = [...this.facturas];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener facturas:', err);
        this.loading = false;
      }
    });
  }

  loadOrdenes(): void {
    this.ordenService.getOrdenes().subscribe({
      next: (data) => (this.ordenes = data),
      error: (err) => console.error('Error al obtener órdenes:', err)
    });
  }

  filtrarFacturas(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.facturasFiltradas = this.facturas.filter(factura => {
      const coincideBusqueda =
        factura.id.toLowerCase().includes(term) ||
        (factura.id_orden && factura.id_orden.toLowerCase().includes(term));

      const coincideMetodo =
        !this.metodoPagoFiltro || factura.metodo_pago === this.metodoPagoFiltro;

      return coincideBusqueda && coincideMetodo;
    });
  }

  openModal(factura?: Factura): void {
    this.showModal = true;
    if (factura) {
      this.editingFactura = factura;
      this.facturaForm.patchValue({
        total: factura.total,
        metodo_pago: factura.metodo_pago,
        id_orden: factura.id_orden
      });
    } else {
      this.editingFactura = null;
      this.facturaForm.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.facturaForm.reset();
  }

  saveFactura(): void {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      return;
    }

    if (this.editingFactura) {
  const payload = {
    ...this.facturaForm.value,
    id_usuario_mod: '03df7fd7-27c4-42dd-b44d-299a5069de36' // 👈 CAMBIAR AQUÍ
  };

  this.facturaService.updateFactura(this.editingFactura.id, payload).subscribe({
    next: () => {
      this.loadFacturas();
      this.closeModal();
    },
    error: (err) => console.error('Error actualizando factura:', err)
  });
} else {
  const payload = {
    ...this.facturaForm.value,
    id_usuario: '03df7fd7-27c4-42dd-b44d-299a5069de36'
  };

  this.facturaService.createFactura(payload).subscribe({
    next: () => {
      this.loadFacturas();
      this.closeModal();
    },
    error: (err) => console.error('Error creando factura:', err)
  });
}

  }

  deleteFactura(factura: Factura): void {
    if (confirm(`¿Eliminar la factura con método "${factura.metodo_pago}"?`)) {
      this.facturaService.deleteFactura(factura.id).subscribe({
        next: () => this.loadFacturas(),
        error: (err) => console.error('Error al eliminar factura:', err)
      });
    }
  }
}
