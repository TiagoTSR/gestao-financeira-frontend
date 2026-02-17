import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet,Navbar],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class AdminLayoutComponent { }