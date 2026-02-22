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
  return this.http.post<LoginResponse>(this.API, login);
  }
  addToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  removerToken() {
    sessionStorage.clear();
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  getUsuarioLogado(): Usuario | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<Usuario>(token);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  hasRole(role: string): boolean {
    const user = this.getUsuarioLogado();
    return user ? user.role === role : false;
  }
}