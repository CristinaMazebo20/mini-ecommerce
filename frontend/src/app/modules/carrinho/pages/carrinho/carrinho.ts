import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../../../core/services/i18n.service';
import { NotificationService } from '../../../../core/services/notification.service';

interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="carrinho-page">
      <div class="container">
        <h1 class="page-title">🛒 {{ t('cart.titulo') }}</h1>

        <div *ngIf="itens.length === 0" class="carrinho-vazio">
          <div class="vazio-icon">🛍️</div>
          <h2>{{ t('cart.vazio') }}</h2>
          <p>{{ t('cart.vazio.mensagem') || 'Adicione produtos clicando em "Adicionar ao Carrinho" na página de produtos.' }}</p>
          <a routerLink="/produtos" class="btn-continuar">{{ t('produto.ver') || 'Ver Produtos' }}</a>
        </div>

        <div *ngIf="itens.length > 0" class="carrinho-content">
          <div class="carrinho-items">
            <div *ngFor="let item of itens" class="carrinho-item">
              <div class="item-imagem">
                <img [src]="item.imagem" [alt]="item.nome" class="item-img">
              </div>
              <div class="item-info">
                <h3>{{ item.nome }}</h3>
                <div class="item-preco">{{ item.preco | number }} Kz</div>
              </div>
              <div class="item-quantidade">
                <button (click)="diminuir(item.id)">-</button>
                <span>{{ item.quantidade }}</span>
                <button (click)="aumentar(item.id)">+</button>
              </div>
              <div class="item-subtotal">{{ item.preco * item.quantidade | number }} Kz</div>
              <button class="btn-remover" (click)="remover(item.id)" title="{{ t('cart.remover') || 'Remover' }}">🗑️</button>
            </div>
          </div>

          <div class="carrinho-resumo">
            <h3>{{ t('checkout.resumo') || 'Resumo do Pedido' }}</h3>
            <div class="resumo-linha">
              <span>{{ t('cart.subtotal') }}:</span>
              <span>{{ total | number }} Kz</span>
            </div>
            <div class="resumo-linha">
              <span>{{ t('cart.frete') }}:</span>
              <span>{{ t('cart.frete.gratis') }}</span>
            </div>
            <div class="resumo-linha total">
              <span>{{ t('cart.total') }}:</span>
              <span>{{ total | number }} Kz</span>
            </div>
            <a routerLink="/checkout" class="btn-finalizar">{{ t('cart.finalizar') }}</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .carrinho-page {
      padding-top: 80px;
      min-height: calc(100vh - 140px);
      background: var(--bg-secondary);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px 40px 24px;
    }

    .page-title {
      font-size: 1.8rem;
      margin-bottom: 30px;
      color: var(--text-primary);
    }

    .carrinho-vazio {
      text-align: center;
      padding: 60px;
      background: var(--card-bg);
      border-radius: 16px;
      box-shadow: var(--card-shadow);
    }

    .vazio-icon {
      font-size: 80px;
      margin-bottom: 20px;
    }

    .carrinho-vazio h2 {
      margin-bottom: 10px;
      color: var(--text-primary);
    }

    .carrinho-vazio p {
      color: var(--text-secondary);
      margin-bottom: 20px;
    }

    .btn-continuar {
      display: inline-block;
      padding: 12px 30px;
      background: var(--primary);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .btn-continuar:hover {
      background: var(--primary-dark);
    }

    .carrinho-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 30px;
    }

    .carrinho-items {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 20px;
      box-shadow: var(--card-shadow);
    }

    .carrinho-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 15px;
      border-bottom: 1px solid var(--border);
    }

    .carrinho-item:last-child {
      border-bottom: none;
    }

    .item-imagem {
      width: 80px;
      height: 80px;
      overflow: hidden;
      border-radius: 8px;
    }

    .item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-info {
      flex: 2;
    }

    .item-info h3 {
      margin-bottom: 5px;
      color: var(--text-primary);
    }

    .item-preco {
      color: var(--primary);
      font-weight: 500;
    }

    .item-quantidade {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .item-quantidade button {
      width: 30px;
      height: 30px;
      border: 1px solid var(--border);
      background: var(--bg-primary);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      color: var(--text-primary);
    }

    .item-quantidade button:hover {
      background: var(--primary);
      color: white;
    }

    .item-subtotal {
      font-weight: 600;
      min-width: 100px;
      color: var(--text-primary);
    }

    .btn-remover {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.2s;
    }

    .btn-remover:hover {
      opacity: 1;
    }

    .carrinho-resumo {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 20px;
      height: fit-content;
      box-shadow: var(--card-shadow);
    }

    .carrinho-resumo h3 {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
      color: var(--text-primary);
    }

    .resumo-linha {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      color: var(--text-secondary);
    }

    .resumo-linha.total {
      font-size: 1.2rem;
      font-weight: bold;
      border-top: 1px solid var(--border);
      margin-top: 10px;
      padding-top: 15px;
      color: var(--text-primary);
    }

    .btn-finalizar {
      display: block;
      width: 100%;
      padding: 14px;
      background: var(--primary);
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 8px;
      margin-top: 20px;
      font-weight: 500;
      transition: background 0.2s;
    }

    .btn-finalizar:hover {
      background: var(--primary-dark);
    }

    @media (max-width: 768px) {
      .carrinho-content {
        grid-template-columns: 1fr;
      }
      .carrinho-page {
        padding-top: 70px;
      }
      .carrinho-item {
        flex-wrap: wrap;
      }
      .item-quantidade {
        order: 3;
      }
      .item-subtotal {
        order: 4;
      }
      .btn-remover {
        order: 5;
      }
    }
  `]
})
export class Carrinho {
  itens: ItemCarrinho[] = [];

  constructor(
    private i18n: I18nService,
    private notificationService: NotificationService
  ) {
    this.carregarCarrinho();
  }

  t(key: string): string {
    return this.i18n.t(key);
  }

  carregarCarrinho() {
    const salvo = localStorage.getItem('carrinho');
  if (salvo) {
    this.itens = JSON.parse(salvo);
  } else {
    this.itens = [];
  }
}

  salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(this.itens));
  }

  aumentar(id: number) {
    const item = this.itens.find(i => i.id === id);
    if (item) {
      item.quantidade++;
      this.salvarCarrinho();
      this.notificationService.success(`Quantidade aumentada para ${item.quantidade}`);
    }
  }

  diminuir(id: number) {
    const item = this.itens.find(i => i.id === id);
    if (item) {
      if (item.quantidade > 1) {
        item.quantidade--;
        this.salvarCarrinho();
        this.notificationService.info(`Quantidade reduzida para ${item.quantidade}`);
      } else {
        this.remover(id);
      }
    }
  }

  remover(id: number) {
    this.itens = this.itens.filter(i => i.id !== id);
    this.salvarCarrinho();
    this.notificationService.info('Item removido do carrinho');
  }

  get total(): number {
    return this.itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  }
}