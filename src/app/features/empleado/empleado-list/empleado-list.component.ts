import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpleadoService } from '../../../core/services/empleado.service';
import { Empleado } from '../../../shared/models/empleado.model';

@Component({
  selector: 'app-empleado-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './empleado-list.component.html',
  styleUrls: ['./empleado-list.component.scss']
})
export class EmpleadoListComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  empleadoForm!: FormGroup;
  showModal = false;
  editingEmpleado: Empleado | null = null;
  searchTerm = '';
  loading = false;

  // 🔹 Paginación
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(
    private empleadoService: EmpleadoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadEmpleados();
    this.initForm();
  }

  initForm(): void {
    this.empleadoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      rol: ['', Validators.required],
      salario: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadEmpleados(): void {
    this.loading = true;
    this.empleadoService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.empleadosFiltrados = [...this.empleados];
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener empleados:', err);
        this.loading = false;
      }
    });
  }

  // 🔹 Filtro
  filtrarEmpleados(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.empleadosFiltrados = term
      ? this.empleados.filter(e =>
          e.nombre.toLowerCase().includes(term) ||
          e.apellido.toLowerCase().includes(term)
        )
      : [...this.empleados];

    this.updatePagination();
  }

  // 🔹 Paginación
  get paginatedEmpleados(): Empleado[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.empleadosFiltrados.slice(start, start + this.pageSize);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.empleadosFiltrados.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // 🔹 Modal
  openModal(empleado?: Empleado): void {
    this.showModal = true;
    if (empleado) {
      this.editingEmpleado = empleado;
      this.empleadoForm.patchValue({
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        rol: empleado.rol,
        salario: empleado.salario
      });
    } else {
      this.editingEmpleado = null;
      this.empleadoForm.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.empleadoForm.reset();
  }

  // 🔹 Guardar o actualizar
  saveEmpleado(): void {
    if (this.empleadoForm.invalid) {
      this.empleadoForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.empleadoForm.value,
      id_usuario: '03df7fd7-27c4-42dd-b44d-299a5069de36' // ID fijo
    };

    if (this.editingEmpleado) {
      this.empleadoService.updateEmpleado(this.editingEmpleado.id, payload).subscribe({
        next: () => {
          this.loadEmpleados();
          this.closeModal();
        },
        error: (err) => console.error('Error actualizando empleado:', err)
      });
    } else {
      this.empleadoService.createEmpleado(payload).subscribe({
        next: () => {
          this.loadEmpleados();
          this.closeModal();
        },
        error: (err) => console.error('Error creando empleado:', err)
      });
    }
  }

  deleteEmpleado(empleado: Empleado): void {
    if (confirm(`¿Eliminar al empleado "${empleado.nombre} ${empleado.apellido}"?`)) {
      this.empleadoService.deleteEmpleado(empleado.id).subscribe({
        next: () => this.loadEmpleados(),
        error: (err) => console.error('Error al eliminar empleado:', err)
      });
    }
  }
}
