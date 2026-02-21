import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../pessoa';
import { PessoaQueryParams } from '../../shared/pessoa-query-params.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pessoas-pesquisa',
  imports: [
    ButtonModule,
    InputTextModule,
    TableModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './pessoas-pesquisa.html',
  styleUrl: './pessoas-pesquisa.scss',
})
export class PessoasPesquisa {

    pessoas: Pessoa[] = [];
    totalRegistros = 0;
    loading = false;

    rows = 0;
    page = 0;

    nome = '';
    cidade = '';
    ativo: boolean | null = null;
  
    constructor(private pessoaService: PessoaService,private router: Router) {}
  
    ngOnInit(): void {
      this.pesquisar({ page: 0, size: this.rows });
    }
  
    pesquisar(params: PessoaQueryParams): void {
    this.loading = true;

    if (this.nome?.trim()) {
    params.nome = this.nome.trim();
    }

    this.pessoaService.findAll(params).subscribe({
      next: (response) => {
        this.pessoas = response.content;
        this.totalRegistros = response.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar pessoas', err);
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

  editar(pessoa: Pessoa): void {
      this.router.navigate(['/admin/pessoas/cadastro', pessoa.id]);
    }

  limparFiltro(): void {
  this.nome = '';
  this.page = 0;

  this.pesquisar({ page: 0, size: this.rows });
  }

  delete(pessoa: Pessoa): void {

    Swal.fire({
      title:  `
    <div style="line-height:1; margin-bottom: 0.5rem;">
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

        this.pessoaService.delete(pessoa.id!).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deletado com sucesso!',
              icon: 'success',
              confirmButtonText: 'OK',
            });

            this.pesquisar({ page: 0, size: this.rows });
          },
          error: (err) => {
            console.error('Erro ao excluir pessoa:', err);

            Swal.fire({
              title: 'Ação não permitida',
              text: 'Não foi possível excluir a pessoa.\nSe houver lançamentos vinculados, deixa pesssoa inativa ou exclua os lançamentos.Para excluir a pessoa é necessario excluir os lancamentos associados antes',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  private buildQuery(page: number, size: number): PessoaQueryParams {
    return {
      page,
      size,
      nome: this.nome?.trim() || undefined,
    }
  }
}
