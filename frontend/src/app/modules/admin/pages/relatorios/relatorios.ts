import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>📊 Relatórios</h1>
        <p>Visão geral e exportação de dados da sua loja</p>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <h3>Total de Produtos</h3>
            <div class="stat-value">{{ totalProdutos }}</div>
          </div>
          <button class="btn-export" (click)="exportarCSV('produtos')">📥 Exportar CSV</button>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <h3>Total de Pedidos</h3>
            <div class="stat-value">{{ totalPedidos }}</div>
          </div>
          <button class="btn-export" (click)="exportarCSV('pedidos')">📥 Exportar CSV</button>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>Faturamento Total</h3>
            <div class="stat-value">{{ faturamentoTotal | number }} Kz</div>
          </div>
          <button class="btn-export" (click)="exportarCSV('faturamento')">📥 Exportar CSV</button>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>Total de Clientes</h3>
            <div class="stat-value">{{ totalClientes }}</div>
          </div>
          <button class="btn-export" (click)="exportarCSV('clientes')">📥 Exportar CSV</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 0; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.8rem; color: var(--text-primary); margin-bottom: 4px; }
    .page-header p { color: var(--text-secondary); font-size: 14px; }
    
    .stats-overview { display: flex; flex-direction: column; gap: 20px; }
    .stat-card { background: var(--card-bg); border-radius: 16px; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; border: 1px solid var(--border); }
    .stat-icon { font-size: 48px; width: 70px; text-align: center; }
    .stat-info { flex: 1; }
    .stat-info h3 { font-size: 1rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px; }
    .stat-value { font-size: 2rem; font-weight: bold; color: var(--primary); }
    .btn-export { padding: 10px 24px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; min-width: 140px; }
    .btn-export:hover { background: var(--primary-dark); }
    @media (max-width: 768px) { .stat-card { flex-direction: column; text-align: center; } .btn-export { width: 100%; } }
  `]
})
export class Relatorios {
  totalProdutos = 0;
  totalPedidos = 0;
  faturamentoTotal = 0;
  totalClientes = 0;

  constructor(private notificationService: NotificationService) {
    this.carregarDados();
  }

  carregarDados() {
    const produtos = JSON.parse(localStorage.getItem('admin_produtos') || '[]');
    this.totalProdutos = produtos.length;
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    this.totalPedidos = pedidos.length;
    this.faturamentoTotal = pedidos.reduce((sum: number, p: any) => sum + p.total, 0);
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    this.totalClientes = usuarios.filter((u: any) => u.tipo === 'cliente').length;
  }

  exportarCSV(tipo: string) {
    let dados: any[] = [];
    let cabecalho: string[] = [];

    if (tipo === 'produtos') {
      const produtos = JSON.parse(localStorage.getItem('admin_produtos') || '[]');
      cabecalho = ['ID', 'Nome', 'Preço (Kz)', 'Estoque'];
      dados = produtos.map((p: any) => [p.id, p.nome, p.preco, p.estoque]);
    } else if (tipo === 'pedidos') {
      const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
      cabecalho = ['ID', 'Cliente', 'Total (Kz)', 'Status', 'Data'];
      dados = pedidos.map((p: any) => [p.id, p.endereco?.nome || 'Cliente', p.total, p.status, new Date(p.data).toLocaleDateString()]);
    } else if (tipo === 'clientes') {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      cabecalho = ['ID', 'Nome', 'Email', 'Tipo'];
      dados = usuarios.map((u: any) => [u.id, u.nome, u.email, u.tipo]);
    } else if (tipo === 'faturamento') {
      const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
      cabecalho = ['Total Pedidos', 'Faturamento Total (Kz)'];
      dados = [[pedidos.length, pedidos.reduce((sum: number, p: any) => sum + p.total, 0)]];
    }

    const csv = [cabecalho.join(','), ...dados.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${tipo}_${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    this.notificationService.success(`Relatório de ${tipo} exportado com sucesso!`);
  }
}