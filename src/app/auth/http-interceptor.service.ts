import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError, Observable, map } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);

export const meuhttpInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const reqClone = request.clone({ withCredentials: true });

  return next(reqClone).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        return handleHttpError(err, reqClone, next, authService, router);
      }
      return throwError(() => err);
    })
  );
};

function handleHttpError(
  err: HttpErrorResponse,
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<any> {

  /*console.log(`[Interceptor] Erro ${err.status} em ${request.url}`);*/

  if (request.url.includes('/api/login')) {
    return throwError(() => err);
  }

  if (request.url.includes('/api/refresh-token')) {
    return handleLogoutAndRedirect(authService, router, 'Sessão Expirada', 'Sua sessão expirou. Faça login novamente.');
  }

  if (err.status === 401 || err.status === 403) {
    return handleTokenExpired(request, next, authService, router);
  }

  switch (err.status) {
    case 403:
      showError('Acesso Negado', 'Você não tem permissão para acessar este recurso.', 'warning');
      break;
    case 404:
      console.error('Recurso não encontrado:', request.url);
      break;
    case 0:
    case 500:
      showError('Servidor Indisponível', 'Não foi possível conectar ao servidor no momento.', 'error');
      break;
    default:
      console.error(`Erro ${err.status}:`, err.message);
  }

  return throwError(() => err);
}

function handleTokenExpired(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refresh().pipe(
      switchMap(() => {
        isRefreshing = false;
        refreshTokenSubject.next(true);
        return next(request);
      }),
      catchError((refreshErr) => {
        isRefreshing = false;
        refreshTokenSubject.next(false);
        return handleLogoutAndRedirect(authService, router, 'Sessão Expirada', 'Não foi possível renovar sua sessão. Faça login novamente.');
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(result => result !== null),
      take(1),
      switchMap(result => {
        if (result) {
          return next(request);
        } else {
          return throwError(() => new Error('Falha na renovação do token'));
        }
      })
    );
  }
}

function showError(title: string, text: string, icon: any) {
  Swal.fire({ title, text, icon, confirmButtonColor: '#3085d6', timer: 4000, timerProgressBar: true });
}

function handleLogoutAndRedirect(authService: AuthService, router: Router, title: string, text: string): Observable<never> {
  authService.removerDados();
  router.navigate(['/login']);
  showError(title, text, 'error');
  return throwError(() => new Error(text));
}