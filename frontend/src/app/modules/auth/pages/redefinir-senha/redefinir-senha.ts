import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="redefinir-container">
      <div class="redefinir-card">
        <div class="brand">
          <div class="brand-icon">
            <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="4" width="28" height="28" rx="10" fill="#8b5cf6"/>
              <path d="M12 12 L16 24 L20 18 L24 24 L28 12" stroke="white" stroke-width="2.5" fill="none"/>
            </svg>
          </div>
          <h2>MazeboShop</h2>
          <p>Redefinir senha</p>
        </div>

        <div *ngIf="validando" class="loading">Validando token...</div>

        <div *ngIf="tokenInvalido" class="error-state">
          <div class="alert alert-danger">{{ mensagemErro }}</div>
          <a routerLink="/recuperar-senha" class="btn-voltar">Solicitar nova recuperação</a>
        </div>

        <form (ngSubmit)="onSubmit()" *ngIf="tokenValido">
          <div class="form-group">
            <label>Nova senha</label>
            <input type="password" class="form-control" [(ngModel)]="novaSenha" required placeholder="Mínimo 6 caracteres">
          </div>
          <div class="form-group">
            <label>Confirmar senha</label>
            <input type="password" class="form-control" [(ngModel)]="confirmarSenha" required placeholder="Digite a senha novamente">
          </div>
          <button type="submit" class="btn-redefinir" [disabled]="carregando">
            {{ carregando ? 'Salvando...' : 'Salvar nova senha' }}
          </button>
        </form>

        <div *ngIf="redefinido" class="success-message">
          <div class="alert alert-success">✅ {{ sucesso }}</div>
          <a routerLink="/login" class="btn-voltar">Ir para o login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .redefinir-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 70px);
      background: var(--bg-secondary);
      padding: 80px 20px 40px 20px;
    }
    .redefinir-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 450px;
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
    .btn-redefinir, .btn-voltar {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-redefinir { background: var(--primary); color: white; border: none; }
    .btn-redefinir:disabled { opacity: 0.6; }
    .btn-voltar { background: transparent; border: 1px solid var(--border); color: var(--text-primary); text-decoration: none; display: inline-block; text-align: center; margin-top: 16px; }
    .alert { padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
    .alert-danger { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid #ef4444; }
    .alert-success { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; }
    .loading, .error-state { text-align: center; padding: 20px; color: var(--text-secondary); }
    .success-message { text-align: center; }
    @media (max-width: 768px) {
      .redefinir-container { padding: 70px 16px 30px 16px; }
      .redefinir-card { padding: 24px; }
    }
  `]
})
export class RedefinirSenha implements OnInit {
  token = '';
  novaSenha = '';
  confirmarSenha = '';
  sucesso = '';
  carregando = false;
  validando = true;
  tokenValido = false;
  tokenInvalido = false;
  mensagemErro = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.validarToken();
  }

  validarToken() {
    if (!this.token) {
      this.tokenInvalido = true;
      this.mensagemErro = 'Token inválido';
      this.validando = false;
      return;
    }
    this.authService.verificarToken(this.token).subscribe({
      next: (response: any) => {
        this.validando = false;
        if (response.success) {
          this.tokenValido = true;
        } else {
          this.tokenInvalido = true;
          this.mensagemErro = response.message || 'Token inválido ou expirado';
        }
      },
      error: () => {
        this.validando = false;
        this.tokenInvalido = true;
        this.mensagemErro = 'Erro ao validar token';
      }
    });
  }

  onSubmit() {
    if (!this.novaSenha || !this.confirmarSenha) {
      this.notificationService.error('Preencha todos os campos');
      return;
    }
    if (this.novaSenha !== this.confirmarSenha) {
      this.notificationService.error('As senhas não coincidem');
      return;
    }
    if (this.novaSenha.length < 6) {
      this.notificationService.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    this.carregando = true;

    this.authService.redefinirSenha(this.token, this.novaSenha).subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success) {
          this.redefinido = true;
          this.sucesso = response.message || 'Senha redefinida com sucesso!';
          this.notificationService.success(this.sucesso);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.notificationService.error(response.message || 'Erro ao redefinir senha');
        }
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error('Erro de conexão. Tente novamente.');
      }
    });
  }
  redefinido = false;
}