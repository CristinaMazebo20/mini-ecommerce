import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Pedido {
  id: number;
  data: string;
  total: number;
  status: string;
  itens: any[];
}

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="pedidos-container">
      <div class="container">
        <h1>📋 Meus Pedidos</h1>

        <div *ngIf="pedidos.length === 0" class="sem-pedidos">
          <div class="vazio-icon">📦</div>
          <h2>Você ainda não tem pedidos</h2>
          <p>Faça sua primeira compra na nossa loja!</p>
          <a routerLink="/produtos" class="btn-comprar">Ver Produtos</a>
        </div>

        <div *ngIf="pedidos.length > 0" class="pedidos-lista">
          <div *ngFor="let pedido of pedidos" class="pedido-card">
            <div class="pedido-header">
              <div>
                <strong>Pedido #{{ pedido.id }}</strong>
                <span class="pedido-data">{{ pedido.data | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <span class="pedido-status" [class.status-confirmado]="pedido.status === 'confirmado'">
                {{ pedido.status === 'confirmado' ? '✅ Confirmado' : '📦 Em andamento' }}
              </span>
            </div>
            
            <div class="pedido-itens">
              <div *ngFor="let item of pedido.itens" class="pedido-item">
                <span>{{ item.imagem }} {{ item.nome }}</span>
                <span>{{ item.quantidade }} x {{ item.preco | number }} Kz</span>
              </div>
            </div>
            
            <div class="pedido-footer">
              <span class="pedido-total">Total: {{ pedido.total | number }} Kz</span>
              <a [routerLink]="['/pedido', pedido.id]" class="btn-detalhes">Ver detalhes</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pedidos-container {
      background: #f5f5f5;
      min-height: calc(100vh - 200px);
      padding: 40px 20px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    h1 {
      font-size: 2rem;
      margin-bottom: 30px;
      color: #333;
    }
    
    .sem-pedidos {
      text-align: center;
      background: white;
      border-radius: 16px;
      padding: 60px;
    }
    
    .vazio-icon {
      font-size: 80px;
      margin-bottom: 20px;
    }
    
    .btn-comprar {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
    }
    
    .pedido-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .pedido-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    
    .pedido-data {
      display: block;
      font-size: 12px;
      color: #888;
      margin-top: 5px;
    }
    
    .pedido-status {
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
    }
    
    .status-confirmado {
      background: #e8f5e9;
      color: #4CAF50;
    }
    
    .pedido-itens {
      padding: 15px 0;
    }
    
    .pedido-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .pedido-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }
    
    .pedido-total {
      font-size: 1.1rem;
      font-weight: bold;
      color: #333;
    }
    
    .btn-detalhes {
      padding: 8px 16px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 8px;
    }
  `]
})
export class MeusPedidos {
  pedidos: Pedido[] = [];

  constructor() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    const salvos = localStorage.getItem('pedidos');
    if (salvos) {
      this.pedidos = JSON.parse(salvos);
    }
  }
}