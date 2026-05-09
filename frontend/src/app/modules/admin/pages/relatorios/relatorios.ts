import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../../core/services/notification.service';
import { I18nService } from '../../../../core/services/i18n.service';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagem: string;
  categoria: string;
  created_at: string;
}

interface Pedido {
  id: number;
  codigo: string;
  data: string;
  total: number;
  status: string;
  forma_pagamento: string;
  endereco: string;
  cidade: string;
  cliente_nome: string;
  itens?: any[];
}

interface Utilizador {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  telefone: string;
  created_at: string;
}

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relatorios-container">
      <div class="container">
        <!-- Cabeçalho -->
        <div class="header">
          <h1>📊 {{ t('relatorios.titulo') || 'Central de Relatórios' }}</h1>
          <p>{{ t('relatorios.subtitulo') || 'Exporte e analise dados da sua loja' }}</p>
        </div>

        <!-- Cards de resumo -->
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-icon">📦</div>
            <div class="card-info">
              <span class="card-value">{{ totalProdutos }}</span>
              <span class="card-label">{{ t('dashboard.total_produtos') || 'Produtos' }}</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon">📋</div>
            <div class="card-info">
              <span class="card-value">{{ totalPedidos }}</span>
              <span class="card-label">{{ t('dashboard.total_pedidos') || 'Pedidos' }}</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon">💰</div>
            <div class="card-info">
              <span class="card-value">{{ faturamentoTotal | number }} Kz</span>
              <span class="card-label">{{ t('dashboard.faturamento') || 'Faturamento' }}</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon">👥</div>
            <div class="card-info">
              <span class="card-value">{{ totalClientes }}</span>
              <span class="card-label">{{ t('dashboard.total_clientes') || 'Clientes' }}</span>
            </div>
          </div>
        </div>

        <!-- Seção de Relatórios -->
        <div class="reports-section">
          <h2>📁 {{ t('relatorios.disponiveis') || 'Relatórios Disponíveis' }}</h2>
          
          <div class="reports-grid">
            <!-- Relatório de Produtos -->
            <div class="report-card">
              <div class="report-header">
                <span class="report-icon">📦</span>
                <div>
                  <h3>{{ t('relatorios.produtos') || 'Produtos' }}</h3>
                  <p>{{ t('relatorios.produtos_desc') || 'Lista completa do catálogo' }}</p>
                </div>
              </div>
              <div class="report-preview">
                <div class="preview-row" *ngFor="let p of produtosPreview">
                  <span>{{ p.nome }}</span>
                  <span>{{ p.preco | number }} Kz</span>
                </div>
              </div>
              <div class="report-actions">
                <button class="btn-csv" (click)="exportarCSV('produtos')" [disabled]="carregandoProdutos">
                  📥 {{ t('relatorios.exportar_csv') || 'Exportar CSV' }}
                </button>
                <button class="btn-detalhes" (click)="verDetalhes('produtos')">🔍 {{ t('relatorios.ver_tudo') || 'Ver tudo' }}</button>
              </div>
            </div>

            <!-- Relatório de Pedidos -->
            <div class="report-card">
              <div class="report-header">
                <span class="report-icon">📋</span>
                <div>
                  <h3>{{ t('relatorios.pedidos') || 'Pedidos' }}</h3>
                  <p>{{ t('relatorios.pedidos_desc') || 'Todos os pedidos realizados' }}</p>
                </div>
              </div>
              <div class="report-preview">
                <div class="preview-row" *ngFor="let p of pedidosPreview">
                  <span>#{{ p.id }}</span>
                  <span>{{ p.cliente_nome || 'Cliente' }}</span>
                  <span>{{ p.total | number }} Kz</span>
                </div>
              </div>
              <div class="report-actions">
                <button class="btn-csv" (click)="exportarCSV('pedidos')" [disabled]="carregandoPedidos">
                  📥 {{ t('relatorios.exportar_csv') || 'Exportar CSV' }}
                </button>
                <button class="btn-detalhes" (click)="verDetalhes('pedidos')">🔍 {{ t('relatorios.ver_tudo') || 'Ver tudo' }}</button>
              </div>
            </div>

            <!-- Relatório de Utilizadores -->
            <div class="report-card">
              <div class="report-header">
                <span class="report-icon">👥</span>
                <div>
                  <h3>{{ t('relatorios.utilizadores') || 'Utilizadores' }}</h3>
                  <p>{{ t('relatorios.utilizadores_desc') || 'Clientes e administradores' }}</p>
                </div>
              </div>
              <div class="report-preview">
                <div class="preview-row" *ngFor="let u of utilizadoresPreview">
                  <span>{{ u.nome }}</span>
                  <span>{{ u.email }}</span>
                  <span>{{ u.tipo === 'admin' ? 'Admin' : (t('usuarios.cliente') || 'Cliente') }}</span>
                </div>
              </div>
              <div class="report-actions">
                <button class="btn-csv" (click)="exportarCSV('utilizadores')" [disabled]="carregandoClientes">
                  📥 {{ t('relatorios.exportar_csv') || 'Exportar CSV' }}
                </button>
                <button class="btn-detalhes" (click)="verDetalhes('utilizadores')">🔍 {{ t('relatorios.ver_tudo') || 'Ver tudo' }}</button>
              </div>
            </div>

            <!-- Relatório Financeiro -->
            <div class="report-card">
              <div class="report-header">
                <span class="report-icon">💰</span>
                <div>
                  <h3>{{ t('relatorios.financeiro') || 'Financeiro' }}</h3>
                  <p>{{ t('relatorios.financeiro_desc') || 'Resumo de faturamento' }}</p>
                </div>
              </div>
              <div class="financeiro-preview">
                <div class="preview-row">
                  <span>{{ t('dashboard.faturamento') || 'Faturamento Total' }}</span>
                  <span class="valor-destaque">{{ faturamentoTotal | number }} Kz</span>
                </div>
                <div class="preview-row">
                  <span>{{ t('relatorios.ticket_medio') || 'Ticket Médio' }}</span>
                  <span>{{ ticketMedio | number }} Kz</span>
                </div>
                <div class="preview-row">
                  <span>{{ t('dashboard.total_pedidos') || 'Total de Pedidos' }}</span>
                  <span>{{ totalPedidos }}</span>
                </div>
              </div>
              <div class="report-actions">
                <button class="btn-csv" (click)="exportarCSV('financeiro')" [disabled]="carregandoPedidos">
                  📥 {{ t('relatorios.exportar_csv') || 'Exportar CSV' }}
                </button>
                <button class="btn-detalhes" (click)="verDetalhes('financeiro')">🔍 {{ t('relatorios.ver_tudo') || 'Ver detalhes' }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <div class="modal" *ngIf="modalAberto" (click)="fecharModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalTitulo }}</h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="table-responsive">
            <table class="detalhes-table">
              <thead>
                <tr>
                  <th *ngFor="let col of modalColunas">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of modalDados">
                  <td *ngFor="let col of modalColunas">{{ row[col] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .relatorios-container {
      min-height: calc(100vh - 200px);
      background: var(--bg-secondary);
      padding: 40px 20px;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Header */
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { font-size: 2rem; color: var(--text-primary); margin-bottom: 8px; }
    .header p { color: var(--text-secondary); }

    /* Summary Cards */
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }

    .summary-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      border: 1px solid var(--border);
    }

    .card-icon { font-size: 40px; }
    .card-info { display: flex; flex-direction: column; }
    .card-value { font-size: 1.8rem; font-weight: bold; color: var(--primary); }
    .card-label { font-size: 0.8rem; color: var(--text-secondary); }

    /* Reports Section */
    .reports-section h2 { font-size: 1.4rem; color: var(--text-primary); margin-bottom: 24px; }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .report-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 20px;
      border: 1px solid var(--border);
      transition: all 0.3s;
    }

    .report-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

    .report-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
    .report-icon { font-size: 32px; }
    .report-header h3 { font-size: 1.2rem; color: var(--text-primary); margin-bottom: 4px; }
    .report-header p { font-size: 0.8rem; color: var(--text-secondary); }

    .report-preview, .financeiro-preview { margin-bottom: 20px; }
    .preview-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 0.85rem; color: var(--text-secondary); }
    .valor-destaque { font-weight: bold; color: var(--primary); }

    .report-actions { display: flex; gap: 12px; }
    .btn-csv, .btn-detalhes { flex: 1; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-csv { background: var(--primary); color: white; border: none; }
    .btn-csv:hover { background: var(--primary-dark); }
    .btn-detalhes { background: transparent; border: 1px solid var(--border); color: var(--text-primary); }
    .btn-detalhes:hover { border-color: var(--primary); color: var(--primary); }

    /* Modal */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: var(--card-bg);
      border-radius: 16px;
      width: 90%;
      max-width: 1000px;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
    }

    .modal-header h3 { color: var(--text-primary); margin: 0; }
    .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-secondary); }

    .modal-body { padding: 20px; overflow-y: auto; }

    .detalhes-table { width: 100%; border-collapse: collapse; }
    .detalhes-table th, .detalhes-table td { padding: 10px; text-align: left; border-bottom: 1px solid var(--border); }
    .detalhes-table th { font-weight: 600; color: var(--text-secondary); }
    .detalhes-table td { color: var(--text-primary); }

    @media (max-width: 1000px) { .summary-cards { grid-template-columns: repeat(2, 1fr); } .reports-grid { grid-template-columns: 1fr; } }
    @media (max-width: 640px) { .summary-cards { grid-template-columns: 1fr; } }
  `]
})
export class Relatorios {
  totalProdutos = 0;
  totalPedidos = 0;
  faturamentoTotal = 0;
  totalClientes = 0;
  ticketMedio = 0;
  
  carregandoProdutos = true;
  carregandoPedidos = true;
  carregandoClientes = true;
  
  produtosData: Produto[] = [];
  pedidosData: Pedido[] = [];
  clientesData: Utilizador[] = [];

  // Modal
  modalAberto = false;
  modalTitulo = '';
  modalColunas: string[] = [];
  modalDados: any[] = [];

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private i18n: I18nService
  ) {
    this.carregarTodosDados();
  }

  t(key: string): string {
    return this.i18n.t(key);
  }

  get produtosPreview() { return this.produtosData.slice(0, 3); }
  get pedidosPreview() { return this.pedidosData.slice(0, 3); }
  get utilizadoresPreview() { return this.clientesData.filter(u => u.tipo !== 'admin').slice(0, 3); }

  carregarTodosDados() {
    this.carregarProdutos();
    this.carregarPedidos();
    this.carregarClientes();
  }

  carregarProdutos() {
    this.carregandoProdutos = true;
    this.http.get('http://localhost/backend/api/produtos.php').subscribe({
      next: (response: any) => {
        this.carregandoProdutos = false;
        if (response.success && response.data) {
          this.produtosData = response.data;
          this.totalProdutos = response.data.length;
        }
      },
      error: () => { this.carregandoProdutos = false; this.notificationService.error('Erro ao carregar produtos'); }
    });
  }

  carregarPedidos() {
    this.carregandoPedidos = true;
    this.http.get('http://localhost/backend/api/pedidos.php').subscribe({
      next: (response: any) => {
        this.carregandoPedidos = false;
        if (response.success && response.data) {
          this.pedidosData = response.data;
          this.totalPedidos = response.data.length;
          this.faturamentoTotal = response.data.reduce((sum: number, p: any) => sum + (parseFloat(p.total) || 0), 0);
          this.ticketMedio = this.totalPedidos > 0 ? this.faturamentoTotal / this.totalPedidos : 0;
        }
      },
      error: () => { this.carregandoPedidos = false; this.notificationService.error('Erro ao carregar pedidos'); }
    });
  }

  carregarClientes() {
    this.carregandoClientes = true;
    this.http.get('http://localhost/backend/api/utilizadores.php').subscribe({
      next: (response: any) => {
        this.carregandoClientes = false;
        if (response.success && response.data) {
          this.clientesData = response.data;
          this.totalClientes = response.data.filter((u: any) => u.tipo === 'cliente').length;
        }
      },
      error: () => { this.carregandoClientes = false; this.notificationService.error('Erro ao carregar clientes'); }
    });
  }

  exportarCSV(tipo: string) {
    let dados: any[] = [];
    let cabecalho: string[] = [];

    if (tipo === 'produtos') {
      cabecalho = ['ID', 'Nome', 'Descrição', 'Preço (Kz)', 'Estoque', 'Categoria', 'Data Cadastro'];
      dados = this.produtosData.map(p => [p.id, p.nome, p.descricao, p.preco, p.estoque, p.categoria, new Date(p.created_at).toLocaleDateString()]);
    } 
    else if (tipo === 'pedidos') {
      cabecalho = ['ID', 'Código', 'Cliente', 'Total (Kz)', 'Status', 'Pagamento', 'Endereço', 'Data'];
      dados = this.pedidosData.map(p => [p.id, p.codigo, p.cliente_nome, p.total, p.status, p.forma_pagamento, p.endereco, new Date(p.data).toLocaleDateString()]);
    } 
    else if (tipo === 'utilizadores') {
      cabecalho = ['ID', 'Nome', 'Email', 'Tipo', 'Telefone', 'Data Cadastro'];
      dados = this.clientesData.map(u => [u.id, u.nome, u.email, u.tipo === 'admin' ? 'Administrador' : 'Cliente', u.telefone || '-', new Date(u.created_at).toLocaleDateString()]);
    } 
    else if (tipo === 'financeiro') {
      cabecalho = ['Total Pedidos', 'Faturamento Total (Kz)', 'Ticket Médio (Kz)'];
      dados = [[this.totalPedidos, this.faturamentoTotal, this.ticketMedio]];
    }

    if (dados.length === 0) {
      this.notificationService.warning(`Sem dados para exportar`);
      return;
    }

    const csv = [cabecalho.join(','), ...dados.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_${tipo}_${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    this.notificationService.success(`Relatório de ${tipo} exportado com sucesso!`);
  }

  verDetalhes(tipo: string) {
    this.modalAberto = true;
    
    if (tipo === 'produtos') {
      this.modalTitulo = '📦 Lista Completa de Produtos';
      this.modalColunas = ['ID', 'Nome', 'Preço', 'Estoque', 'Categoria'];
      this.modalDados = this.produtosData.map(p => ({ ID: p.id, Nome: p.nome, Preço: `${p.preco} Kz`, Estoque: p.estoque, Categoria: p.categoria || '-' }));
    } 
    else if (tipo === 'pedidos') {
      this.modalTitulo = '📋 Lista Completa de Pedidos';
      this.modalColunas = ['ID', 'Código', 'Cliente', 'Total', 'Status', 'Data'];
      this.modalDados = this.pedidosData.map(p => ({ ID: p.id, Código: p.codigo, Cliente: p.cliente_nome, Total: `${p.total} Kz`, Status: p.status, Data: new Date(p.data).toLocaleDateString() }));
    } 
    else if (tipo === 'utilizadores') {
      this.modalTitulo = '👥 Lista Completa de Utilizadores';
      this.modalColunas = ['ID', 'Nome', 'Email', 'Tipo'];
      this.modalDados = this.clientesData.map(u => ({ ID: u.id, Nome: u.nome, Email: u.email, Tipo: u.tipo === 'admin' ? '👑 Admin' : '👤 Cliente' }));
    } 
    else if (tipo === 'financeiro') {
      this.modalTitulo = '💰 Detalhes Financeiros';
      this.modalColunas = ['Métrica', 'Valor'];
      this.modalDados = [
        { Métrica: 'Total de Pedidos', Valor: this.totalPedidos },
        { Métrica: 'Faturamento Total', Valor: `${this.faturamentoTotal} Kz` },
        { Métrica: 'Ticket Médio', Valor: `${this.ticketMedio.toFixed(2)} Kz` },
        { Métrica: 'Total de Clientes', Valor: this.totalClientes },
        { Métrica: 'Total de Produtos', Valor: this.totalProdutos }
      ];
    }
  }

  fecharModal(event?: MouseEvent) {
    if (!event || (event.target as HTMLElement).classList.contains('modal')) {
      this.modalAberto = false;
    }
  }
}