import { Routes } from '@angular/router';

export const PAGOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/pagos-list/pagos-list.page')
        .then(m => m.default),
  },
  {
   path: 'nuevo',
    loadComponent: () =>
      import('./pages/pagos-nuevo/pagos-nuevo.page')
        .then(m => m.default),
  }
];
