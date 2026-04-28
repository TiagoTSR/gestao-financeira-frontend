import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lancamento } from '../models/lancamento.model';
import { LancamentoQueryParams } from '../shared/lancamento-query-params.model';
import { PageResponse } from '../shared/page-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LancamentoService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/lancamentos`;

  findAll(params: LancamentoQueryParams): Observable<any> {
    let httpParams = new HttpParams()
      .set('page', params.page?.toString() || '0')
      .set('size', params.size?.toString() || '5');

    if (params.descricao) {
      httpParams = httpParams.set('descricao', params.descricao);
    }

    if (params.dataVencimentoDe) {
      httpParams = httpParams.set('dataVencimentoDe', params.dataVencimentoDe);
    }

    if (params.dataVencimentoAte) {
      httpParams = httpParams.set('dataVencimentoAte', params.dataVencimentoAte);
    }

    return this.http.get(`${this.apiUrl}/listAll`, {
      params: httpParams,
      withCredentials: true
    });
  }

  findById(id: number): Observable<Lancamento> {
    return this.http.get<Lancamento>(this.apiUrl + '/findById/' + id, { withCredentials: true });
  }

  save(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.post<Lancamento>(this.apiUrl + '/save', lancamento, { withCredentials: true });
  }

  update(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.put<Lancamento>(
      this.apiUrl + '/update/' + lancamento.id,
      lancamento,
      { withCredentials: true }
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/delete/' + id, { withCredentials: true });
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