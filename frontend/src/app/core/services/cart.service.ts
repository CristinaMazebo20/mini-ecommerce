import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ItemCarrinho {
  id: number;
  produto_id: number;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl;
  private cartSignal = signal<ItemCarrinho[]>([]);
  public cart = this.cartSignal.asReadonly();
  
  public totalItems = computed(() => 
    this.cartSignal().reduce((acc, item) => acc + item.quantidade, 0)
  );
  
  public totalPreco = computed(() => 
    this.cartSignal().reduce((acc, item) => acc + (item.preco * item.quantidade), 0)
  );

  constructor(private http: HttpClient) {
    this.carregarCarrinho();
  }

  carregarCarrinho(): void {
    this.http.get(`${this.apiUrl}/carrinho.php`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cartSignal.set(response.data);
        }
      },
      error: (err) => console.error('Erro ao carregar carrinho:', err)
    });
  }

  adicionarItem(produto: { id: number; nome: string; preco: number; imagem: string }): void {
    this.http.post(`${this.apiUrl}/carrinho.php`, {
      produto_id: produto.id,
      quantidade: 1
    }).subscribe({
      next: () => this.carregarCarrinho(),
      error: (err) => console.error('Erro ao adicionar:', err)
    });
  }

  removerItem(itemId: number): void {
    this.http.delete(`${this.apiUrl}/carrinho.php?id=${itemId}`).subscribe({
      next: () => this.carregarCarrinho(),
      error: (err) => console.error('Erro ao remover:', err)
    });
  }

  atualizarQuantidade(itemId: number, quantidade: number): void {
    this.http.put(`${this.apiUrl}/carrinho.php`, {
      id: itemId,
      quantidade
    }).subscribe({
      next: () => this.carregarCarrinho(),
      error: (err) => console.error('Erro ao atualizar:', err)
    });
  }

  limparCarrinho(): void {
    this.cartSignal.set([]);
  }
}