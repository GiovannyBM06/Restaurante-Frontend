import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReservaService } from '../../../core/services/reserva.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { MesaService } from '../../../core/services/mesa.service';
import { Reserva } from '../../../shared/models/reserva.model';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reserva-list.component.html',
  styleUrls: ['./reserva-list.component.scss']
})
export class ReservaListComponent implements OnInit {
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  reservaForm!: FormGroup;
  showModal = false;
  editingReserva: Reserva | null = null;
  loading = false;
  searchTerm = '';
  estadoFiltro = '';

  clientes: any[] = [];
  mesas: any[] = [];

  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private reservaService: ReservaService,
    private clienteService: ClienteService,
    private mesaService: MesaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadReservas();
    this.loadClientes();
    this.loadMesas();
    this.initForm();
  }

  initForm(): void {
    this.reservaForm = this.fb.group({
      id_cliente: ['', Validators.required],
      id_mesa: ['', Validators.required],
      cantidad_personas: ['', [Validators.required, Validators.min(1)]],
      fecha_Hora: ['', Validators.required],
      Estado: [true, Validators.required],
    });
  }

  get totalPages(): number {
    return Math.ceil(this.reservasFiltradas.length / this.itemsPerPage);
  }

  get paginatedReservas(): Reserva[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.reservasFiltradas.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  loadReservas(): void {
    this.loading = true;
    this.reservaService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.reservasFiltradas = [...this.reservas];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener reservas:', err);
        this.loading = false;
      },
    });
  }

  loadClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => console.error('Error al obtener clientes:', err),
    });
  }

  loadMesas(): void {
    this.mesaService.getMesas().subscribe({
      next: (data) => (this.mesas = data),
      error: (err) => console.error('Error al obtener mesas:', err),
    });
  }

  filtrarReservas(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.reservasFiltradas = this.reservas.filter((r) => {
      const coincideBusqueda =
        r.id_cliente.toLowerCase().includes(term) ||
        r.id_mesa.toLowerCase().includes(term);

      const coincideEstado =
        !this.estadoFiltro ||
        (this.estadoFiltro === 'Activa' && r.Estado) ||
        (this.estadoFiltro === 'Inactiva' && !r.Estado);

      return coincideBusqueda && coincideEstado;
    });
  }

  openModal(reserva?: Reserva): void {
    this.showModal = true;
    if (reserva) {
      this.editingReserva = reserva;
      this.reservaForm.patchValue(reserva);
    } else {
      this.editingReserva = null;
      this.reservaForm.reset({ Estado: true });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.reservaForm.reset();
  }

  saveReserva(): void {
    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.reservaForm.value,
      id_usuario: '03df7fd7-27c4-42dd-b44d-299a5069de36',
    };

    if (this.editingReserva) {
      this.reservaService
        .updateReserva(this.editingReserva.id_cliente, this.editingReserva.id_mesa, payload)
        .subscribe({
          next: () => {
            this.loadReservas();
            this.closeModal();
          },
          error: (err) => console.error('Error actualizando reserva:', err),
        });
    } else {
      this.reservaService.createReserva(payload).subscribe({
        next: () => {
          this.loadReservas();
          this.closeModal();
        },
        error: (err) => console.error('Error creando reserva:', err),
      });
    }
  }

  deleteReserva(reserva: Reserva): void {
    if (confirm(`¿Eliminar la reserva del cliente ${reserva.id_cliente}?`)) {
      this.reservaService.deleteReserva(reserva.id_cliente, reserva.id_mesa).subscribe({
        next: () => this.loadReservas(),
        error: (err) => console.error('Error al eliminar reserva:', err),
      });
    }
  }
}
