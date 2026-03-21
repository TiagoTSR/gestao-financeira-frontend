import { Component, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Login } from '../../models/login.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class loginComponent implements OnDestroy {

  router = inject(Router);
  authService = inject(AuthService);

  loading = false;
  bloqueado = false;
  segundosRestantes = 0;
  tempoFormatado = '';

  private intervalo: any;

  login: Login = {
    username: '',
    password: ''
  };

  constructor() {
    this.authService.removerDados();
  }

  logar() {
    if (this.bloqueado) return;

    if (!this.validarFormulario()) return;

    this.loading = true;

    this.authService.logar(this.login).subscribe({
      next: (res) => {
        this.loading = false;

        if (res?.usuario) {
          this.authService.saveUsuario(res.usuario);
        }

        this.gerarToast().fire({ icon: 'success', title: 'Seja bem-vindo!' });
        this.router.navigate(['/admin/lancamentos']);
      },
      error: (erro) => {
        this.loading = false;

        if (erro.status === 429) {
          this.iniciarBloqueio(erro.error.segundosRestantes);
        } else {
          Swal.fire('Usuário ou senha incorretos!', '', 'error');
        }
      }
    });
  }

  private iniciarBloqueio(segundos: number) {
    this.bloqueado = true;
    this.segundosRestantes = segundos;
    this.atualizarTexto();

    clearInterval(this.intervalo);

    this.intervalo = setInterval(() => {
      this.segundosRestantes--;
      this.atualizarTexto();

      if (this.segundosRestantes <= 0) {
        clearInterval(this.intervalo);
        this.bloqueado = false;
        this.tempoFormatado = '';
      }
    }, 1000);
  }

  private atualizarTexto() {
    const min = Math.floor(this.segundosRestantes / 60);
    const seg = this.segundosRestantes % 60;
    this.tempoFormatado = `${min}:${seg.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  validarFormulario(): boolean {
    if (!this.login.username || !this.login.username.trim()) {
      Swal.fire('Campo obrigatório', 'Por favor, informe seu usuário', 'warning');
      return false;
    }

    if (!this.login.password || !this.login.password.trim()) {
      Swal.fire('Campo obrigatório', 'Por favor, informe sua senha', 'warning');
      return false;
    }

    return true;
  }

  gerarToast() {
    return Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
  }
}