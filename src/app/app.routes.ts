import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout.component')
        .then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard.page')
            .then(m => m.default),
      },
      {
        path: 'integrantes',
        loadChildren: () =>
          import('./features/integrantes/integrantes.routes')
            .then(m => m.INTEGRANTES_ROUTES),
      },
    ],
  },


];
