import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const meuhttpInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);

  const token = sessionStorage.getItem('token'); 
  
  if (token && !router.url.includes('/login')) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(request).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        
        switch (err.status) {
          case 401:
            Swal.fire({
              icon: 'error',
              title: 'Sessão Expirada',
              text: 'Sua sessão expirou. Por favor, faça login novamente.',
              timer: 3000
            });
            sessionStorage.removeItem('token');
            router.navigate(['/login']);
            break;

          case 403:
            Swal.fire({
              icon: 'warning',
              title: 'Acesso Negado',
              text: 'Você não tem permissão para acessar este recurso.',
              confirmButtonColor: '#3085d6'
            });
            break;

          case 404:
            console.error('Recurso não encontrado:', err.url);
            break;

          case 500:
            Swal.fire({
              icon: 'error',
              title: 'Servidor Offline',
              text: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
            });
            break;

          default:
            console.error(`Erro ${err.status}:`, err.message);
        }

      } else {
        console.error('Erro inesperado:', err);
      }

      return throwError(() => err);
    })
  );
};