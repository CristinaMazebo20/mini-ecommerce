import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Rotas públicas (com navbar e footer)
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout').then(m => m.PublicLayout),
    children: [
      { path: '', redirectTo: 'produtos', pathMatch: 'full' },
      { path: 'produtos', loadComponent: () => import('./modules/produtos/pages/lista-produtos/lista-produtos').then(m => m.ListaProdutos) },
      { path: 'ofertas', loadComponent: () => import('./modules/produtos/pages/ofertas/ofertas').then(m => m.OfertasComponent) },
      { path: 'carrinho', loadComponent: () => import('./modules/carrinho/pages/carrinho/carrinho').then(m => m.Carrinho) },
      { path: 'checkout', loadComponent: () => import('./modules/checkout/pages/checkout/checkout').then(m => m.Checkout) },
      { path: 'pedidos', loadComponent: () => import('./modules/pedidos/pages/meus-pedidos/meus-pedidos').then(m => m.MeusPedidos) },
      { path: 'login', loadComponent: () => import('./modules/auth/pages/login/login').then(m => m.Login) },
      { path: 'registar', loadComponent: () => import('./modules/auth/pages/registo/registo').then(m => m.Registo) },
      { path: 'recuperar-senha', loadComponent: () => import('./modules/auth/pages/recuperar-senha/recuperar-senha').then(m => m.RecuperarSenha) },
      { path: 'redefinir-senha/:token', loadComponent: () => import('./modules/auth/pages/redefinir-senha/redefinir-senha').then(m => m.RedefinirSenha) }
    ]
  },
  
  // Rotas Admin (com menu lateral)
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () => import('./modules/admin/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./modules/admin/pages/dashboard/dashboard').then(m => m.AdminDashboard) },
      { path: 'produtos', loadComponent: () => import('./modules/admin/pages/gestao-produtos/gestao-produtos').then(m => m.GestaoProdutos) },
      { path: 'pedidos', loadComponent: () => import('./modules/admin/pages/gestao-pedidos/gestao-pedidos').then(m => m.GestaoPedidos) },
      { path: 'usuarios', loadComponent: () => import('./modules/admin/pages/gestao-utilizadores/gestao-utilizadores').then(m => m.GestaoUtilizadores) },
      { path: 'relatorios', loadComponent: () => import('./modules/admin/pages/relatorios/relatorios').then(m => m.Relatorios) }
    ]
  },

  { path: '**', redirectTo: 'produtos' }
];