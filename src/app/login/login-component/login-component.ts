import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class loginComponent {

  usuario!: string;
  senha!: string;

  router = inject(Router);

  Login() {

    if (this.usuario === 'admin@ll' && this.senha === 'admin') {
      this.router.navigate(['/admin/lancamentos']);
    } else {
      alert('Usuário ou senha inválidos!');
    }
}

}