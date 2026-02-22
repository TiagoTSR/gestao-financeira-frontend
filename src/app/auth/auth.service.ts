import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { jwtDecode } from "jwt-decode";
import { Observable } from 'rxjs';
import { Login } from '../models/login.model';
import { LoginResponse, Usuario } from '../models/usuario.model';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API = "http://localhost:8080/api/login";

  logar(login: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.API, login, { withCredentials: true });
  }

  saveUsuario(usuario: Usuario) {
    sessionStorage.setItem('usuario_dados', JSON.stringify(usuario));
  }

  logout() {
  this.removerDados();
  }
  
  addToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  removerDados() {
    sessionStorage.clear();
  }

 getUsuarioLogado(): Usuario | null {
    const data = sessionStorage.getItem('usuario_dados');
    return data ? JSON.parse(data) : null;
  }

  isLogado(): boolean {
    return this.getUsuarioLogado() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.getUsuarioLogado();
    return user ? user.role === role : false;
  }
}