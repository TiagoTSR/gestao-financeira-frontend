import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lancamento } from '../models/lancamento.model';

@Injectable({ providedIn: 'root' })
export class LancamentoService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/lancamentos';

  findAll(params?: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/listAll', { params });
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
}