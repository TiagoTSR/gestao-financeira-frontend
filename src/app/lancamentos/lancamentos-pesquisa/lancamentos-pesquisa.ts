import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Lancamento } from '../../models/lancamento.model';
import { LancamentoService } from '../lancamento';
import { LancamentoQueryParams } from '../../shared/lancamento-query-params.model';

@Component({
  selector: 'app-lancamentos-pesquisa',
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    FormsModule
  ],
  templateUrl: './lancamentos-pesquisa.html',
  styleUrl: './lancamentos-pesquisa.scss',
})
export class LancamentosPesquisa {

  lancamentos: Lancamento[] = [];
  totalRegistros = 0;
  loading = false;

  rows = 0;
  page = 0;

  descricao = '';

  constructor(private lancamentoService: LancamentoService) {}

  ngOnInit(): void {

    this.pesquisar({ page: 0, size: this.rows });
  }

  pesquisar(params: LancamentoQueryParams): void {
    this.loading = true;

    this.lancamentoService.findAll(params).subscribe({
      next: (response) => {
        this.lancamentos = response.content;
        this.totalRegistros = response.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  pesquisarPorFiltro(): void {
    this.page = 0;
    this.pesquisar(this.buildQuery(0, this.rows));
  }

  aoMudarPagina(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;

    const rows = event.rows ?? this.rows;

    const page = Math.floor(first / rows);
    const size = rows;

    this.page = page;
    this.rows = rows;

    this.pesquisar(this.buildQuery(page, size));
  }

  private buildQuery(page: number, size: number): LancamentoQueryParams {
    return {
      page,
      size,
      descricao: this.descricao?.trim() || undefined
    };
  }
}
