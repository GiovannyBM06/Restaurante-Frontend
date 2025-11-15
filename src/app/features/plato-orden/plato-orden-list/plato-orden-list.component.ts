import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PlatoOrdenService } from '../../../core/services/plato-orden.service';
import { PlatoService } from '../../../core/services/plato.service';
import { OrdenService } from '../../../core/services/orden.service';
import { PlatoOrden } from '../../../shared/models/plato-orden.model';
import { Plato } from '../../../shared/models/plato.model';
import { Orden } from '../../../shared/models/orden.model';

@Component({
  selector: 'app-plato-orden-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './plato-orden-list.component.html',
  styleUrls: ['./plato-orden-list.component.scss']
})
export class PlatoOrdenListComponent implements OnInit {
  platosOrden: PlatoOrden[] = [];
  platosOrdenFiltrados: PlatoOrden[] = [];
  form!: FormGroup;

  showModal = false;
  editingItem: PlatoOrden | null = null;
  loading = false;

  platos: Plato[] = [];
  ordenes: Orden[] = [];

  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private poService: PlatoOrdenService,
    private platoService: PlatoService,
    private ordenService: OrdenService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      id_orden: ['', Validators.required],
      id_plato: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  get totalPages(): number {
    return Math.ceil(this.platosOrdenFiltrados.length / this.itemsPerPage);
  }

  get paginatedPlatosOrden(): PlatoOrden[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.platosOrdenFiltrados.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  loadData(): void {
    this.loading = true;
    this.poService.getPlatosOrden().subscribe({
      next: (data) => {
        this.platosOrden = data;
        this.platosOrdenFiltrados = [...this.platosOrden];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando platos_orden', err);
        this.loading = false;
      },
    });

    this.platoService.getPlatos().subscribe({
      next: (data) => (this.platos = data),
      error: (err) => console.error('Error cargando platos', err),
    });

    this.ordenService.getOrdenes().subscribe({
      next: (data) => (this.ordenes = data),
      error: (err) => console.error('Error cargando órdenes', err),
    });
  }

  filtrar(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.platosOrdenFiltrados = this.platosOrden.filter((po) => {
      const plato = this.platos.find((p) => p.id === po.id_plato)?.nombre.toLowerCase() || '';
      const ordenId = po.id_orden.toLowerCase();
      return plato.includes(term) || ordenId.includes(term);
    });
  }

  obtenerNombrePlato(id: string): string {
    return this.platos.find((p) => p.id === id)?.nombre || '—';
  }

  obtenerPrecioPlato(id: string): number {
    return this.platos.find((p) => p.id === id)?.precio_unidad || 0;
  }

  openModal(item?: PlatoOrden): void {
    this.showModal = true;
    if (item) {
      this.editingItem = item;
      this.form.patchValue(item);
    } else {
      this.editingItem = null;
      this.form.reset({ cantidad: 1 });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.form.reset({ cantidad: 1 });
  }

  save(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const formValue = this.form.value;

  // Si quieres calcular subtotal automáticamente según el precio del plato:
  const plato = this.platos?.find((p: any) => p.id === formValue.id_plato);
  const subtotal = plato ? plato.precio_unidad * formValue.cantidad : formValue.subtotal;

  const payload = {
    ...formValue,
    subtotal,
  };

  if (this.editingItem) {
    // 👇 al actualizar, incluir id_usuario_mod
    const updatePayload = {
      ...payload,
      id_usuario_mod: '03df7fd7-27c4-42dd-b44d-299a5069de36', // Usuario predeterminado de modificación
    };

    this.poService
      .updatePlatoOrden(this.editingItem.id_orden, this.editingItem.id_plato, updatePayload)
      .subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => console.error('Error actualizando Plato_Orden', err),
      });
  } else {
    // 👇 al crear, incluir id_usuario
    const createPayload = {
      ...payload,
      id_usuario: '03df7fd7-27c4-42dd-b44d-299a5069de36', // Usuario predeterminado de creación
    };

    this.poService.createPlatoOrden(createPayload).subscribe({
      next: () => {
        this.loadData();
        this.closeModal();
      },
      error: (err) => console.error('Error creando Plato_Orden', err),
    });
  }
}


  delete(item: PlatoOrden): void {
    if (confirm(`¿Eliminar el plato "${this.obtenerNombrePlato(item.id_plato)}" de la orden "${item.id_orden}"?`)) {
      this.poService.deletePlatoOrden(item.id_orden, item.id_plato).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Error eliminando Plato_Orden', err),
      });
    }
  }
}
