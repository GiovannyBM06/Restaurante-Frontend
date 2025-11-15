import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlatoOrden } from '../../shared/models/plato-orden.model';

@Injectable({
  providedIn: 'root'
})
export class PlatoOrdenService {
  private apiUrl = `${environment.apiUrl}/platos_orden`;

  constructor(private http: HttpClient) {}

  getPlatosOrden(): Observable<PlatoOrden[]> {
    return this.http.get<PlatoOrden[]>(this.apiUrl);
  }

  getPlatoOrden(id_orden: string, id_plato: string): Observable<PlatoOrden> {
    return this.http.get<PlatoOrden>(`${this.apiUrl}/${id_orden}/${id_plato}`);
  }

  createPlatoOrden(data: Partial<PlatoOrden>): Observable<PlatoOrden> {
    return this.http.post<PlatoOrden>(this.apiUrl, data);
  }

  updatePlatoOrden(
    id_orden: string,
    id_plato: string,
    data: Partial<PlatoOrden>
  ): Observable<PlatoOrden> {
    return this.http.put<PlatoOrden>(`${this.apiUrl}/${id_orden}/${id_plato}`, data);
  }

  deletePlatoOrden(id_orden: string, id_plato: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_orden}/${id_plato}`);
  }
}
