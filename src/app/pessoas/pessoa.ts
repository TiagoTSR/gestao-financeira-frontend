import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pessoa } from '../models/pessoa.model';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/pessoas';

  findAll(params?: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/listAll', { params });
  }

  findById(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(this.apiUrl + '/findById/' + id);
  }

  save(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl + '/save', pessoa);
  }

  update(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(
      this.apiUrl + '/update/' + pessoa.id,
      pessoa
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/delete/' + id);
  }
  
}
