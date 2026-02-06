import { Component, signal } from '@angular/core';
import { LancamentosPesquisa } from './lancamentos-pesquisa/lancamentos-pesquisa';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-root',
  imports: [
    LancamentosPesquisa,
    TableModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('gestaoFinanceira');

}
