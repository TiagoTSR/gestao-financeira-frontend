import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../AuthService';
import { Login } from '../../models/login.model';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login-component',
  imports: [FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class loginComponent {

  router = inject(Router);
  authService = inject(AuthService);

  loading = false;

  login: Login = {
    username: '',
    password: ''
  };

  constructor(){
    this.authService.removerToken();
  }

  logar() {
  if (!this.validarFormulario()) {
    return;
  }

  this.loading = true;

  this.authService.logar(this.login).subscribe({
    next: (res) => { 
      this.loading = false;

      if (res && res.token) {
        this.authService.addToken(res.token); 
      }

      this.gerarToast().fire({ icon: "success", title: "Seja bem-vindo!" });
      this.router.navigate(['/admin/lancamentos']);
    },
    error: (erro) => {
      this.loading = false;
    
      Swal.fire('Usuário ou senha incorretos!', '', 'error');
    }
  });
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
      position: "top-end",
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