import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plato } from '../../shared/models/plato.model';

@Injectable({
  providedIn: 'root',
})
export class PlatoService {
  private apiUrl = 'http://localhost:4000/platos'; // ajusta si tu backend corre en otro puerto

  constructor(private http: HttpClient) {}

  getPlatos(): Observable<Plato[]> {
    return this.http.get<Plato[]>(this.apiUrl);
  }

  getPlato(id: string): Observable<Plato> {
    return this.http.get<Plato>(`${this.apiUrl}/${id}`);
  }

  createPlato(data: Partial<Plato>): Observable<Plato> {
    return this.http.post<Plato>(this.apiUrl, data);
  }

  updatePlato(id: string, data: Partial<Plato>): Observable<Plato> {
    return this.http.put<Plato>(`${this.apiUrl}/${id}`, data);
  }

  deletePlato(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
