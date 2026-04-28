import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {

    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/categorias`;

  constructor() {}

  findAllSimple(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl + '/listAllSimple');
  }

  findById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(this.apiUrl + '/findById/' + id);
  }

  save(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl + '/save', categoria);
  }

  update(categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(
      this.apiUrl + '/update/' + categoria.id,
      categoria
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/delete/' + id);
  }

}