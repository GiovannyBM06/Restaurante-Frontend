import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente } from '../../shared/models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:4000/clientes';

  constructor(private http: HttpClient) {}

  /** 🔹 Obtener lista de clientes */
  getClientes(): Observable<Cliente[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(clientes =>
        clientes.map(c => ({
          ...c,
          email: c.Email ?? c.email // normaliza el campo
        }))
      )
    );
  }

  /** 🔹 Crear cliente (corrige mayúscula) */
  createCliente(cliente: Partial<Cliente>): Observable<Cliente> {
    const payload = {
      ...cliente,
      Email: cliente.Email,  // backend espera 'Email'
    };
    delete (payload as any).email;

    return this.http.post<Cliente>(this.apiUrl, payload);
  }

  /** 🔹 Editar cliente (corrige mayúscula) */
  updateCliente(id: string, cliente: Partial<Cliente>): Observable<Cliente> {
    const payload = {
      ...cliente,
      Email: cliente.Email,  // backend espera 'Email'
    };
    delete (payload as any).email;

    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, payload);
  }

  /** 🔹 Eliminar cliente */
  deleteCliente(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
