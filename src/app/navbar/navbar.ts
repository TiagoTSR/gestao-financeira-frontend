import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  
  exibindoMenu: boolean = false;

  constructor(
    private router: Router
  ) {}

  Lancamentos(): void {
  this.router.navigate(['/admin/lancamentos']);
  }
  
  Pessoas(): void {
  this.router.navigate(['/admin/pessoas']);
  }

  authService = inject(AuthService);

  efetuarLogout() {
    Swal.fire({
      title: 'Deseja sair?',
      text: "Sua sessão será encerrada.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}