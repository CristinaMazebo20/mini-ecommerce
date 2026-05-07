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
    .brand { text-align: center; margin-bottom: 32px; }
    .brand-icon { margin-bottom: 16px; }
    .brand h2 { font-size: 1.5rem; color: var(--text-primary); margin-bottom: 8px; }
    .brand p { color: var(--text-secondary); font-size: 14px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-primary); }
    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg-primary);
      color: var(--text-primary);
    }
    .form-control:focus { outline: none; border-color: var(--primary); }
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
    }
    .btn-login:hover { background: var(--primary-dark); }
    .btn-login:disabled { opacity: 0.6; }
    .links { display: flex; justify-content: space-between; margin-top: 24px; }
    .links a { color: var(--primary); text-decoration: none; font-size: 14px; }
    @media (max-width: 768px) {
      .login-container { padding: 70px 16px 30px 16px; }
      .login-card { padding: 24px; }
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

  // ADMIN
  if (this.email === 'admin@mazeboshop.ao' && this.senha === 'admin123') {
    const usuario = {
      id: 1,  // ID do admin no banco
      nome: 'Administrador',
      email: this.email,
      tipo: 'admin'
    };
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', 'fake-token');
    this.notificationService.success('Login realizado com sucesso!');
    this.router.navigate(['/admin/dashboard']);
    this.carregando = false;
    return;
  }
  
  // CLIENTE TESTE
  if (this.email === 'cliente@teste.com' && this.senha === '123456') {
    const usuario = {
      id: 2,  // ID do cliente no banco
      nome: 'Cliente Teste',
      email: this.email,
      tipo: 'cliente'
    };
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', 'fake-token');
    this.notificationService.success('Login realizado com sucesso!');
    this.router.navigate(['/produtos']);
    this.carregando = false;
    return;
  }
  
  // JOFRE JAIME
  if (this.email === 'Jofredenovais@gmail.com') {
    const usuario = {
      id: 4,  // ID do Jofre no banco (pelo print, é 4)
      nome: 'Jofre Jaime',
      email: this.email,
      tipo: 'cliente'
    };
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', 'fake-token');
    this.notificationService.success('Login realizado com sucesso!');
    this.router.navigate(['/produtos']);
    this.carregando = false;
    return;
  }
  
  // USUARIO TESTE
  if (this.email === 'teste@email.com' && this.senha === '123456') {
    const usuario = {
      id: 3,  // ID do usuário teste no banco
      nome: 'Usuario Teste',
      email: this.email,
      tipo: 'cliente'
    };
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', 'fake-token');
    this.notificationService.success('Login realizado com sucesso!');
    this.router.navigate(['/produtos']);
    this.carregando = false;
    return;
  }
  
  // FALHA NO LOGIN
  this.carregando = false;
  this.notificationService.error('Email ou senha inválidos');
}
}