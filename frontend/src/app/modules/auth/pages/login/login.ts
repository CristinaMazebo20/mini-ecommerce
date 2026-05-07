import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { I18nService } from '../../../../core/services/i18n.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="brand">
          <div class="brand-icon">
            <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="4" width="28" height="28" rx="10" fill="#8b5cf6"/>
              <path d="M12 12 L16 24 L20 18 L24 24 L28 12" stroke="white" stroke-width="2.5" fill="none"/>
            </svg>
          </div>
          <h2>MazeboShop</h2>
          <p>{{ t('auth.login.titulo') }}</p>
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>{{ t('auth.login.email') }}</label>
            <input 
              type="email" 
              class="form-control"
              [(ngModel)]="email" 
              name="email"
              required
              [placeholder]="t('auth.login.email')"
            >
          </div>

          <div class="form-group">
            <label>{{ t('auth.login.senha') }}</label>
            <input 
              type="password" 
              class="form-control"
              [(ngModel)]="senha" 
              name="senha"
              required
              [placeholder]="t('auth.login.senha')"
            >
          </div>

          <button type="submit" class="btn-login" [disabled]="carregando">
            {{ carregando ? t('common.carregando') : t('auth.login.entrar') }}
          </button>

          <div class="links">
            <a routerLink="/registar">{{ t('auth.login.criar_conta') }}</a>
            <a routerLink="/recuperar-senha">{{ t('auth.login.esqueceu') }}</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 70px);
      background: var(--bg-secondary);
      padding: 80px 20px 40px 20px;
    }

    .login-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: var(--card-shadow);
      border: 1px solid var(--border);
    }

    .brand {
      text-align: center;
      margin-bottom: 32px;
    }

    .brand-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
    }

    .brand h2 {
      font-size: 1.5rem;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .brand p {
      color: var(--text-secondary);
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 14px;
      background: var(--bg-primary);
      color: var(--text-primary);
      transition: all 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
    }

    .btn-login {
      width: 100%;
      padding: 12px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-login:hover {
      background: var(--primary-dark);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .links {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
    }

    .links a {
      color: var(--primary);
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s;
    }

    .links a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .login-container {
        padding: 70px 16px 30px 16px;
      }
      .login-card {
        padding: 24px;
      }
    }
  `]
})
export class Login {
  email = '';
  senha = '';
  carregando = false;

  constructor(
    private router: Router,
    private i18n: I18nService,
    private notificationService: NotificationService
  ) {}

  t(key: string): string {
    return this.i18n.t(key);
  }

  onSubmit(): void {
    if (!this.email || !this.senha) {
      this.notificationService.error('Preencha todos os campos');
      return;
    }

    this.carregando = true;

    // Simular delay de rede
    setTimeout(() => {
      this.carregando = false;
      
      // ADMIN - Credenciais fixas
      if (this.email === 'admin@mazeboshop.ao' && this.senha === 'admin123') {
        const usuario = {
          id: 1,
          nome: 'Administrador',
          email: this.email,
          tipo: 'admin'
        };
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('token', 'fake-token');
        this.notificationService.success('Login realizado com sucesso! Bem-vindo, Administrador.');
        this.router.navigate(['/admin/dashboard']);
      } 
      // CLIENTE - Qualquer outro email/senha
      else if (this.email && this.senha) {
        const usuario = {
          id: Date.now(),
          nome: this.email.split('@')[0],
          email: this.email,
          tipo: 'cliente'
        };
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('token', 'fake-token');
        this.notificationService.success(`Bem-vindo, ${usuario.nome}!`);
        this.router.navigate(['/produtos']);
      } 
      else {
        this.notificationService.error('Email ou senha inválidos');
      }
    }, 800);
  }
}