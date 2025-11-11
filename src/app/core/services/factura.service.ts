import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../../shared/models/factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = 'http://localhost:4000/facturas'; 

  constructor(private http: HttpClient) {}

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl);
  }

  getFacturaById(id: string): Observable<Factura> {
    return this.http.get<Factura>(`${this.apiUrl}/${id}`);
  }

  createFactura(factura: Partial<Factura>): Observable<Factura> {
    return this.http.post<Factura>(this.apiUrl, factura);
  }

  updateFactura(id: string, factura: Partial<Factura>): Observable<Factura> {
    return this.http.put<Factura>(`${this.apiUrl}/${id}`, factura);
  }

  deleteFactura(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
