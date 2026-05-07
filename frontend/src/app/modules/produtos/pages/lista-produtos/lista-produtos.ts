import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProdutoService, Produto } from '../../../../core/services/produto.service';
import { CartService } from '../../../../core/services/cart.service';
import { I18nService } from '../../../../core/services/i18n.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-lista-produtos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="produtos-page">
      <div class="container">
        <div class="hero">
          <div class="hero-content">
            <h1>{{ t('hero.title') }}</h1>
            <p>{{ t('hero.subtitle') }}</p>
            <button class="btn btn-primary" routerLink="/ofertas">{{ t('hero.button') }}</button>
          </div>
        </div>

        <div class="filters">
          <div class="filter-group">
            <span class="filter-label">{{ t('produto.filtros') || 'Categorias:' }}</span>
            <div class="filter-buttons">
              <button (click)="filterCategoria = 'todos'" [class.active]="filterCategoria === 'todos'">Todos</button>
              <button (click)="filterCategoria = 'smartphones'" [class.active]="filterCategoria === 'smartphones'">Smartphones</button>
              <button (click)="filterCategoria = 'notebooks'" [class.active]="filterCategoria === 'notebooks'">Notebooks</button>
              <button (click)="filterCategoria = 'audio'" [class.active]="filterCategoria === 'audio'">Áudio</button>
              <button (click)="filterCategoria = 'wearables'" [class.active]="filterCategoria === 'wearables'">Wearables</button>
            </div>
          </div>
        </div>

        <div *ngIf="carregando" class="loading">Carregando produtos...</div>

        <div class="products-grid" *ngIf="!carregando">
          <div *ngFor="let produto of produtosFiltrados" class="product-card" (click)="verDetalhes(produto.id || 0)">
            <div class="product-image">
              <img [src]="produto.imagem" [alt]="produto.nome" loading="lazy">
              <span *ngIf="produto.estoque < 5" class="badge-estoque">Últimas unidades!</span>
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ produto.nome }}</h3>
              <div class="product-price">
                <span class="current-price">{{ produto.preco | number }} Kz</span>
              </div>
              <button class="btn-add" (click)="adicionarAoCarrinho($event, produto)">
                {{ t('produto.add') }}
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="!carregando && produtos.length === 0" class="empty-state">
          Nenhum produto encontrado. Volte em breve!
        </div>
      </div>
    </div>
  `,
  styles: [`
    .produtos-page { padding-top: 80px; min-height: calc(100vh - 140px); background: var(--bg-primary); }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
    .hero { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 48px; margin-bottom: 32px; color: white; }
    .hero-content h1 { font-size: 2rem; margin-bottom: 12px; }
    .hero-content p { margin-bottom: 24px; opacity: 0.9; }
    .btn-primary { background: #8b5cf6; color: white; border: none; padding: 12px 24px; border-radius: 30px; cursor: pointer; }
    .filters { margin: 24px 0; }
    .filter-group { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .filter-label { font-weight: 500; color: var(--text-secondary); }
    .filter-buttons button { padding: 6px 16px; border-radius: 20px; background: var(--card-bg); border: 1px solid var(--border); cursor: pointer; color: var(--text-primary); }
    .filter-buttons button.active { background: #8b5cf6; color: white; border-color: #8b5cf6; }
    .products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 48px; }
    .product-card { background: var(--card-bg); border-radius: 12px; overflow: hidden; cursor: pointer; box-shadow: var(--card-shadow); border: 1px solid var(--border); transition: transform 0.3s; }
    .product-card:hover { transform: translateY(-4px); }
    .product-image { position: relative; height: 200px; overflow: hidden; background: #f8fafc; }
    .product-image img { width: 100%; height: 100%; object-fit: cover; }
    .badge-estoque { position: absolute; top: 12px; left: 12px; background: #f59e0b; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; }
    .product-info { padding: 16px; }
    .product-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary); }
    .current-price { font-size: 18px; font-weight: 700; color: #8b5cf6; }
    .btn-add { width: 100%; margin-top: 12px; padding: 10px; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
    .btn-add:hover { background: #7c3aed; }
    .loading, .empty-state { text-align: center; padding: 60px; color: var(--text-secondary); }
    @media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 768px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 480px) { .products-grid { grid-template-columns: 1fr; } }
  `]
})
export class ListaProdutos implements OnInit {
  produtos: Produto[] = [];
  carregando = true;
  filterCategoria = 'todos';

  constructor(
    private produtoService: ProdutoService,
    private cartService: CartService,
    private i18n: I18nService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  t(key: string): string {
    return this.i18n.t(key);
  }

  carregarProdutos(): void {
  this.carregando = true;
  
  this.produtoService.listar().subscribe({
    next: (response: any) => {
      this.carregando = false;
      if (response.success && response.data) {
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

  get produtosFiltrados(): Produto[] {
    if (this.filterCategoria === 'todos') return this.produtos;
    return this.produtos.filter(p => p.categoria === this.filterCategoria);
  }

  verDetalhes(id: number): void {
    console.log('Ver detalhes do produto:', id);
  }

  adicionarAoCarrinho(event: Event, produto: Produto): void {
    event.stopPropagation();
    
    const carrinhoSalvo = localStorage.getItem('carrinho');
    let itens = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    
    const itemExistente = itens.find((item: any) => item.id === produto.id);
    
    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      itens.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: 1,
        imagem: produto.imagem
      });
    }
    
    localStorage.setItem('carrinho', JSON.stringify(itens));
    this.notificationService.success(`${produto.nome} adicionado ao carrinho!`);
  }
}