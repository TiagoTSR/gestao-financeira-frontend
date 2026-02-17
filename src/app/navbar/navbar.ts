import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
}