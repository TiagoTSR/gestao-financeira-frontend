import { Component, signal } from '@angular/core';
import { LancamentosPesquisa } from './lancamentos/lancamentos-pesquisa/lancamentos-pesquisa';
import { TableModule } from 'primeng/table';
import { Navbar } from './navbar/navbar';
import { PessoasPesquisa } from './pessoas/pessoas-pesquisa/pessoas-pesquisa';
import { LancamentoCadastro } from './lancamentos/lancamento-cadastro/lancamento-cadastro';
import { PessoaCadastro } from './pessoas/pessoa-cadastro/pessoa-cadastro';

@Component({
  selector: 'app-root',
  imports: [
    LancamentosPesquisa,
    PessoasPesquisa,
    LancamentoCadastro,
    TableModule,
    Navbar,
    PessoaCadastro
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('gestaoFinanceira');

}
