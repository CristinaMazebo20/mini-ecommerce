import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="checkout-page">
      <div class="container">
        <h1 class="page-title">📦 {{ t('checkout.titulo') }}</h1>

        <div class="checkout-grid">
          <!-- Formulário de endereço -->
          <div class="checkout-form">
            <h2>{{ t('checkout.endereco') }}</h2>
            
            <div class="form-group">
              <label>{{ t('checkout.nome') }}</label>
              <input type="text" class="form-control" [(ngModel)]="endereco.nome" [placeholder]="t('checkout.nome')">
            </div>

            <div class="form-group">
              <label>{{ t('checkout.rua') }}</label>
              <input type="text" class="form-control" [(ngModel)]="endereco.rua" [placeholder]="t('checkout.rua')">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>{{ t('checkout.cidade') }}</label>
                <input type="text" class="form-control" [(ngModel)]="endereco.cidade" [placeholder]="t('checkout.cidade')">
              </div>
              <div class="form-group">
                <label>{{ t('checkout.cep') }}</label>
                <input type="text" class="form-control" [(ngModel)]="endereco.cep" [placeholder]="t('checkout.cep')" (blur)="buscarCep()">
              </div>
            </div>

            <h2 style="margin-top: 30px;">{{ t('checkout.pagamento') }}</h2>
            
            <div class="pagamento-opcoes">
              <label class="pagamento-option">
                <input type="radio" value="pix" [(ngModel)]="pagamento" name="pagamento">
                <span>💳 {{ t('checkout.pix') }}</span>
              </label>
              <label class="pagamento-option">
                <input type="radio" value="cartao" [(ngModel)]="pagamento" name="pagamento">
                <span>💳 {{ t('checkout.cartao') }}</span>
              </label>
              <label class="pagamento-option">
                <input type="radio" value="dinheiro" [(ngModel)]="pagamento" name="pagamento">
                <span>💰 {{ t('checkout.dinheiro') }}</span>
              </label>
            </div>
          </div>

          <!-- Resumo do pedido -->
          <div class="checkout-resumo">
            <h2>{{ t('checkout.resumo') || 'Resumo do Pedido' }}</h2>
            
            <div *ngFor="let item of itens" class="resumo-item">
              <span>{{ item.nome }} x {{ item.quantidade }}</span>
              <span>{{ item.preco * item.quantidade | number }} Kz</span>
            </div>
            
            <div class="resumo-linha">
              <span>{{ t('cart.subtotal') }}:</span>
              <span>{{ subtotal | number }} Kz</span>
            </div>
            <div class="resumo-linha" *ngIf="desconto > 0">
              <span>{{ t('checkout.desconto') || 'Desconto (PIX)' }}:</span>
              <span style="color: var(--success);">- {{ desconto | number }} Kz</span>
            </div>
            <div class="resumo-linha total">
              <span>{{ t('cart.total') }}:</span>
              <span>{{ total | number }} Kz</span>
            </div>
            
            <button class="btn-confirmar" (click)="finalizarPedido()" [disabled]="carregando">
              {{ carregando ? (t('common.carregando')) : (t('checkout.confirmar')) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page {
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

    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 30px;
    }

    .checkout-form {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 30px;
      box-shadow: var(--card-shadow);
    }

    .checkout-form h2 {
      margin-bottom: 20px;
      color: var(--text-primary);
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg-primary);
      color: var(--text-primary);
      transition: all 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .pagamento-opcoes {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .pagamento-option {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      color: var(--text-primary);
    }

    .checkout-resumo {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 30px;
      height: fit-content;
      box-shadow: var(--card-shadow);
    }

    .checkout-resumo h2 {
      margin-bottom: 20px;
      color: var(--text-primary);
    }

    .resumo-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
      color: var(--text-secondary);
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
      border-top: 2px solid var(--border);
      margin-top: 10px;
      padding-top: 15px;
      color: var(--text-primary);
    }

    .btn-confirmar {
      width: 100%;
      padding: 15px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 20px;
      transition: background 0.2s;
    }

    .btn-confirmar:hover {
      background: var(--primary-dark);
    }

    .btn-confirmar:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .checkout-grid {
        grid-template-columns: 1fr;
      }
      .checkout-page {
        padding-top: 70px;
      }
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
    }
  `]
})
export class Checkout {
  itens: ItemCarrinho[] = [];
  carregando = false;
  pagamento = 'pix';
  
  endereco = {
    nome: '',
    rua: '',
    cidade: '',
    cep: ''
  };

  constructor(
    private router: Router,
    private http: HttpClient,
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

  get subtotal(): number {
    return this.itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  }

  get desconto(): number {
    return this.pagamento === 'pix' ? this.subtotal * 0.1 : 0;
  }

  get total(): number {
    return this.subtotal - this.desconto;
  }

  buscarCep() {
    if (this.endereco.cep.length === 8) {
      console.log('Buscando endereço para CEP:', this.endereco.cep);
    }
  }

  finalizarPedido() {
    // Validar endereço
    if (!this.endereco.nome || !this.endereco.rua || !this.endereco.cidade) {
      this.notificationService.error('Preencha todos os dados do endereço');
      return;
    }

    this.carregando = true;

    // Buscar usuário logado
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
      this.notificationService.error('Usuário não está logado. Faça login novamente.');
      this.carregando = false;
      this.router.navigate(['/login']);
      return;
    }

    const usuario = JSON.parse(usuarioStr);
    
    if (!usuario.id || usuario.id === 0) {
      this.notificationService.error('ID do usuário inválido. Faça login novamente.');
      this.carregando = false;
      this.router.navigate(['/login']);
      return;
    }

    console.log('Usuário logado:', usuario);
    console.log('Itens do carrinho:', this.itens);

    // Montar pedido
    const pedido = {
  utilizador_id: usuario.id,
  endereco: `${this.endereco.rua}, ${this.endereco.cidade}`,
  cidade: this.endereco.cidade,
  cep: this.endereco.cep,
  forma_pagamento: this.pagamento,
  total: this.total,  // Certifique-se que this.total está correto
  itens: this.itens.map(item => ({
    produto_id: item.id,
    quantidade: item.quantidade,
    preco_unitario: item.preco
  }))
};

    console.log('Enviando pedido:', pedido);

    // Enviar para API
    this.http.post('http://localhost/backend/api/pedidos.php', pedido).subscribe({
      next: (response: any) => {
        this.carregando = false;
        console.log('Resposta da API:', response);
        
        if (response.success) {
          localStorage.removeItem('carrinho');
          this.notificationService.success('Pedido realizado com sucesso!');
          this.router.navigate(['/pedidos']);
        } else {
          this.notificationService.error(response.message || 'Erro ao realizar pedido');
        }
      },
      error: (err) => {
        this.carregando = false;
        console.error('Erro na requisição:', err);
        
        if (err.error && err.error.message) {
          this.notificationService.error('Erro: ' + err.error.message);
        } else {
          this.notificationService.error('Erro de conexão. Verifique se o servidor está rodando.');
        }
      }
    });
  }
}