import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mesa } from '../../shared/models/mesa.model';

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private apiUrl = 'http://127.0.0.1:4000/mesas';

  constructor(private http: HttpClient) {}

  getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.apiUrl}/`);
  }

  getMesa(id: string): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.apiUrl}/${id}`);
  }

  createMesa(mesa: Partial<Mesa>): Observable<Mesa> {
    return this.http.post<Mesa>(`${this.apiUrl}/`, mesa);
  }

  updateMesa(id: string, mesa: Partial<Mesa>): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.apiUrl}/${id}`, mesa);
  }

  deleteMesa(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
