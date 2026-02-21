import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { OnlyLettersName } from '../../shared/only-letters-name';
import { NgxMaskDirective } from 'ngx-mask';
import { AddressDirective } from '../../shared/address-directive';
import { ComplementDirective } from '../../shared/complement-directive';
import { StateDirective } from '../../shared/state-directive';
import { MessageComponent } from '../../message/message/message';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PessoaService } from '../pessoa';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-pessoa-cadastro',
  imports: [
    FormsModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
    OnlyLettersName,
    NgxMaskDirective,
    AddressDirective,
    ComplementDirective,
    StateDirective,
    MessageComponent
  ],
  templateUrl: './pessoa-cadastro.html',
  styleUrl: './pessoa-cadastro.scss',
})
export class PessoaCadastro implements OnInit {

@ViewChild('form') formulario!: NgForm;

  idPessoa?: number;
  editando = false;

  constructor(
    private pessoaService: PessoaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idPessoa = Number(id);
      this.editando = true;
      this.carregarPessoa(this.idPessoa);
    }
  }

  salvar(form: any): void {
    if (form.invalid) {
      return;
    }

    const pessoa: Pessoa = {
      id: this.idPessoa!,
      nome: form.value.nome,
      ativo: true,
      endereco: {
        logradouro: form.value.logradouro,
        numero: form.value.numero,
        complemento: form.value.complemento || '',
        bairro: form.value.bairro,
        cep: form.value.cep,
        cidade: form.value.cidade,
        estado: form.value.estado,
      },
    };

    const request$ = this.editando
      ? this.pessoaService.update(pessoa)
      : this.pessoaService.save(pessoa);

    request$.subscribe({
      next: (response) => {
        Swal.fire({
          title: this.editando
            ? 'Edição realizada com sucesso!'
            : 'Salvo com sucesso!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/admin/pessoas']);
        });
      },
      error: (err) => {
        console.error('Erro ao salvar pessoa:', err);
        Swal.fire({
          title: 'Erro ao salvar!',
          text: err.error?.message || 'Ocorreu um erro ao salvar a pessoa.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  private carregarPessoa(id: number): void {
    this.pessoaService.findById(id).subscribe({
      next: (pessoa) => {
        // Aguarda o formulário estar pronto antes de preencher
        setTimeout(() => {
          if (this.formulario) {
            this.formulario.form.patchValue({
              nome: pessoa.nome,
              logradouro: pessoa.endereco?.logradouro || '',
              numero: pessoa.endereco?.numero || '',
              complemento: pessoa.endereco?.complemento || '',
              bairro: pessoa.endereco?.bairro || '',
              cep: pessoa.endereco?.cep || '',
              cidade: pessoa.endereco?.cidade || '',
              estado: pessoa.endereco?.estado || '',
            });
          }
        });
      },
      error: (err) => {
        console.error('Erro ao carregar pessoa:', err);
        Swal.fire({
          title: 'Erro ao carregar!',
          text: 'Não foi possível carregar os dados da pessoa.',
          icon: 'error',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/admin/pessoas']);
        });
      },
    });
  }

  limparFormulario(): void {
    this.formulario.resetForm();

    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      input.value = '';
    });

    this.idPessoa = undefined;
    this.editando = false;
  }

}