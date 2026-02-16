import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../pessoa';


@Component({
  selector: 'app-pessoas-pesquisa',
  imports: [
    ButtonModule,
    InputTextModule,
    TableModule,
    CommonModule
  ],
  templateUrl: './pessoas-pesquisa.html',
  styleUrl: './pessoas-pesquisa.scss',
})
export class PessoasPesquisa {

  pessoas: Pessoa[] = [];
    totalRegistros = 0;
    loading = false;
  
    constructor(private pessoaService: PessoaService) {}
  
    ngOnInit(): void {
      this.pesquisar();
    }
  
    pesquisar(page = 0, size = 0): void {
      this.loading = true;
  
      this.pessoaService.findAll({
        page,
        size
      }).subscribe({
        next: response => {
          this.pessoas = response.content;
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
