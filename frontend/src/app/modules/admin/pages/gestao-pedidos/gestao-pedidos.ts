import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Pedido {
  id: number;
  data: string;
  total: number;
  status: string;
  cliente: string;
  itens?: any[];
}

@Component({
  selector: 'app-gestao-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="container">
        <div class="page-header">
          <div>
            <h1>📋 Gestão de Pedidos</h1>
            <p>Acompanhe e gerencie todos os pedidos</p>
          </div>
          <div class="stats">
            <div class="stat-card">
              <span class="stat-value">{{ totalPedidos }}</span>
              <span class="stat-label">Total Pedidos</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ faturamentoTotal | number }} Kz</span>
              <span class="stat-label">Faturamento</span>
            </div>
          </div>
        </div>

        <div class="admin-card">
          <div class="card-header">
            <h2>Lista de Pedidos</h2>
          </div>
          <div class="card-body">
            <div class="search-bar">
              <input type="text" placeholder="🔍 Buscar pedido por ID ou cliente..." class="search-input" [(ngModel)]="busca">
              <select [(ngModel)]="filtroStatus" class="status-filter">
                <option value="">Todos os status</option>
                <option value="pendente">⏳ Pendente</option>
                <option value="pago">✅ Pago</option>
                <option value="enviado">📦 Enviado</option>
                <option value="entregue">🏠 Entregue</option>
              </select>
            </div>
            
            <div class="pedidos-grid">
              <div *ngFor="let pedido of pedidosFiltrados" class="pedido-card">
                <div class="pedido-header">
                  <div>
                    <span class="pedido-id">#{{ pedido.id }}</span>
                    <span class="pedido-data">{{ pedido.data | date:'dd/MM/yyyy HH:mm' }}</span>
                  </div>
                  <span class="pedido-status" [class.status-pendente]="pedido.status === 'pendente'"
                                              [class.status-pago]="pedido.status === 'pago'"
                                              [class.status-enviado]="pedido.status === 'enviado'"
                                              [class.status-entregue]="pedido.status === 'entregue'">
                    {{ getStatusLabel(pedido.status) }}
                  </span>
                </div>
                
                <div class="pedido-body">
                  <div class="cliente-info">
                    <span>👤 {{ pedido.cliente }}</span>
                  </div>
                  <div class="pedido-total">
                    Total: <strong>{{ pedido.total | number }} Kz</strong>
                  </div>
                </div>
                
                <div class="pedido-footer">
                  <select [(ngModel)]="pedido.status" (change)="atualizarStatus(pedido)" class="status-select">
                    <option value="pendente">⏳ Pendente</option>
                    <option value="pago">✅ Pago</option>
                    <option value="enviado">📦 Enviado</option>
                    <option value="entregue">🏠 Entregue</option>
                  </select>
                  <button class="btn-detalhes" (click)="verDetalhes(pedido)">👁️ Ver Detalhes</button>
                </div>
              </div>
            </div>
            
            <div *ngIf="pedidosFiltrados.length === 0" class="empty-state">
              <span>📭</span>
              <p>Nenhum pedido encontrado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      background: var(--bg-secondary);
      min-height: calc(100vh - 200px);
      padding: 24px;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .page-header h1 {
      font-size: 1.8rem;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    
    .page-header p {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    
    .stats {
      display: flex;
      gap: 15px;
    }
    
    .stat-card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 12px 20px;
      text-align: center;
      border: 1px solid var(--border);
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary);
      display: block;
    }
    
    .stat-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .admin-card {
      background: var(--card-bg);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border);
      box-shadow: var(--card-shadow);
    }
    
    .card-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
    }
    
    .card-header h2 {
      font-size: 1.2rem;
      color: var(--text-primary);
      margin: 0;
    }
    
    .card-body {
      padding: 20px 24px;
    }
    
    .search-bar {
      display: flex;
      gap: 15px;
      margin-bottom: 25px;
      flex-wrap: wrap;
    }
    
    .search-input {
      flex: 1;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg-primary);
      color: var(--text-primary);
    }
    
    .search-input::placeholder {
      color: var(--text-secondary);
    }
    
    .status-filter {
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg-primary);
      color: var(--text-primary);
    }
    
    .pedidos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }
    
    .pedido-card {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 20px;
      transition: transform 0.3s, box-shadow 0.3s;
      border: 1px solid var(--border);
    }
    
    .pedido-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .pedido-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
    }
    
    .pedido-id {
      font-weight: bold;
      font-size: 1.1rem;
      color: var(--primary);
    }
    
    .pedido-data {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-left: 10px;
    }
    
    .pedido-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: bold;
    }
    
    .status-pendente { background: #fef3c7; color: #d97706; }
    .status-pago { background: #d1fae5; color: #059669; }
    .status-enviado { background: #dbeafe; color: #2563eb; }
    .status-entregue { background: #e2e8f0; color: #475569; }
    
    [data-theme="dark"] .status-pendente { background: #78350f; color: #fbbf24; }
    [data-theme="dark"] .status-pago { background: #064e3b; color: #34d399; }
    [data-theme="dark"] .status-enviado { background: #1e3a8a; color: #60a5fa; }
    [data-theme="dark"] .status-entregue { background: #334155; color: #94a3b8; }
    
    .pedido-body {
      margin-bottom: 15px;
    }
    
    .cliente-info {
      margin-bottom: 8px;
      color: var(--text-primary);
    }
    
    .pedido-total {
      font-size: 1rem;
      color: var(--text-primary);
    }
    
    .pedido-footer {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .status-select {
      flex: 1;
      padding: 8px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: var(--bg-primary);
      color: var(--text-primary);
    }
    
    .btn-detalhes {
      padding: 8px 16px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .btn-detalhes:hover {
      background: var(--primary-dark);
    }
    
    .empty-state {
      text-align: center;
      padding: 60px;
      color: var(--text-secondary);
    }
    
    .empty-state span {
      font-size: 3rem;
      display: block;
      margin-bottom: 10px;
    }
    
    @media (max-width: 768px) {
      .admin-container {
        padding: 16px;
      }
      
      .card-header, .card-body {
        padding: 16px;
      }
      
      .pedidos-grid {
        grid-template-columns: 1fr;
      }
      
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class GestaoPedidos {
  pedidos: Pedido[] = [];
  busca = '';
  filtroStatus = '';

  get totalPedidos(): number {
    return this.pedidos.length;
  }

  get faturamentoTotal(): number {
    return this.pedidos.reduce((sum, p) => sum + p.total, 0);
  }

  get pedidosFiltrados(): Pedido[] {
    let filtered = this.pedidos;
    if (this.busca) {
      filtered = filtered.filter(p => 
        p.id.toString().includes(this.busca) || 
        p.cliente.toLowerCase().includes(this.busca.toLowerCase())
      );
    }
    if (this.filtroStatus) {
      filtered = filtered.filter(p => p.status === this.filtroStatus);
    }
    return filtered;
  }

  constructor() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    const salvos = localStorage.getItem('pedidos');
    if (salvos) {
      this.pedidos = JSON.parse(salvos).map((p: any) => ({
        ...p,
        cliente: p.endereco?.nome || 'Cliente'
      }));
    } else {
      this.pedidos = [];
    }
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      pendente: '⏳ Pendente',
      pago: '✅ Pago',
      enviado: '📦 Enviado',
      entregue: '🏠 Entregue'
    };
    return labels[status] || status;
  }

  atualizarStatus(pedido: Pedido) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    const index = pedidos.findIndex((p: any) => p.id === pedido.id);
    if (index !== -1) {
      pedidos[index].status = pedido.status;
      localStorage.setItem('pedidos', JSON.stringify(pedidos));
      alert(`✅ Status do pedido #${pedido.id} atualizado!`);
    }
  }

  verDetalhes(pedido: Pedido) {
    alert(`📋 Pedido #${pedido.id}\n👤 Cliente: ${pedido.cliente}\n💰 Total: ${pedido.total} Kz\n📅 Data: ${new Date(pedido.data).toLocaleString()}\n📦 Status: ${this.getStatusLabel(pedido.status)}`);
  }
}