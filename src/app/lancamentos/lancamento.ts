import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lancamento } from '../models/lancamento.model';
import { LancamentoQueryParams } from '../shared/lancamento-query-params.model';
import { PageResponse } from '../shared/page-response.model';

@Injectable({ providedIn: 'root' })
export class LancamentoService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/lancamentos';

  findAll(params?: LancamentoQueryParams): Observable<PageResponse<Lancamento>> {
    const httpParams = this.toHttpParams(params);
    return this.http.get<PageResponse<Lancamento>>(`${this.apiUrl}/listAll`, { params: httpParams });
  }

  findById(id: number): Observable<Lancamento> {
    return this.http.get<Lancamento>(this.apiUrl + '/findById/' + id);
  }

  save(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.post<Lancamento>(this.apiUrl + '/save', lancamento);
  }

  update(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.put<Lancamento>(
      this.apiUrl + '/update/' + lancamento.id,
      lancamento
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/delete/' + id);
  }

  private toHttpParams(params?: LancamentoQueryParams): HttpParams {
    let httpParams = new HttpParams();

    if (!params) return httpParams;

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      if (Array.isArray(value)) {
        value.forEach(v => {
          httpParams = httpParams.append(key, String(v));
        });
        return;
      }

      httpParams = httpParams.set(key, String(value));
    });

    return httpParams;
  }
}