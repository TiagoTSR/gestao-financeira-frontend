import { Lancamento } from './../../models/lancamento.model';
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
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from '@angular/router';


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

  public TipoLancamento = TipoLancamento;
  idLancamento?: number;
  editando = false;

  private _onDestroy = new Subject<void>();

  dataVencimento: Date | undefined;
  dataRecebimento: Date | undefined;

  descricao: string | undefined;

  valorLancamento: number | undefined;
  observacao: string | undefined;

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
    private lancamentoService: LancamentoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarPessoas();
     const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idLancamento = Number(id);
      this.editando = true;
      this.carregarLancamento(this.idLancamento);
    }
  }

  private carregarCategorias(): void {
    this.categoriaService.findAllSimple().subscribe({
      next: (dados) => {
     this.categorias = dados.map(c => ({ label: c.nome, value: c.id }));
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
   this.pessoas = dados.map(p => ({ label: p.nome, value: p.id }));
   this.filteredPessoas = [...this.pessoas];
        
        this.pessoaFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filtrarPessoas();
          });
      }
    });
  }

  private carregarLancamento(id: number): void {
    this.lancamentoService.findById(id).subscribe({
      next: (lancamento) => {
        this.tipoSelecionado = lancamento.tipo;
        this.dataVencimento = this.parseDate(lancamento.dataVencimento);
        this.dataRecebimento = lancamento.dataPagamento
          ? this.parseDate(lancamento.dataPagamento)
          : undefined;

        this.categoriaSelecionada = lancamento.categoriaId;
      this.pessoaSelecionada = lancamento.pessoaId;
        this.valorLancamento = lancamento.valor;
        this.observacao = lancamento.observacao;
         setTimeout(() => {
          (document.querySelector('[name="descricao"]') as HTMLInputElement).value =
            lancamento.descricao;
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

    const Lancamento: Lancamento = {
      id: this.idLancamento!,
      tipo: this.tipoSelecionado,
      descricao: form.value.descricao,
      dataVencimento: this.toIsoDate(this.dataVencimento!)!,
      dataPagamento: this.toIsoDate(this.dataRecebimento)!,
      valor: form.value.valor,
      observacao: form.value.observacao,
      pessoaId: this.pessoaSelecionada!,
      categoriaId: this.categoriaSelecionada!,
    };

    const request$ = this.editando
    ? this.lancamentoService.update(Lancamento)
    : this.lancamentoService.save(Lancamento);

    request$.subscribe({
    next: () => {
      Swal.fire({
        title: this.editando
          ? 'Edição realizada com sucesso!'
          : 'Salvo com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/admin/lancamentos']);
      });
    },
    error: () => {
      Swal.fire({
        title: 'Erro ao salvar',
        text: 'Não foi possível salvar o lançamento. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
  }

  private toIsoDate(date: Date | undefined | null): string | undefined {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
  }

  private parseDate(dateStr: any): Date {
    if (!dateStr) return new Date();
    const [year, month, day] = String(dateStr).split('-').map(Number);
    return new Date(year, month - 1, day);
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

  limparFormulario(): void {
    this.formulario.resetForm();

    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      input.value = '';
    });

    this.idLancamento = undefined;
    this.editando = false;
  }

  novo(): void {
    this.limparFormulario();
    this.router.navigate(['/admin/lancamentos/cadastro']);
  }

  voltar(): void {
    this.router.navigate(['/admin/lancamentos']);
  }
}