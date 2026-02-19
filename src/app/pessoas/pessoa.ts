import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pessoa } from '../models/pessoa.model';
import { PageResponse } from '../shared/page-response.model';
import { PessoaQueryParams } from '../shared/pessoa-query-params.model';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/pessoas';

  findAll(params?: PessoaQueryParams): Observable<PageResponse<Pessoa>> {
    const httpParams = this.toHttpParams(params);
    return this.http.get<PageResponse<Pessoa>>(`${this.apiUrl}/listAll`, { params: httpParams });
  }

  findAllSimple(): Observable<Pessoa[]> {
  return this.http.get<Pessoa[]>(this.apiUrl + '/listAllSimple');
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

  private toHttpParams(params?: PessoaQueryParams): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      if (Array.isArray(value)) {
        value.forEach(v => httpParams = httpParams.append(key, String(v)));
        return;
      }

      httpParams = httpParams.set(key, String(value));
    });

    return httpParams;
  }
  
}
