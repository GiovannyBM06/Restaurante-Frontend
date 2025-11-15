import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orden } from '../../shared/models/orden.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private apiUrl = 'http://127.0.0.1:4000/ordenes';

  constructor(private http: HttpClient) {}

  getOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/`);
  }

  createOrden(orden: Orden): Observable<Orden> {
    return this.http.post<Orden>(`${this.apiUrl}/`, orden);
  }

  updateOrden(id: string, orden: Partial<Orden>): Observable<Orden> {
    return this.http.put<Orden>(`${this.apiUrl}/${id}`, orden);
  }

  deleteOrden(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
