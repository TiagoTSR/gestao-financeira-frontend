import { HttpClient, HttpParams } from '@angular/common/http'; // Importe HttpParams
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/api/lancamentos`;
  }

  // Agora aceitamos as datas como argumentos
  lancamentosPorCategoria(inicio: string, fim: string): Observable<any[]> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fim', fim);

    return this.http.get<any[]>(`${this.lancamentosUrl}/estatisticas/por-categoria`, { params });
  }

  lancamentosPorDia(inicio: string, fim: string): Observable<any[]> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fim', fim);
    return this.http.get<any[]>(
      `${this.lancamentosUrl}/estatisticas/por-dia`,
      { params }
    );
  }
}