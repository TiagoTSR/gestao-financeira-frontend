import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RelatoriosService {

  lancamentosUrl: string;

  constructor(
    private http: HttpClient,
  ) {
    this.lancamentosUrl = `${environment.apiUrl}/api/lancamentos`;
  }

  private formatarDataParaApi(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

  async relatorioLancamentosPorPessoa(inicio: Date, fim: Date): Promise<Blob> {
    const params = new HttpParams()
    .set('inicio', this.formatarDataParaApi(inicio))
    .set('fim', this.formatarDataParaApi(fim));

    return await firstValueFrom(
      this.http.get(`${this.lancamentosUrl}/relatorios/por-pessoa`, {
        params,
        responseType: 'blob'
      })
    );
  }
}