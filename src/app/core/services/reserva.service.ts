import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../../shared/models/reserva.model';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private apiUrl = 'http://localhost:4000/reservas'; // cambia si usas otra ruta base

  constructor(private http: HttpClient) {}

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  getReserva(id_cliente: string, id_mesa: string): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id_cliente}/${id_mesa}`);
  }

  createReserva(data: any): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, data);
  }

  updateReserva(id_cliente: string, id_mesa: string, data: any): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id_cliente}/${id_mesa}`, data);
  }

  deleteReserva(id_cliente: string, id_mesa: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_cliente}/${id_mesa}`);
  }
}
