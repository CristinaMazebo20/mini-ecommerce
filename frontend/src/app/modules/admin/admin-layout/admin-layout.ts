import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="admin-layout" [class.dark]="themeService.isDark()">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="4" width="28" height="28" rx="10" fill="#8b5cf6"/>
              <path d="M12 12 L16 24 L20 18 L24 24 L28 12" stroke="white" stroke-width="2.5" fill="none"/>
            </svg>
            <h2>MazeboShop</h2>
          </div>
          <p>{{ t('admin.dashboard') }}</p>
        </div>
        
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active">
            <span>📊</span> {{ t('admin.dashboard') }}
          </a>
          <a routerLink="/admin/produtos" routerLinkActive="active">
            <span>📦</span> {{ t('admin.produtos') }}
          </a>
          <a routerLink="/admin/pedidos" routerLinkActive="active">
            <span>📋</span> {{ t('admin.pedidos') }}
          </a>
          <a routerLink="/admin/usuarios" routerLinkActive="active">
            <span>👥</span> {{ t('admin.usuarios') }}
          </a>
          <a routerLink="/admin/relatorios" routerLinkActive="active">
            <span>📈</span> {{ t('admin.relatorios') }}
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">👤</div>
            <div class="user-details">
              <div class="user-name">{{ nomeAdmin }}</div>
              <div class="user-role">{{ t('admin.dashboard') }}</div>
            </div>
          </div>
          
          <div class="admin-actions">
            <button class="theme-btn" (click)="themeService.toggleTheme()">
              {{ themeService.isDark() ? '☀️' : '🌙' }}
            </button>
            <button class="lang-btn" (click)="i18nService.toggleLanguage()">
              {{ i18nService.getLanguageLabel() }}
            </button>
          </div>
          
          <button class="logout-btn" (click)="logout()">
            <span>🚪</span> {{ t('nav.sair') }}
          </button>
          
          <a routerLink="/produtos" class="store-link">
            <span>🛍️</span> {{ t('admin.ver_loja') }}
          </a>
        </div>
      </aside>

      <main class="admin-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background: #f1f5f9;
    }

    .admin-layout.dark {
      background: #0f172a;
    }

    .admin-sidebar {
      width: 280px;
      background: white;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }

    .admin-layout.dark .admin-sidebar {
      background: #1e293b;
      border-right-color: #334155;
    }

    .sidebar-header {
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .admin-layout.dark .sidebar-header {
      border-bottom-color: #334155;
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .sidebar-logo h2 {
      margin-bottom: 0;
      color: #0f172a;
    }

    .admin-layout.dark .sidebar-logo h2 {
      color: #f1f5f9;
    }

    .sidebar-header p {
      color: #64748b;
      font-size: 14px;
    }

    .admin-layout.dark .sidebar-header p {
      color: #94a3b8;
    }

    .sidebar-nav {
      flex: 1;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: #475569;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .admin-layout.dark .sidebar-nav a {
      color: #cbd5e1;
    }

    .sidebar-nav a:hover {
      background: #f1f5f9;
      color: #8b5cf6;
    }

    .admin-layout.dark .sidebar-nav a:hover {
      background: #334155;
      color: #a78bfa;
    }

    .sidebar-nav a.active {
      background: #8b5cf6;
      color: white;
    }

    .admin-layout.dark .sidebar-nav a.active {
      background: #7c3aed;
      color: white;
    }

    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .admin-layout.dark .sidebar-footer {
      border-top-color: #334155;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 12px;
      margin-bottom: 16px;
    }

    .admin-layout.dark .user-info {
      background: #0f172a;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: #8b5cf6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .user-name {
      font-weight: 600;
      color: #0f172a;
    }

    .admin-layout.dark .user-name {
      color: #f1f5f9;
    }

    .user-role {
      font-size: 12px;
      color: #64748b;
    }

    .admin-layout.dark .user-role {
      color: #94a3b8;
    }

    .admin-actions {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
    }

    .theme-btn, .lang-btn {
      flex: 1;
      padding: 8px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .admin-layout.dark .theme-btn,
    .admin-layout.dark .lang-btn {
      background: #334155;
      border-color: #475569;
      color: #f1f5f9;
    }

    .theme-btn:hover, .lang-btn:hover {
      background: #8b5cf6;
      color: white;
    }

    /* Botão Sair - Usando a cor primária do tema */
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 16px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      margin-bottom: 8px;
    }

    .logout-btn:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
    }

    .admin-layout.dark .logout-btn {
      background: #7c3aed;
    }

    .admin-layout.dark .logout-btn:hover {
      background: #6d28d9;
    }

    .store-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: #475569;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .admin-layout.dark .store-link {
      color: #cbd5e1;
    }

    .store-link:hover {
      background: #f1f5f9;
      color: #8b5cf6;
    }

    .admin-layout.dark .store-link:hover {
      background: #334155;
      color: #a78bfa;
    }

    .admin-main {
      flex: 1;
      margin-left: 280px;
      padding: 24px;
      background: #f1f5f9;
      min-height: 100vh;
    }

    .admin-layout.dark .admin-main {
      background: #0f172a;
    }

    @media (max-width: 768px) {
      .admin-sidebar { width: 240px; }
      .admin-main { margin-left: 240px; padding: 16px; }
    }
  `]
})
export class AdminLayout {
  nomeAdmin = '';

  constructor(
    public themeService: ThemeService,
    public i18nService: I18nService
  ) {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const user = JSON.parse(usuario);
      this.nomeAdmin = user.nome?.split(' ')[0] || 'Admin';
    }
  }

  t(key: string): string {
    return this.i18nService.t(key);
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}