import { Routes } from '@angular/router';

export const INTEGRANTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/integrantes-list/integrantes-list.page')
        .then(m => m.default),
  },
  {
   path: 'nuevo',
    loadComponent: () =>
      import('./pages/integrante-nuevo/integrante-nuevo.page')
        .then(m => m.default),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/integrante-detail/integrante-detail.page')
        .then(m => m.default),
  },
];
