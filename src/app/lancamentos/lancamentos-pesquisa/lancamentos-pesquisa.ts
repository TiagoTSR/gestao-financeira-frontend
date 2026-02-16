import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Lancamento } from '../../models/lancamento.model';
import { LancamentoService } from '../lancamento';

@Component({
  selector: 'app-lancamentos-pesquisa',
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './lancamentos-pesquisa.html',
  styleUrl: './lancamentos-pesquisa.scss',
})
export class LancamentosPesquisa {

  lancamentos: Lancamento[] = [];
  totalRegistros = 0;
  loading = false;

  constructor(private lancamentoService: LancamentoService) {}

  ngOnInit(): void {
    this.pesquisar();
  }

  pesquisar(page = 0, size = 0): void {
    this.loading = true;

    this.lancamentoService.findAll({
      page,
      size
    }).subscribe({
      next: response => {
        this.lancamentos = response.content;
        this.totalRegistros = response.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  aoMudarPagina(event: any): void {
    const page = event.first / event.rows;
    const size = event.rows;

    this.pesquisar(page, size);
  }
}
