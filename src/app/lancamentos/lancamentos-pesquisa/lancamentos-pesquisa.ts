import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Lancamento } from '../../models/lancamento.model';
import { LancamentoService } from '../lancamento';
import { LancamentoQueryParams } from '../../shared/lancamento-query-params.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lancamentos-pesquisa',
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './lancamentos-pesquisa.html',
  styleUrl: './lancamentos-pesquisa.scss',
})
export class LancamentosPesquisa {

  dataVencimentoDe: Date | null = null;
  dataVencimentoAte: Date | null = null;


  lancamentos: Lancamento[] = [];
  totalRegistros = 0;
  loading = false;

  rows = 0;
  page = 0;

  descricao = '';

  constructor(private lancamentoService: LancamentoService,private router: Router) {}

  ngOnInit(): void {

    this.pesquisar({ page: 0, size: this.rows });
  }

  pesquisar(params: LancamentoQueryParams): void {
    this.loading = true;

  if (this.descricao?.trim()) {
    params.descricao = this.descricao.trim();
  }

  if (this.dataVencimentoDe) {
      params.dataVencimentoDe = this.toIsoDate(this.dataVencimentoDe);
    }

  if (this.dataVencimentoAte) {
      params.dataVencimentoAte = this.toIsoDate(this.dataVencimentoAte);
    }

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

  editar(lancamento: Lancamento): void {
    this.router.navigate(['/admin/lancamentos/cadastro', lancamento.id]);
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

  limparFiltro(): void {
  this.descricao = '';
  this.page = 0;
  this.dataVencimentoDe = null;
  this.dataVencimentoAte = null;

  this.pesquisar({ page: 0, size: this.rows });
  }

  private buildQuery(page: number, size: number): LancamentoQueryParams {
    return {
      page,
      size,
      descricao: this.descricao?.trim() || undefined,
      dataVencimentoDe: this.toIsoDate(this.dataVencimentoDe),
      dataVencimentoAte: this.toIsoDate(this.dataVencimentoAte),
    };
  }

  delete(lancamento: Lancamento): void {
  Swal.fire({
    title: `
    <div style="line-height:1; margin-bottom: 0.3rem;">
      Tem certeza que deseja deletar<br>este registro?
    </div>
  `,
    icon: 'warning',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não'
  }).then((result) => {
    if (result.isConfirmed) {
      this.lancamentoService.delete(lancamento.id!).subscribe({
        next: () => {
          Swal.fire('Deletado!', 'Lançamento deletado com sucesso.', 'success');
          this.pesquisar({ page: 0, size: this.rows });
        },
        error: (err) => {
          console.error('Erro ao excluir lançamento:', err);
        }
      });
    }
  });
}

novo(): void {
    this.router.navigate(['/admin/lancamentos/cadastro']);
  }

  private toIsoDate(date: Date | null): string | undefined {
  if (!date) return undefined;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
  }
}