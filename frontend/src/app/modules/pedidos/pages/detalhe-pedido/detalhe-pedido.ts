import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../../../../core/services/i18n.service';
import { NotificationService } from '../../../../core/services/notification.service';

interface ItemPedido {
  id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
  produto_nome?: string;
  produto_imagem?: string;
}

interface Pedido {
  id: number;
  codigo: string;
  data: string;
  total: number;
  status: string;
  endereco: string;
  cidade: string;
  cep: string;
  forma_pagamento: string;
  cliente_nome?: string;
  itens: ItemPedido[];
}

@Component({
  selector: 'app-detalhe-pedido',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detalhe-page">
      <div class="container">
        <div class="page-header">
          <a routerLink="/pedidos" class="btn-voltar">← {{ t('common.voltar') }}</a>
          <h1 class="page-title">📦 {{ t('pedidos.detalhes') }}</h1>
        </div>

        <div *ngIf="carregando" class="loading">
          {{ t('common.carregando') }}
        </div>

        <div *ngIf="!carregando && pedido" class="detalhe-content">
          <!-- Informações do pedido -->
          <div class="info-card">
            <h2>{{ t('pedidos.informacoes') || 'Informações do Pedido' }}</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">{{ t('pedidos.codigo') || 'Código:' }}</span>
                <span class="info-value">{{ pedido.codigo || '#' + pedido.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('pedidos.data') }}:</span>
                <span class="info-value">{{ pedido.data | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('pedidos.status') }}:</span>
                <span class="status-badge" [class.status-pendente]="pedido.status === 'pendente'"
                                          [class.status-pago]="pedido.status === 'pago'"
                                          [class.status-enviado]="pedido.status === 'enviado'"
                                          [class.status-entregue]="pedido.status === 'entregue'">
                  {{ getStatusLabel(pedido.status) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('checkout.pagamento') }}:</span>
                <span class="info-value">{{ pedido.forma_pagamento || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Endereço de entrega -->
          <div class="info-card">
            <h2>{{ t('checkout.endereco') }}</h2>
            <div class="endereco-content">
              <p>{{ pedido.endereco }}</p>
              <p>{{ pedido.cidade }}, {{ pedido.cep }}</p>
            </div>
          </div>

          <!-- Itens do pedido -->
          <div class="info-card">
            <h2>{{ t('pedidos.itens') || 'Itens do Pedido' }}</h2>
            <div class="itens-list">
              <div *ngFor="let item of pedido.itens" class="item-row">
                <div class="item-imagem">
                  <img [src]="item.produto_imagem || 'https://placehold.co/60x60?text=Produto'" [alt]="item.produto_nome">
                </div>
                <div class="item-info">
                  <div class="item-nome">{{ item.produto_nome || 'Produto #' + item.produto_id }}</div>
                  <div class="item-detalhes">
                    <span>{{ item.quantidade }} x {{ item.preco_unitario | number }} Kz</span>
                  </div>
                </div>
                <div class="item-subtotal">
                  {{ item.quantidade * item.preco_unitario | number }} Kz
                </div>
              </div>
            </div>
            
            <div class="total-row">
              <span class="total-label">{{ t('pedidos.total') }}:</span>
              <span class="total-value">{{ pedido.total | number }} Kz</span>
            </div>
          </div>
        </div>

        <div *ngIf="!carregando && !pedido" class="error-state">
          <p>{{ t('pedidos.nao_encontrado') || 'Pedido não encontrado' }}</p>
          <a routerLink="/pedidos" class="btn-voltar">{{ t('common.voltar') }}</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detalhe-page {
      padding-top: 80px;
      min-height: calc(100vh - 140px);
      background: var(--bg-secondary);
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 24px 40px 24px;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .btn-voltar {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text-primary);
      text-decoration: none;
      font-size: 14px;
      transition: all 0.2s;
    }

    .btn-voltar:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .page-title {
      font-size: 1.5rem;
      color: var(--text-primary);
      margin: 0;
    }

    .loading {
      text-align: center;
      padding: 60px;
      color: var(--text-secondary);
    }

    .info-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      border: 1px solid var(--border);
    }

    .info-card h2 {
      font-size: 1.2rem;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
      color: var(--text-primary);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-label {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .info-value {
      font-weight: 500;
      color: var(--text-primary);
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      width: fit-content;
    }

    .status-pendente { background: #fef3c7; color: #d97706; }
    .status-pago { background: #d1fae5; color: #059669; }
    .status-enviado { background: #dbeafe; color: #2563eb; }
    .status-entregue { background: #e2e8f0; color: #475569; }

    [data-theme="dark"] .status-pendente { background: #78350f; color: #fbbf24; }
    [data-theme="dark"] .status-pago { background: #064e3b; color: #34d399; }
    [data-theme="dark"] .status-enviado { background: #1e3a8a; color: #60a5fa; }
    [data-theme="dark"] .status-entregue { background: #334155; color: #94a3b8; }

    .endereco-content p {
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .itens-list {
      margin-bottom: 20px;
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
    }

    .item-row:last-child {
      border-bottom: none;
    }

    .item-imagem {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
    }

    .item-imagem img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }

    .item-info {
      flex: 1;
    }

    .item-nome {
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .item-detalhes {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .item-subtotal {
      font-weight: 600;
      color: var(--text-primary);
    }

    .total-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 20px;
      padding-top: 16px;
      margin-top: 16px;
      border-top: 2px solid var(--border);
    }

    .total-label {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .total-value {
      font-size: 1.3rem;
      font-weight: bold;
      color: var(--primary);
    }

    .error-state {
      text-align: center;
      padding: 40px;
      background: var(--card-bg);
      border-radius: 16px;
    }

    @media (max-width: 768px) {
      .detalhe-page {
        padding-top: 70px;
      }
      .item-row {
        flex-wrap: wrap;
      }
      .item-subtotal {
        margin-left: 76px;
      }
      .total-row {
        flex-direction: column;
        align-items: flex-end;
      }
    }
  `]
})
export class DetalhePedido implements OnInit {
  pedido: Pedido | null = null;
  carregando = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private i18n: I18nService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.carregarPedido();
  }

  t(key: string): string {
    return this.i18n.t(key);
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      pendente: 'Pendente',
      pago: 'Pago',
      enviado: 'Enviado',
      entregue: 'Entregue'
    };
    return labels[status] || status;
  }

  carregarPedido() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.carregando = false;
      this.notificationService.error('Pedido não identificado');
      return;
    }

    this.carregando = true;
    this.http.get(`http://localhost/backend/api/pedidos.php?id=${id}`).subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success && response.data) {
          this.pedido = response.data;
        } else {
          this.notificationService.error('Pedido não encontrado');
        }
      },
      error: (err) => {
        this.carregando = false;
        console.error('Erro:', err);
        this.notificationService.error('Erro ao carregar detalhes do pedido');
      }
    });
  }
}