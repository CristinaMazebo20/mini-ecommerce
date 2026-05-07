import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="container">
        <!-- Logo -->
        <a routerLink="/produtos" class="logo">
          <div class="logo-wrapper">
            <div class="logo-icon">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="mazeboGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#8b5cf6" />
                    <stop offset="100%" style="stop-color:#5b21b6" />
                  </linearGradient>
                  <linearGradient id="mazeboShine" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#c084fc" />
                    <stop offset="100%" style="stop-color:#8b5cf6" />
                  </linearGradient>
                </defs>
                <rect x="4" y="4" width="28" height="28" rx="10" fill="url(#mazeboGrad)"/>
                <rect x="4" y="4" width="28" height="14" rx="10" fill="url(#mazeboShine)" opacity="0.4"/>
                <path d="M12 12 L16 24 L20 18 L24 24 L28 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <path d="M12 12 L12 24" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
                <path d="M28 12 L28 24" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
              </svg>
            </div>
            <span class="logo-text">Mazebo<span>Shop</span></span>
          </div>
        </a>

        <!-- Links -->
        <div class="nav-links">
          <a routerLink="/produtos" routerLinkActive="active">{{ t('nav.produtos') }}</a>
          <a routerLink="/carrinho" routerLinkActive="active" class="cart-link">
            🛒 {{ t('nav.carrinho') }}
            <span class="cart-count" *ngIf="carrinhoCount > 0">{{ carrinhoCount }}</span>
          </a>
          
          <!-- Botão Tema -->
          <button class="theme-toggle" (click)="themeService.toggleTheme()" [title]="themeService.isDark() ? 'Modo claro' : 'Modo escuro'">
            {{ themeService.isDark() ? '☀️' : '🌙' }}
          </button>
          
          <!-- Botão Idioma -->
          <button class="lang-toggle" (click)="i18nService.toggleLanguage()" [title]="i18nService.getLanguageLabel()">
            {{ i18nService.getLanguageLabel() }}
          </button>
          
          <ng-container *ngIf="isLoggedIn; else guestLinks">
            <a *ngIf="isAdmin" routerLink="/admin/dashboard" routerLinkActive="active" class="admin-link">
              {{ t('nav.admin') }}
            </a>
            <button class="btn-logout" (click)="logout()">{{ t('nav.sair') }}</button>
          </ng-container>

          <ng-template #guestLinks>
            <button class="btn-login" (click)="irParaLogin()">{{ t('nav.login') }}</button>
            <button class="btn-register" (click)="irParaRegisto()">{{ t('nav.registar') }}</button>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--navbar-bg);
      border-bottom: 1px solid var(--border);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: all 0.3s ease;
    }

    .navbar.scrolled {
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      text-decoration: none;
    }

    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
    }

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
      z-index: 1;
      opacity: 1;
      transform: translateX(0);
    }

    .logo-text span {
      color: var(--primary);
    }

    .navbar.scrolled .logo-text {
      opacity: 0;
      transform: translateX(-120%);
      width: 0;
      margin-left: -10px;
    }

    .logo-text {
      opacity: 0;
      transform: translateX(120%);
      animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes slideIn {
      0% {
        opacity: 0;
        transform: translateX(120%);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .navbar.scrolled .logo-text {
      animation: none;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .nav-links a {
      text-decoration: none;
      color: var(--text-secondary);
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-links a:hover, .nav-links a.active {
      color: var(--primary);
    }

    .cart-link {
      position: relative;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .cart-count {
      position: absolute;
      top: -8px;
      right: -12px;
      background: var(--danger);
      color: white;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 20px;
    }

    .admin-link {
      color: var(--text-secondary);
    }

    .theme-toggle, .lang-toggle {
      background: transparent;
      border: 1px solid var(--border);
      padding: 6px 12px;
      border-radius: 30px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
      color: var(--text-primary);
    }

    .theme-toggle:hover, .lang-toggle:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .btn-login, .btn-register, .btn-logout {
      padding: 8px 20px;
      border-radius: 30px;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-login {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-secondary);
    }

    .btn-login:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    .btn-register {
      background: var(--primary);
      color: white;
      border: none;
    }

    .btn-register:hover {
      background: var(--primary-dark);
    }

    .btn-logout {
      background: var(--primary);
      color: white;
      border: none;
    }

    .btn-logout:hover {
      background: var(--primary-dark);
    }

    @media (max-width: 768px) {
      .container { padding: 10px 16px; }
      .nav-links { gap: 12px; }
      .logo-text { font-size: 16px; }
      .btn-login, .btn-register, .btn-logout { padding: 6px 14px; font-size: 12px; }
      .theme-toggle, .lang-toggle { padding: 4px 10px; font-size: 12px; }
    }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  isLoggedIn = false;
  isAdmin = false;
  carrinhoCount = 0;

  constructor(
    public themeService: ThemeService,
    public i18nService: I18nService
  ) {
    this.atualizarEstado();
    setInterval(() => this.atualizarEstado(), 1000);
  }

  t(key: string): string {
    return this.i18nService.t(key);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 30;
  }

  irParaLogin() {
    window.location.href = '/login';
  }

  irParaRegisto() {
    window.location.href = '/registar';
  }

  atualizarEstado() {
    const usuario = localStorage.getItem('usuario');
    this.isLoggedIn = !!usuario;
    if (usuario) {
      const user = JSON.parse(usuario);
      this.isAdmin = user.tipo === 'admin';
    }
    const carrinho = localStorage.getItem('carrinho');
    if (carrinho) {
      const itens = JSON.parse(carrinho);
      this.carrinhoCount = itens.reduce((s: number, i: any) => s + i.quantidade, 0);
    } else {
      this.carrinhoCount = 0;
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}