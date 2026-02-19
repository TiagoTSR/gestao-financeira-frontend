import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormsModule,ReactiveFormsModule } from '@angular/forms';
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
import { takeUntil, Subject } from 'rxjs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
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
    MessageComponent,
    NgxMatSelectSearchModule,
    ReactiveFormsModule
  ],
  templateUrl: './lancamento-cadastro.html',
  styleUrl: './lancamento-cadastro.scss',
})
export class LancamentoCadastro implements OnInit, OnDestroy {

  private _onDestroy = new Subject<void>();

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

  filteredCategorias: { label: string; value: number }[] = [];
  filteredPessoas: { label: string; value: number }[] = [];

  categoriaFilterCtrl = new FormControl('');
  pessoaFilterCtrl = new FormControl('');

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
     this.filteredCategorias = [...this.categorias];
        
        // Configurar filtro
        this.categoriaFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filtrarCategorias();
          });
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
   this.filteredPessoas = [...this.pessoas];
        
        // Configurar filtro
        this.pessoaFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filtrarPessoas();
          });
      }
    });
  }
  
 private filtrarCategorias(): void {
    if (!this.categorias) {
      return;
    }
    
    // Obter o termo de busca
    let search = this.categoriaFilterCtrl.value;
    if (!search) {
      this.filteredCategorias = [...this.categorias];
      return;
    }
    
    search = search.toLowerCase();
    this.filteredCategorias = this.categorias.filter(
      cat => cat.label.toLowerCase().indexOf(search!) > -1
    );
  }

  private filtrarPessoas(): void {
    if (!this.pessoas) {
      return;
    }
    
    // Obter o termo de busca
    let search = this.pessoaFilterCtrl.value;
    if (!search) {
      this.filteredPessoas = [...this.pessoas];
      return;
    }
    
    search = search.toLowerCase();
    this.filteredPessoas = this.pessoas.filter(
      pessoa => pessoa.label.toLowerCase().indexOf(search!) > -1
    );
  }

  onEnterSelectFirst(event: Event, target: 'categoria' | 'pessoa'): void {
  const keyboardEvent = event as KeyboardEvent;

  // segurança extra caso o tipo não seja realmente KeyboardEvent
  if (!keyboardEvent || keyboardEvent.key !== 'Enter') {
    return;
  }

  keyboardEvent.preventDefault();
  keyboardEvent.stopPropagation();

  if (target === 'categoria') {
    const first = this.filteredCategorias?.[0];
    if (first) {
      this.categoriaSelecionada = first.value;
      this.categoriaFilterCtrl.setValue(first.label, { emitEvent: false });
      this.closeMatSelectFromEvent(keyboardEvent);
    }
    return;
  }

  const first = this.filteredPessoas?.[0];
  if (first) {
    this.pessoaSelecionada = first.value;
    this.pessoaFilterCtrl.setValue(first.label, { emitEvent: false });
    this.closeMatSelectFromEvent(keyboardEvent);
  }
}

private closeMatSelectFromEvent(event: Event): void {
  const targetEl = event.target as HTMLElement | null;
  (targetEl as HTMLInputElement | null)?.blur?.();
  document.body.click(); // fecha o overlay na prática
}

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}