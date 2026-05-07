import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../../../../core/services/i18n.service';
import { NotificationService } from '../../../../core/services/notification.service';

interface Pedido {
  id: number;
  codigo: string;
  data: string;
  total: number;
  status: string;
  itens?: any[];
}

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="pedidos-page">
      <div class="container">
        <!-- Título -->
        <div class="page-title-section">
          <h1>{{ t('pedidos.titulo') }}</h1>
          <p>{{ t('pedidos.subtitulo') || 'Acompanhe seus pedidos' }}</p>
        </div>

        <!-- Loading -->
        <div *ngIf="carregando" class="loading-container">
          <div class="spinner"></div>
          <span>{{ t('common.carregando') }}</span>
        </div>

        <!-- Sem pedidos -->
        <div *ngIf="!carregando && pedidos.length === 0" class="empty-container">
          <div class="empty-illustration">🛍️</div>
          <h3>{{ t('pedidos.sem') }}</h3>
          <p>{{ t('pedidos.vazio_mensagem') || 'Você ainda não realizou nenhuma compra.' }}</p>
          <a routerLink="/produtos" class="btn-explorar">{{ t('produto.ver') || 'Explorar produtos' }}</a>
        </div>

        <!-- Lista de pedidos -->
        <div *ngIf="!carregando && pedidos.length > 0" class="pedidos-grid">
          <div *ngFor="let pedido of pedidos" class="pedido-card">
            <!-- Cabeçalho -->
            <div class="card-header">
              <div>
                <span class="order-number">{{ t('pedidos.id') }} #{{ pedido.id }}</span>
                <span class="order-date">{{ pedido.data | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <span class="status-badge" [class.status-pendente]="pedido.status === 'pendente'"
                                        [class.status-pago]="pedido.status === 'pago'"
                                        [class.status-enviado]="pedido.status === 'enviado'"
                                        [class.status-entregue]="pedido.status === 'entregue'">
                {{ getStatusText(pedido.status) }}
              </span>
            </div>

            <!-- Corpo -->
            <div class="card-body">
              <div class="order-details">
                <div class="detail-item">
                  <span class="detail-label">{{ t('pedidos.total') }}</span>
                  <span class="detail-value">{{ pedido.total | number }} Kz</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">{{ t('pedidos.data') }}</span>
                  <span class="detail-value">{{ pedido.data | date:'dd/MM/yyyy' }}</span>
                </div>
                <div class="detail-item" *ngIf="pedido.itens && pedido.itens.length">
                  <span class="detail-label">Itens</span>
                  <span class="detail-value">{{ pedido.itens.length }} produtos</span>
                </div>
              </div>
            </div>

            <!-- Rodapé -->
            <div class="card-footer">
              <a [routerLink]="['/pedido', pedido.id]" class="btn-view">
                {{ t('pedidos.detalhes') }}
                <span class="btn-icon">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pedidos-page {
      min-height: calc(100vh - 140px);
      background: var(--bg-secondary);
      padding: 100px 20px 60px;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    .page-title-section {
      text-align: center;
      margin-bottom: 48px;
    }

    .page-title-section h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .page-title-section p {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      gap: 16px;
      color: var(--text-secondary);
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-container {
      text-align: center;
      padding: 60px 20px;
      background: var(--card-bg);
      border-radius: 24px;
      border: 1px solid var(--border);
    }

    .empty-illustration {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-container h3 {
      font-size: 1.3rem;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .empty-container p {
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .btn-explorar {
      display: inline-block;
      padding: 10px 24px;
      background: var(--primary);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .btn-explorar:hover {
      background: var(--primary-dark);
    }

    .pedidos-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .pedido-card {
      background: var(--card-bg);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border);
      transition: all 0.2s;
    }

    .pedido-card:hover {
      border-color: var(--primary);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 12px;
    }

    .order-number {
      font-weight: 600;
      color: var(--primary);
    }

    .order-date {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-left: 12px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-pendente { background: #fef3c7; color: #d97706; }
    .status-pago { background: #d1fae5; color: #059669; }
    .status-enviado { background: #dbeafe; color: #2563eb; }
    .status-entregue { background: #e2e8f0; color: #475569; }

    [data-theme="dark"] .status-pendente { background: #78350f; color: #fbbf24; }
    [data-theme="dark"] .status-pago, [data-theme="dark"] .status-entregue { background: #064e3b; color: #34d399; }
    [data-theme="dark"] .status-enviado { background: #1e3a8a; color: #60a5fa; }

    .card-body {
      padding: 16px 20px;
    }

    .order-details {
      display: flex;
      gap: 32px;
      flex-wrap: wrap;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-secondary);
    }

    .detail-value {
      font-weight: 600;
      font-size: 1rem;
      color: var(--text-primary);
    }

    .card-footer {
      padding: 12px 20px 20px;
      border-top: 1px solid var(--border);
    }

    .btn-view {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text-primary);
      text-decoration: none;
      font-size: 0.85rem;
      transition: all 0.2s;
    }

    .btn-view:hover {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }

    .btn-view:hover .btn-icon {
      transform: translateX(4px);
    }

    .btn-icon {
      transition: transform 0.2s;
    }

    @media (max-width: 640px) {
      .pedidos-page {
        padding: 80px 16px 40px;
      }

      .card-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .order-details {
        gap: 20px;
      }

      .detail-item {
        width: calc(50% - 10px);
      }

      .btn-view {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .order-details {
        flex-direction: column;
        gap: 12px;
      }

      .detail-item {
        width: 100%;
      }
    }
  `]
})
export class MeusPedidos implements OnInit {
  pedidos: Pedido[] = [];
  carregando = true;

  constructor(
    private http: HttpClient,
    private i18n: I18nService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  t(key: string): string {
    return this.i18n.t(key);
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      pendente: this.t('pedidos.pendente'),
      pago: this.t('pedidos.pago'),
      enviado: this.t('pedidos.enviado'),
      entregue: this.t('pedidos.entregue')
    };
    return statusMap[status] || status;
  }

  carregarPedidos() {
    this.carregando = true;
    
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
      this.carregando = false;
      this.notificationService.error('Faça login para ver seus pedidos');
      return;
    }

    const usuario = JSON.parse(usuarioStr);
    const userId = usuario.id;

    this.http.get(`http://localhost/backend/api/pedidos.php?utilizador_id=${userId}`).subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success && response.data) {
          this.pedidos = response.data;
        }
      },
      error: (err) => {
        this.carregando = false;
        console.error('Erro:', err);
        this.notificationService.error('Erro ao carregar pedidos');
      }
    });
  }
}