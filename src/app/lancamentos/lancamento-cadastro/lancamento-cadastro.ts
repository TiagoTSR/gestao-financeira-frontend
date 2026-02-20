import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormsModule,NgForm,ReactiveFormsModule } from '@angular/forms';
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

import { LancamentoService } from '../lancamento';
import { Lancamento } from '../../models/lancamento.model';
import Swal from 'sweetalert2'


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

  @ViewChild('form') formulario!: NgForm;

  private _onDestroy = new Subject<void>();

  dataVencimento: Date | undefined;
  dataRecebimento: Date | undefined;

  descricao: string | undefined;

  tipos = [
    { label: 'Receita', value: TipoLancamento.RECEITA },
    { label: 'Despesa', value: TipoLancamento.DESPESA }
  ];
  
  tipoSelecionado: TipoLancamento = TipoLancamento.DESPESA;
  

  categorias: { label: string; value: number }[] = [];
  pessoas: { label: string; value: number }[] = [];

  categoriaSelecionada?: number;
  pessoaSelecionada?: number;

  filteredCategorias: { label: string; value: number }[] = [];
  filteredPessoas: { label: string; value: number }[] = [];

  categoriaFilterCtrl = new FormControl('');
  pessoaFilterCtrl = new FormControl('');

 constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService
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

  salvar(form: any): void {
    if (form.invalid) {
      return;
    }

    const lancamento: Lancamento = {
      id: 0,
      tipo: this.tipoSelecionado,
      descricao: form.value.descricao,
      dataVencimento: this.dataVencimento!,
      dataPagamento: this.dataRecebimento!,
      valor: form.value.valor,
      observacao: form.value.observacao,
      pessoaId: this.pessoaSelecionada!,
      categoriaId: this.categoriaSelecionada!
    };

    this.lancamentoService.save(lancamento).subscribe({
      next: () => {
       Swal.fire({
             title: 'Salvo com sucesso!',
             icon: 'success',
             cancelButtonText: 'OK',
           })
        form.resetForm();
        this.tipoSelecionado = TipoLancamento.DESPESA;
        this.dataVencimento = undefined;
        this.dataRecebimento = undefined;
        this.categoriaSelecionada = undefined as any;
        this.pessoaSelecionada = undefined as any;
        this.descricao = undefined;
      },
      error: (err) => {
        console.error('Erro ao salvar lançamento', err);
      }
    });
  }

  onEnterSelectFirst(event: Event, target: 'categoria' | 'pessoa'): void {
  const keyboardEvent = event as KeyboardEvent;

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
  document.body.click();
}

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}