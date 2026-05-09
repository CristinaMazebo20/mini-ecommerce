import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../../core/services/notification.service';
import { I18nService } from '../../../../core/services/i18n.service';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagem: string;
  categoria?: string;
}

@Component({
  selector: 'app-gestao-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>📦 {{ t('admin.produtos') }}</h1>
        <p>{{ t('admin.produtos.descricao') || 'Gerencie seu catálogo de produtos' }}</p>
      </div>

      <!-- Formulário -->
      <div class="card">
        <div class="card-header">
          <h2>{{ editando ? ('✏️ ' + t('admin.produtos.editar')) : ('➕ ' + t('admin.produtos.novo')) }}</h2>
        </div>
        <div class="card-body">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>{{ t('admin.produtos.nome') }}</label>
              <input type="text" class="form-control" [(ngModel)]="produtoForm.nome" [placeholder]="t('admin.produtos.nome')">
            </div>
            <div class="form-group full-width">
              <label>{{ t('admin.produtos.descricao') }}</label>
              <textarea class="form-control" [(ngModel)]="produtoForm.descricao" rows="3" [placeholder]="t('admin.produtos.descricao')"></textarea>
            </div>
            <div class="form-group"><label>{{ t('admin.produtos.preco') }}</label><input type="number" class="form-control" [(ngModel)]="produtoForm.preco"></div>
            <div class="form-group"><label>{{ t('admin.produtos.estoque') }}</label><input type="number" class="form-control" [(ngModel)]="produtoForm.estoque"></div>
            <div class="form-group full-width"><label>{{ t('admin.produtos.imagem') }}</label><input type="text" class="form-control" [(ngModel)]="produtoForm.imagem" [placeholder]="t('admin.produtos.imagem')"></div>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" (click)="salvar()" [disabled]="carregando">💾 {{ editando ? t('admin.produtos.atualizar') : t('admin.produtos.salvar') }}</button>
            <button class="btn btn-secondary" (click)="cancelar()" *ngIf="editando">{{ t('admin.produtos.cancelar') }}</button>
          </div>
        </div>
      </div>

      <!-- Lista -->
      <div class="card">
        <div class="card-header"><h2>{{ t('admin.produtos.lista') }}</h2></div>
        <div class="card-body">
          <div *ngIf="carregando" class="loading">{{ t('common.carregando') }}</div>
          <div class="table-responsive" *ngIf="!carregando">
            <table class="data-table">
              <thead>
                <tr><th>ID</th><th>{{ t('admin.produtos.nome') }}</th><th>{{ t('admin.produtos.preco') }}</th><th>{{ t('admin.produtos.estoque') }}</th><th>{{ t('admin.produtos.acoes') }}</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of produtos">
                  <td>#{{ p.id }}</td>
                  <td>{{ p.nome }}</td>
                  <td>{{ p.preco | number }} Kz</td>
                  <td [class.low-stock]="p.estoque < 5">{{ p.estoque }} unid.</td>
                  <td>
                    <button class="btn-icon edit" (click)="editar(p)">✏️</button>
                    <button class="btn-icon delete" (click)="excluir(p.id)">🗑️</button>
                  </td>
                </tr>
                <tr *ngIf="produtos.length === 0">
                  <td colspan="5" class="empty-row">{{ t('produtos.sem') || 'Nenhum produto cadastrado' }}</td>
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
    .card { background: var(--card-bg); border-radius: 16px; margin-bottom: 24px; border: 1px solid var(--border); }
    .card-header { padding: 20px 24px; border-bottom: 1px solid var(--border); }
    .card-header h2 { font-size: 1.2rem; color: var(--text-primary); margin: 0; }
    .card-body { padding: 24px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px; }
    .full-width { grid-column: span 2; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group label { font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .form-control { padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-primary); color: var(--text-primary); }
    .form-control:focus { outline: none; border-color: var(--primary); }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
    .btn { padding: 10px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; border: none; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:disabled { opacity: 0.6; }
    .btn-secondary { background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border); }
    .table-responsive { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { text-align: left; padding: 12px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
    .data-table td { padding: 12px; border-bottom: 1px solid var(--border); color: var(--text-primary); }
    .low-stock { color: #ef4444; font-weight: 500; }
    .btn-icon { padding: 6px 10px; margin: 0 4px; border: none; border-radius: 6px; cursor: pointer; }
    .btn-icon.edit { background: #e0e7ff; color: #4f46e5; }
    .btn-icon.delete { background: #fee2e2; color: #dc2626; }
    .loading, .empty-row { text-align: center; padding: 40px; color: var(--text-secondary); }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } .full-width { grid-column: span 1; } }
  `]
})
export class GestaoProdutos {
  produtos: Produto[] = [];
  produtoForm: Produto = { id: 0, nome: '', descricao: '', preco: 0, estoque: 0, imagem: '' };
  editando = false;
  carregando = true;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private i18n: I18nService
  ) {
    this.carregarProdutos();
  }

  t(key: string): string {
    return this.i18n.t(key);
  }

  carregarProdutos() {
    this.carregando = true;
    this.http.get('http://localhost/backend/api/produtos.php').subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success) {
          this.produtos = response.data;
        } else {
          this.notificationService.error(this.t('common.erro'));
        }
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error(this.t('common.erro'));
      }
    });
  }

  salvar() {
    this.carregando = true;
    if (this.editando) {
      this.http.put('http://localhost/backend/api/produtos.php', this.produtoForm).subscribe({
        next: (response: any) => {
          this.carregando = false;
          if (response.success) {
            this.notificationService.success(this.t('common.sucesso'));
            this.carregarProdutos();
            this.cancelar();
          } else {
            this.notificationService.error(this.t('common.erro'));
          }
        },
        error: () => {
          this.carregando = false;
          this.notificationService.error(this.t('common.erro'));
        }
      });
    } else {
      this.http.post('http://localhost/backend/api/produtos.php', this.produtoForm).subscribe({
        next: (response: any) => {
          this.carregando = false;
          if (response.success) {
            this.notificationService.success(this.t('common.sucesso'));
            this.carregarProdutos();
            this.cancelar();
          } else {
            this.notificationService.error(this.t('common.erro'));
          }
        },
        error: () => {
          this.carregando = false;
          this.notificationService.error(this.t('common.erro'));
        }
      });
    }
  }

  editar(produto: Produto) {
    this.produtoForm = { ...produto };
    this.editando = true;
  }

  excluir(id: number) {
    if (confirm(this.t('common.excluir'))) {
      this.carregando = true;
      this.http.delete(`http://localhost/backend/api/produtos.php?id=${id}`).subscribe({
        next: (response: any) => {
          this.carregando = false;
          if (response.success) {
            this.notificationService.success(this.t('common.sucesso'));
            this.carregarProdutos();
          } else {
            this.notificationService.error(this.t('common.erro'));
          }
        },
        error: () => {
          this.carregando = false;
          this.notificationService.error(this.t('common.erro'));
        }
      });
    }
  }

  cancelar() {
    this.produtoForm = { id: 0, nome: '', descricao: '', preco: 0, estoque: 0, imagem: '' };
    this.editando = false;
  }
}