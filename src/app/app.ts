import { Component, signal } from '@angular/core';
import { LancamentosPesquisa } from './lancamentos-pesquisa/lancamentos-pesquisa';
import { TableModule } from 'primeng/table';
import { Navbar } from './navbar/navbar';
import { PessoasPesquisa } from './pessoas-pesquisa/pessoas-pesquisa';
import { LancamentoCadastro } from './lancamento-cadastro/lancamento-cadastro';
import { PessoaCadastro } from './pessoa-cadastro/pessoa-cadastro';

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
