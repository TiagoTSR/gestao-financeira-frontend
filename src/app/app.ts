import { Component, signal } from '@angular/core';
import { LancamentosPesquisa } from './lancamentos-pesquisa/lancamentos-pesquisa';
import { TableModule } from 'primeng/table';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [
    LancamentosPesquisa,
    TableModule,
    Navbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('gestaoFinanceira');

}
