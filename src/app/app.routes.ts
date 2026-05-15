import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.Dashboard),
  },

  {
    path: 'clientes',
    loadComponent: () =>
      import('./features/clientes/cliente-list/cliente-list').then(m => m.ClienteList),
  },
  {
    path: 'clientes/novo',
    loadComponent: () =>
      import('./features/clientes/cliente-form/cliente-form').then(m => m.ClienteForm),
  },
  {
    path: 'clientes/:id/editar',
    loadComponent: () =>
      import('./features/clientes/cliente-form/cliente-form').then(m => m.ClienteForm),
  },

  {
    path: 'veiculos',
    loadComponent: () =>
      import('./features/veiculos/veiculo-list/veiculo-list').then(m => m.VeiculoList),
  },
  {
    path: 'veiculos/novo',
    loadComponent: () =>
      import('./features/veiculos/veiculo-form/veiculo-form').then(m => m.VeiculoForm),
  },
  {
    path: 'veiculos/:id/editar',
    loadComponent: () =>
      import('./features/veiculos/veiculo-form/veiculo-form').then(m => m.VeiculoForm),
  },

  {
    path: 'servicos',
    loadComponent: () =>
      import('./features/servicos/servico-list/servico-list').then(m => m.ServicoList),
  },
  {
    path: 'servicos/novo',
    loadComponent: () =>
      import('./features/servicos/servico-form/servico-form').then(m => m.ServicoForm),
  },
  {
    path: 'servicos/:id/editar',
    loadComponent: () =>
      import('./features/servicos/servico-form/servico-form').then(m => m.ServicoForm),
  },

  {
    path: 'mecanicos',
    loadComponent: () =>
      import('./features/mecanico/mecanico-list/mecanico-list').then(m => m.MecanicoList),
  },
  {
    path: 'mecanicos/novo',
    loadComponent: () =>
      import('./features/mecanico/mecanico-form/mecanico-form').then(m => m.MecanicoForm),
  },
  {
    path: 'mecanicos/:id/editar',
    loadComponent: () =>
      import('./features/mecanico/mecanico-form/mecanico-form').then(m => m.MecanicoForm),
  },

  {
    path: 'ordens-servico',
    loadComponent: () =>
      import('./features/ordem-servico/ordem-servico-list/ordem-servico-list').then(
        m => m.OrdemServicoList,
      ),
  },
  {
    path: 'ordens-servico/novo',
    loadComponent: () =>
      import('./features/ordem-servico/ordem-servico-form/ordem-servico-form').then(
        m => m.OrdemServicoForm,
      ),
  },
  {
    path: 'ordens-servico/:id/editar',
    loadComponent: () =>
      import('./features/ordem-servico/ordem-servico-form/ordem-servico-form').then(
        m => m.OrdemServicoForm,
      ),
  },

  { path: '**', redirectTo: 'dashboard' },
];
