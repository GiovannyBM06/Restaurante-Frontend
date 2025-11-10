import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../shared/models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  paginatedClientes: Cliente[] = [];
  clienteForm!: FormGroup;
  showModal = false;
  editingCliente: Cliente | null = null;
  searchTerm = '';
  loading = false;

  // 🔹 Paginación
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadClientes();
    this.initForm();
  }

  initForm(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required]
    });
  }

  loadClientes(): void {
    this.loading = true;
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = [...this.clientes];
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener clientes:', err);
        this.loading = false;
      }
    });
  }

  filtrarClientes(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.clientesFiltrados = [...this.clientes];
    } else {
      this.clientesFiltrados = this.clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  // 🔹 Actualiza los datos paginados
  updatePagination(): void {
    this.totalPages = Math.ceil(this.clientesFiltrados.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedClientes = this.clientesFiltrados.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  openModal(cliente?: Cliente): void {
    this.showModal = true;
    if (cliente) {
      this.editingCliente = cliente;
      this.clienteForm.patchValue({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        email: cliente.Email,
        telefono: cliente.telefono
      });
    } else {
      this.editingCliente = null;
      this.clienteForm.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.clienteForm.reset();
  }

  saveCliente(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.clienteForm.value,
      Email: this.clienteForm.value.email,
    };

    if (this.editingCliente) {
      this.clienteService.updateCliente(this.editingCliente.id, payload).subscribe({
        next: () => {
          this.loadClientes();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error actualizando cliente', err);
        }
      });
    } else {
      const crearPayload = {
        ...payload,
        id_usuario: payload.id_usuario || '03df7fd7-27c4-42dd-b44d-299a5069de36'
      };

      this.clienteService.createCliente(crearPayload).subscribe({
        next: () => {
          this.loadClientes();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creando cliente', err);
        }
      });
    }
  }

  deleteCliente(cliente: Cliente): void {
    if (confirm(`¿Eliminar al cliente "${cliente.nombre} ${cliente.apellido}"?`)) {
      this.clienteService.deleteCliente(cliente.id).subscribe({
        next: () => this.loadClientes(),
        error: err => console.error('Error al eliminar cliente:', err)
      });
    }
  }
}
