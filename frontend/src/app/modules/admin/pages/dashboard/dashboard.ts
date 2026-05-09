import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../../../../core/services/i18n.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>{{ t('admin.dashboard') }}</h1>
        <p>{{ t('dashboard.bem_vindo') }}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <h3>{{ totalProdutos }}</h3>
            <p>{{ t('dashboard.total_produtos') }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <h3>{{ totalPedidos }}</h3>
            <p>{{ t('dashboard.total_pedidos') }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>{{ faturamentoTotal | number }} Kz</h3>
            <p>{{ t('dashboard.faturamento') }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>{{ totalClientes }}</h3>
            <p>{{ t('dashboard.total_clientes') }}</p>
          </div>
        </div>
      </div>

      <div class="recent-orders">
        <h2>{{ t('dashboard.ultimos_pedidos') }}</h2>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>{{ t('pedidos.id') || 'ID' }}</th>
                <th>{{ t('pedidos.cliente') }}</th>
                <th>{{ t('pedidos.data') }}</th>
                <th>{{ t('pedidos.total') }}</th>
                <th>{{ t('pedidos.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let pedido of ultimosPedidos">
                <td>#{{ pedido.id }}</td>
                <td>{{ pedido.cliente }}</td>
                <td>{{ pedido.data | date:'dd/MM/yyyy' }}</td>
                <td>{{ pedido.total | number }} Kz</td>
                <td><span class="status-badge" [class.status-pendente]="pedido.status === 'pendente'"
                                                [class.status-pago]="pedido.status === 'pago'"
                                                [class.status-enviado]="pedido.status === 'enviado'"
                                                [class.status-entregue]="pedido.status === 'entregue'">
                  {{ getStatusLabel(pedido.status) }}
                </span></td>
              </tr>
              <tr *ngIf="carregandoPedidos">
                <td colspan="5" class="loading-row">{{ t('common.carregando') }}</td>
              </tr>
              <tr *ngIf="!carregandoPedidos && ultimosPedidos.length === 0">
                <td colspan="5" class="empty-row">{{ t('dashboard.sem_pedidos') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 0; }
    .dashboard-header { margin-bottom: 24px; }
    .dashboard-header h1 { font-size: 1.8rem; color: var(--text-primary); margin-bottom: 4px; }
    .dashboard-header p { color: var(--text-secondary); }
    
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
    .stat-card { background: var(--card-bg); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; border: 1px solid var(--border); box-shadow: var(--card-shadow); }
    .stat-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; background: var(--bg-secondary); }
    .stat-info h3 { font-size: 1.8rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
    .stat-info p { color: var(--text-secondary); font-size: 14px; }
    
    .recent-orders { background: var(--card-bg); border-radius: 16px; padding: 24px; border: 1px solid var(--border); }
    .recent-orders h2 { margin-bottom: 20px; font-size: 1.2rem; color: var(--text-primary); }
    
    .table-responsive { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { text-align: left; padding: 12px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
    .data-table td { padding: 12px; border-bottom: 1px solid var(--border); color: var(--text-primary); }
    
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
    .status-pendente { background: #fef3c7; color: #d97706; }
    .status-pago { background: #d1fae5; color: #059669; }
    .status-enviado { background: #dbeafe; color: #2563eb; }
    .status-entregue { background: #e2e8f0; color: #475569; }
    
    [data-theme="dark"] .status-pendente { background: #78350f; color: #fbbf24; }
    [data-theme="dark"] .status-pago, [data-theme="dark"] .status-entregue { background: #064e3b; color: #34d399; }
    [data-theme="dark"] .status-enviado { background: #1e3a8a; color: #60a5fa; }
    
    .loading-row, .empty-row { text-align: center; padding: 40px; color: var(--text-secondary); }
    
    @media (max-width: 1000px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }
  `]
})
export class AdminDashboard {
  totalProdutos = 0;
  totalPedidos = 0;
  faturamentoTotal = 0;
  totalClientes = 0;
  ultimosPedidos: any[] = [];
  carregandoPedidos = true;

  constructor(
    private http: HttpClient,
    private i18n: I18nService,
    private notificationService: NotificationService
  ) {
    this.carregarDados();
  }

  t(key: string): string {
    return this.i18n.t(key);
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      pendente: this.t('pedidos.pendente'),
      pago: this.t('pedidos.pago'),
      enviado: this.t('pedidos.enviado'),
      entregue: this.t('pedidos.entregue')
    };
    return labels[status] || status;
  }

  carregarDados() {
    this.carregarProdutos();
    this.carregarPedidos();
    this.carregarClientes();
  }

  carregarProdutos() {
    this.http.get('http://localhost/backend/api/produtos.php').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.totalProdutos = response.data.length;
        }
      },
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  carregarPedidos() {
    this.carregandoPedidos = true;
    this.http.get('http://localhost/backend/api/pedidos.php').subscribe({
      next: (response: any) => {
        this.carregandoPedidos = false;
        if (response.success && response.data) {
          this.totalPedidos = response.data.length;
          this.faturamentoTotal = response.data.reduce((sum: number, p: any) => sum + (parseFloat(p.total) || 0), 0);
          this.ultimosPedidos = response.data.slice(-5).reverse().map((p: any) => ({
            id: p.id,
            data: p.data,
            total: p.total,
            status: p.status,
            cliente: p.cliente_nome || 'Cliente'
          }));
        }
      },
      error: (err) => console.error('Erro:', err)
    });
  }

  carregarClientes() {
    this.http.get('http://localhost/backend/api/utilizadores.php').subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.totalClientes = response.data.filter((u: any) => u.tipo === 'cliente').length;
        } else {
          this.totalClientes = 0;
        }
      },
      error: (err) => console.error('Erro ao carregar clientes:', err)
    });
  }
}