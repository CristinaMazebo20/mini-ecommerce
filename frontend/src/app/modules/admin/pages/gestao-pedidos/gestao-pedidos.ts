import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../../core/services/notification.service';

interface Pedido {
  id: number;
  data: string;
  total: number;
  status: string;
  cliente: string;
  endereco?: string;
}

@Component({
  selector: 'app-gestao-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>📋 Gestão de Pedidos</h1>
        <p>Acompanhe e gerencie todos os pedidos</p>
      </div>

      <div class="card">
        <div class="card-header"><h2>Lista de Pedidos</h2></div>
        <div class="card-body">
          <div *ngIf="carregando" class="loading">Carregando...</div>
          <div class="table-responsive" *ngIf="!carregando">
            <table class="data-table">
              <thead><tr><th>ID</th><th>Cliente</th><th>Data</th><th>Total</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                <tr *ngFor="let pedido of pedidos">
                  <td>#{{ pedido.id }}</td>
                  <td>{{ pedido.cliente || 'Cliente' }}</td>
                  <td>{{ pedido.data | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ pedido.total | number }} Kz</td>
                  <td>
                    <select [(ngModel)]="pedido.status" (change)="atualizarStatus(pedido)">
                      <option value="pendente">Pendente</option>
                      <option value="pago">Pago</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregue">Entregue</option>
                    </select>
                  </td>
                  <td><button class="btn-detalhes" (click)="verDetalhes(pedido)">👁️</button></td>
                </tr>
                <tr *ngIf="pedidos.length === 0"><td colspan="6" class="empty-row">Nenhum pedido encontrado</td></tr>
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
    select { padding: 6px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-primary); color: var(--text-primary); }
    .btn-detalhes { padding: 6px 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; }
    .loading, .empty-row { text-align: center; padding: 40px; color: var(--text-secondary); }
  `]
})
export class GestaoPedidos {
  pedidos: Pedido[] = [];
  carregando = true;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.carregando = true;
    this.http.get('http://localhost/backend/api/pedidos.php').subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success) {
          this.pedidos = response.data.map((p: any) => ({
            ...p,
            cliente: p.cliente_nome || 'Cliente'
          }));
        }
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error('Erro ao carregar pedidos');
      }
    });
  }

  atualizarStatus(pedido: Pedido) {
    this.http.put('http://localhost/backend/api/pedidos.php', { id: pedido.id, status: pedido.status }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notificationService.success(`Status do pedido #${pedido.id} atualizado`);
        }
      },
      error: () => this.notificationService.error('Erro ao atualizar status')
    });
  }

  verDetalhes(pedido: Pedido) {
    this.notificationService.info(`Pedido #${pedido.id}\nTotal: ${pedido.total} Kz\nStatus: ${pedido.status}`);
  }
}