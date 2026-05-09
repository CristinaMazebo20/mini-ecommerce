import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../../../core/services/i18n.service';
import { NotificationService } from '../../../../core/services/notification.service';

interface ProdutoOferta {
  id: number;
  nome: string;
  precoOriginal: number;
  precoOferta: number;
  desconto: number;
  imagem: string;
}

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="ofertas-page">
      <div class="container">
        <div class="page-header">
          <h1>🔥 {{ t('ofertas.titulo') }}</h1>
          <p>{{ t('ofertas.subtitulo') }}</p>
        </div>

        <div class="ofertas-grid">
          <div *ngFor="let produto of produtosOferta" class="oferta-card">
            <div class="badge-desconto">-{{ produto.desconto }}%</div>
            <div class="produto-imagem">
              <img [src]="produto.imagem" [alt]="produto.nome" class="produto-img" (error)="produto.imagem = 'https://placehold.co/400x200?text=Produto'">
            </div>
            <div class="produto-info">
              <h3>{{ produto.nome }}</h3>
              <div class="precos">
                <span class="preco-antigo">{{ produto.precoOriginal | number }} Kz</span>
                <span class="preco-novo">{{ produto.precoOferta | number }} Kz</span>
              </div>
              <button class="btn-comprar" (click)="adicionarAoCarrinho($event, produto)">
                🛒 {{ t('ofertas.comprar') }}
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="produtosOferta.length === 0" class="sem-ofertas">
          <span>🎁</span>
          <p>Em breve novas ofertas!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ofertas-page { padding-top: 80px; min-height: calc(100vh - 140px); background: var(--bg-secondary); }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 24px 40px 24px; }
    .page-header { text-align: center; margin-bottom: 40px; }
    .page-header h1 { font-size: 2rem; color: var(--text-primary); margin-bottom: 8px; }
    .page-header p { color: var(--text-secondary); }
    .ofertas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
    .oferta-card { background: var(--card-bg); border-radius: 16px; overflow: hidden; box-shadow: var(--card-shadow); transition: transform 0.3s; position: relative; border: 1px solid var(--border); cursor: pointer; }
    .oferta-card:hover { transform: translateY(-4px); }
    .badge-desconto { position: absolute; top: 12px; left: 12px; background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; z-index: 1; }
    .produto-imagem { height: 200px; overflow: hidden; }
    .produto-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
    .oferta-card:hover .produto-img { transform: scale(1.05); }
    .produto-info { padding: 20px; }
    .produto-info h3 { font-size: 1.1rem; margin-bottom: 12px; color: var(--text-primary); }
    .precos { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .preco-antigo { font-size: 14px; color: var(--text-secondary); text-decoration: line-through; }
    .preco-novo { font-size: 1.5rem; font-weight: bold; color: #ef4444; }
    .btn-comprar { width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; transition: background 0.2s; }
    .btn-comprar:hover { background: var(--primary-dark); }
    .sem-ofertas { text-align: center; padding: 60px; background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border); }
    .sem-ofertas span { font-size: 48px; display: block; margin-bottom: 16px; }
    .sem-ofertas p { color: var(--text-secondary); }
    @media (max-width: 768px) { .ofertas-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; } .ofertas-page { padding-top: 70px; } }
  `]
})
export class OfertasComponent {
  constructor(
    private i18n: I18nService,
    private notificationService: NotificationService
  ) {}

  t(key: string): string {
    return this.i18n.t(key);
  }

  produtosOferta: ProdutoOferta[] = [
    { id: 1, nome: 'iPhone 15 Pro', precoOriginal: 1450000, precoOferta: 1250000, desconto: 14, imagem: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400' },
    { id: 2, nome: 'Samsung Galaxy S24 Ultra', precoOriginal: 1450000, precoOferta: 1320000, desconto: 9, imagem: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400' },
    { id: 3, nome: 'Dell XPS 15', precoOriginal: 2100000, precoOferta: 1850000, desconto: 12, imagem: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400' },
    { id: 4, nome: 'Sony WH-1000XM5', precoOriginal: 350000, precoOferta: 295000, desconto: 16, imagem: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400' },
    { id: 5, nome: 'Apple Watch Ultra 2', precoOriginal: 799000, precoOferta: 650000, desconto: 19, imagem: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400' },
    { id: 6, nome: 'AirPods Pro 2', precoOriginal: 230000, precoOferta: 185000, desconto: 20, imagem: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400' }
  ];

  adicionarAoCarrinho(event: Event, produto: ProdutoOferta): void {
    event.stopPropagation();
    
    // Buscar carrinho existente no localStorage
    const carrinhoSalvo = localStorage.getItem('carrinho');
    let itens = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    
    // Verificar se produto já existe no carrinho
    const itemExistente = itens.find((item: any) => item.id === produto.id);
    
    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      itens.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.precoOferta,
        quantidade: 1,
        imagem: produto.imagem
      });
    }
    
    // Salvar no localStorage
    localStorage.setItem('carrinho', JSON.stringify(itens));
    
    // Mensagem de sucesso
    this.notificationService.success(`${produto.nome} adicionado ao carrinho por ${produto.precoOferta} Kz!`);
  }
}