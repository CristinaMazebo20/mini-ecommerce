import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../../core/services/notification.service';
import { I18nService } from '../../../../core/services/i18n.service';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

@Component({
  selector: 'app-gestao-utilizadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="page-container">
    <div class="page-header">
      <h1>👥 {{ t('admin.usuarios') }}</h1>
      <p>{{ t('usuarios.descricao') || 'Gerencie os utilizadores do sistema' }}</p>
    </div>

    <div class="card">
      <div class="card-header"><h2>{{ t('usuarios.lista') }}</h2></div>
      <div class="card-body">
        <div *ngIf="carregando" class="loading">{{ t('common.carregando') }}</div>
        <div class="table-responsive" *ngIf="!carregando">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{{ t('usuarios.nome') }}</th>
                <th>{{ t('usuarios.email') }}</th>
                <th>{{ t('usuarios.tipo') }}</th>
                <th>{{ t('produtos.acoes') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let usuario of usuarios">
                <td>#{{ usuario.id }}</td>
                <td>{{ usuario.nome }}</td>
                <td>{{ usuario.email }}</td>
                <td>
                  <span class="tipo-badge" [class.tipo-admin]="usuario.tipo === 'admin'">
                    {{ usuario.tipo === 'admin' ? t('usuarios.admin') : t('usuarios.cliente') }}
                  </span>
                </td>
                <td>
                  <button class="btn-excluir" (click)="excluir(usuario.id)" [disabled]="usuario.tipo === 'admin'" title="{{ usuario.tipo === 'admin' ? 'Não é possível excluir administrador' : 'Excluir' }}">
                    🗑️
                  </button>
                </td>
              </tr>
              <tr *ngIf="usuarios.length === 0">
                <td colspan="5" class="empty-row">{{ t('usuarios.sem') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
`,
  styles: [`
    .page-container { padding: 0; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.8rem; color: var(--text-primary); margin-bottom: 4px; }
    .page-header p { color: var(--text-secondary); font-size: 14px; }
    .card { background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border); }
    .card-header { padding: 20px 24px; border-bottom: 1px solid var(--border); }
    .card-header h2 { font-size: 1.2rem; color: var(--text-primary); margin: 0; }
    .card-body { padding: 20px 24px; }
    .table-responsive { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { text-align: left; padding: 12px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
    .data-table td { padding: 12px; border-bottom: 1px solid var(--border); color: var(--text-primary); }
    
    .tipo-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .tipo-admin {
      background: #8b5cf6;
      color: white;
    }
    
    [data-theme="dark"] .tipo-admin {
      background: #7c3aed;
    }
    
    .btn-excluir { 
      padding: 6px 12px; 
      background: #fee2e2; 
      color: #dc2626; 
      border: none; 
      border-radius: 6px; 
      cursor: pointer; 
      transition: all 0.2s;
    }
    .btn-excluir:hover:not(:disabled) { 
      background: #dc2626; 
      color: white; 
    }
    .btn-excluir:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .loading, .empty-row { text-align: center; padding: 40px; color: var(--text-secondary); }
  `]
})
export class GestaoUtilizadores {
  usuarios: Usuario[] = [];
  carregando = true;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private i18n: I18nService
  ) {
    this.carregarUsuarios();
  }

  t(key: string): string {
    return this.i18n.t(key);
  }

  carregarUsuarios() {
    this.carregando = true;
    this.http.get('http://localhost/backend/api/utilizadores.php').subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success) {
          this.usuarios = response.data;
        }
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error(this.t('common.erro'));
      }
    });
  }

  excluir(id: number) {
    const usuario = this.usuarios.find(u => u.id === id);
    if (usuario?.tipo === 'admin') {
      this.notificationService.error('Não é possível excluir um administrador');
      return;
    }
    
    if (confirm(this.t('common.confirmar_exclusao'))) {
      this.http.delete(`http://localhost/backend/api/utilizadores.php?id=${id}`).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notificationService.success(response.message || this.t('common.sucesso'));
            this.carregarUsuarios();
          } else {
            this.notificationService.error(response.message || this.t('common.erro'));
          }
        },
        error: (err) => {
          console.error('Erro:', err);
          this.notificationService.error(this.t('common.erro_conexao'));
        }
      });
    }
  }
}