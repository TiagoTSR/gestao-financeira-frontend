import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/categorias';

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