import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import localePt from '@angular/common/locales/pt';
import { MessageComponent } from '../../message/message/message';
import { TipoLancamento } from '../../models/tipoLancamento.model';
import { CategoriaService } from '../../categorias/categoria';
import { PessoaService } from '../../pessoas/pessoa';
registerLocaleData(localePt);


@Component({
  selector: 'app-lancamento-cadastro',
  imports: [
    FormsModule,
    ButtonModule,
    FluidModule,
    InputNumberModule,
    InputTextModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    SelectButtonModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    MessageComponent
  ],
  templateUrl: './lancamento-cadastro.html',
  styleUrl: './lancamento-cadastro.scss',
})
export class LancamentoCadastro {

  dataVencimento: Date | undefined;
  dataRecebimento: Date | undefined;

  tipos = [
    { label: 'Receita', value: TipoLancamento.RECEITA },
    { label: 'Despesa', value: TipoLancamento.DESPESA }
  ];
  
  tipoSelecionado: TipoLancamento = TipoLancamento.DESPESA;
  

  categorias: { label: string; value: number }[] = [];
  pessoas: { label: string; value: number }[] = [];

  categoriaSelecionada!: number;
  pessoaSelecionada!: number;

 constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarPessoas();
  }

  private carregarCategorias(): void {
    this.categoriaService.findAllSimple().subscribe({
      next: (dados) => {
        this.categorias = dados.map(cat => ({
          label: cat.nome,
          value: cat.id
        }));
      }
    });
  }

  private carregarPessoas(): void {
  this.pessoaService.findAllSimple().subscribe({
    next: (dados) => {
      this.pessoas = dados.map(p => ({
        label: p.nome,
        value: p.id
      }));
    }
  });
}
  
}
