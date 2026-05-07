import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { I18nService } from '../../../../core/services/i18n.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="recuperar-container">
      <div class="recuperar-card">
        <div class="brand">
          <div class="brand-icon">
            <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="4" width="28" height="28" rx="10" fill="#8b5cf6"/>
              <path d="M12 12 L16 24 L20 18 L24 24 L28 12" stroke="white" stroke-width="2.5" fill="none"/>
            </svg>
          </div>
          <h2>MazeboShop</h2>
          <p>{{ t('auth.recuperar.titulo') }}</p>
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

          <button type="submit" class="btn-enviar" [disabled]="carregando">
            {{ carregando ? t('common.carregando') : t('auth.recuperar.enviar') }}
          </button>

          <div class="links">
            <a routerLink="/login">{{ t('common.voltar') }}</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .recuperar-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 70px);
      background: var(--bg-secondary);
      padding: 80px 20px 40px 20px;
    }
    .recuperar-card {
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
    .btn-enviar {
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
    .btn-enviar:hover { background: var(--primary-dark); }
    .btn-enviar:disabled { opacity: 0.6; }
    .links { text-align: center; margin-top: 24px; }
    .links a { color: var(--primary); text-decoration: none; font-size: 14px; }
    @media (max-width: 768px) {
      .recuperar-container { padding: 70px 16px 30px 16px; }
      .recuperar-card { padding: 24px; }
    }
  `]
})
export class RecuperarSenha {
  email = '';
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private i18n: I18nService,
    private notificationService: NotificationService
  ) {}

  t(key: string): string {
    return this.i18n.t(key);
  }

  onSubmit(): void {
    if (!this.email) {
      this.notificationService.error('Digite seu email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.notificationService.error('Email inválido');
      return;
    }

    this.carregando = true;

    this.authService.solicitarRecuperacao(this.email).subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success) {
          const token = response.data?.token || localStorage.getItem('reset_token');
          this.notificationService.success('Token gerado! Redirecionando...');
          setTimeout(() => {
            this.router.navigate(['/redefinir-senha', token]);
          }, 1500);
        } else {
          this.notificationService.error(response.message || 'Email não encontrado');
        }
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error('Erro de conexão. Tente novamente.');
      }
    });
  }
}