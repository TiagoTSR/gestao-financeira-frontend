import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/login.model';
import { LoginResponse, Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api';

  logar(login: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, login, { withCredentials: true });
  }

  saveUsuario(usuario: Usuario) {
    sessionStorage.setItem('usuario_dados', JSON.stringify(usuario));
  }

  logout() {
    return this.http.post(`${this.API}/logout`, {}, { withCredentials: true, responseType: 'text' }).subscribe({
      next: () => this.removerDados(),
      error: () => this.removerDados()
    });
  }

  refresh(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API}/refresh-token`, {}, { withCredentials: true });
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