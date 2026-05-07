import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService, Produto } from '../../../../core/services/produto.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-gestao-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>📦 Gestão de Produtos</h1>
        <p>Gerencie seu catálogo de produtos</p>
      </div>

      <!-- Formulário -->
      <div class="card">
        <div class="card-header">
          <h2>{{ editando ? '✏️ Editar Produto' : '➕ Novo Produto' }}</h2>
        </div>
        <div class="card-body">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Nome do Produto</label>
              <input type="text" class="form-control" [(ngModel)]="produtoForm.nome" placeholder="Ex: iPhone 15 Pro">
            </div>
            <div class="form-group full-width">
              <label>Descrição</label>
              <textarea class="form-control" [(ngModel)]="produtoForm.descricao" rows="3" placeholder="Descrição detalhada..."></textarea>
            </div>
            <div class="form-group">
              <label>Preço (Kz)</label>
              <input type="number" class="form-control" [(ngModel)]="produtoForm.preco" placeholder="0">
            </div>
            <div class="form-group">
              <label>Estoque</label>
              <input type="number" class="form-control" [(ngModel)]="produtoForm.estoque" placeholder="0">
            </div>
            <div class="form-group full-width">
              <label>Imagem URL</label>
              <input type="text" class="form-control" [(ngModel)]="produtoForm.imagem" placeholder="https://...">
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" (click)="salvar()" [disabled]="carregando">
              💾 {{ editando ? 'Atualizar' : 'Salvar' }}
            </button>
            <button class="btn btn-secondary" (click)="cancelar()" *ngIf="editando">Cancelar</button>
          </div>
        </div>
      </div>

      <!-- Lista de produtos -->
      <div class="card">
        <div class="card-header">
          <h2>Lista de Produtos</h2>
        </div>
        <div class="card-body">
          <div *ngIf="carregando" class="loading">Carregando...</div>
          <div class="table-responsive" *ngIf="!carregando">
            <table class="data-table">
              <thead>
                <tr><th>ID</th><th>Nome</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of produtos">
                  <td>#{{ p.id }}</td>
                  <td>{{ p.nome }}</td>
                  <td>{{ p.preco | number }} Kz</td>
                  <td [class.low-stock]="p.estoque < 5">{{ p.estoque }} unid.</td>
                  <td>
                    <button class="btn-icon edit" (click)="editar(p)">✏️</button>
                    <button class="btn-icon delete" (click)="excluir(p.id || 0)">🗑️</button>
                  </td>
                </tr>
                <tr *ngIf="produtos.length === 0">
                  <td colspan="5" class="empty-row">Nenhum produto cadastrado</td>
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
    .btn-icon { padding: 6px 10px; margin: 0 4px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
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
    private produtoService: ProdutoService,
    private notificationService: NotificationService
  ) {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.carregando = true;
    this.produtoService.listar().subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success) {
          this.produtos = response.data;
        } else {
          this.notificationService.error('Erro ao carregar produtos');
        }
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error('Erro de conexão com o servidor');
      }
    });
  }

  salvar() {
    this.carregando = true;
    
    if (this.editando) {
      this.produtoService.atualizar(this.produtoForm).subscribe({
        next: (response: any) => {
          this.carregando = false;
          if (response.success) {
            this.notificationService.success('Produto atualizado com sucesso!');
            this.carregarProdutos();
            this.cancelar();
          } else {
            this.notificationService.error(response.message || 'Erro ao atualizar');
          }
        },
        error: () => {
          this.carregando = false;
          this.notificationService.error('Erro de conexão');
        }
      });
    } else {
      this.produtoService.criar(this.produtoForm).subscribe({
        next: (response: any) => {
          this.carregando = false;
          if (response.success) {
            this.notificationService.success('Produto criado com sucesso!');
            this.carregarProdutos();
            this.cancelar();
          } else {
            this.notificationService.error(response.message || 'Erro ao criar');
          }
        },
        error: () => {
          this.carregando = false;
          this.notificationService.error('Erro de conexão');
        }
      });
    }
  }

  editar(produto: Produto) {
    this.produtoForm = { ...produto };
    this.editando = true;
  }

  excluir(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.carregando = true;
      this.produtoService.deletar(id).subscribe({
        next: (response: any) => {
          this.carregando = false;
          if (response.success) {
            this.notificationService.success('Produto excluído com sucesso!');
            this.carregarProdutos();
          } else {
            this.notificationService.error(response.message || 'Erro ao excluir');
          }
        },
        error: () => {
          this.carregando = false;
          this.notificationService.error('Erro de conexão');
        }
      });
    }
  }

  cancelar() {
    this.produtoForm = { id: 0, nome: '', descricao: '', preco: 0, estoque: 0, imagem: '' };
    this.editando = false;
  }
}