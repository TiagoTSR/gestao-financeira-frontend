import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { provideNgxMask } from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideNgxMask(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          ripple: true,
          darkModeSelector: '.none'
        }
      }
    })
  ]
};
