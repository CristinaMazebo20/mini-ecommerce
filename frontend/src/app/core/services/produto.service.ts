import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagem: string;
  categoria?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = `${environment.apiUrl}/produtos.php`;

  constructor(private http: HttpClient) {}

  // GET - Listar todos os produtos
  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // GET - Buscar produto por ID
  buscar(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?id=${id}`);
  }

  // POST - Criar novo produto
  criar(produto: Produto): Observable<any> {
    return this.http.post(this.apiUrl, produto);
  }

  // PUT - Atualizar produto
  atualizar(produto: Produto): Observable<any> {
    return this.http.put(this.apiUrl, produto);
  }

  // DELETE - Remover produto
  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`);
  }
}