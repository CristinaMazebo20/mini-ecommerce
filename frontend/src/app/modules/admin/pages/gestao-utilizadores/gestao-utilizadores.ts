import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../../core/services/notification.service';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

@Component({
  selector: 'app-gestao-utilizadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>👥 Gestão de Utilizadores</h1>
        <p>Gerencie os utilizadores do sistema</p>
      </div>

      <div class="card">
        <div class="card-header"><h2>Lista de Utilizadores</h2></div>
        <div class="card-body">
          <div *ngIf="carregando" class="loading">Carregando...</div>
          <div class="table-responsive" *ngIf="!carregando">
            <table class="data-table">
              <thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Tipo</th><th>Ações</th></tr></thead>
              <tbody>
                <tr *ngFor="let usuario of usuarios">
                  <td>#{{ usuario.id }}</td><td>{{ usuario.nome }}</td><td>{{ usuario.email }}</td>
                  <td>
                    <select [(ngModel)]="usuario.tipo" (change)="atualizarTipo(usuario)">
                      <option value="cliente">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                  <td><button class="btn-excluir" (click)="excluir(usuario.id)">🗑️</button></td>
                </tr>
                <tr *ngIf="usuarios.length === 0"><td colspan="5" class="empty-row">Nenhum utilizador encontrado</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 0; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.8rem; color: var(--text-primary); margin-bottom: 4px; }
    .page-header p { color: var(--text-secondary); font-size: 14px; }
    .card { background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border); }
    .card-header { padding: 20px 24px; border-bottom: 1px solid var(--border); }
    .card-header h2 { font-size: 1.2rem; color: var(--text-primary); margin: 0; }
    .card-body { padding: 20px 24px; }
    .table-responsive { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { text-align: left; padding: 12px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
    .data-table td { padding: 12px; border-bottom: 1px solid var(--border); color: var(--text-primary); }
    select { padding: 6px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-primary); color: var(--text-primary); }
    .btn-excluir { padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; }
    .loading, .empty-row { text-align: center; padding: 40px; color: var(--text-secondary); }
  `]
})
export class GestaoUtilizadores {
  usuarios: Usuario[] = [];
  carregando = true;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.carregando = true;
    this.http.get('http://localhost/backend/api/utilizadores.php').subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success) {
          this.usuarios = response.data;
        }
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error('Erro ao carregar utilizadores');
      }
    });
  }

  atualizarTipo(usuario: Usuario) {
    this.http.put('http://localhost/backend/api/utilizadores.php', { id: usuario.id, tipo: usuario.tipo }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notificationService.success(`Tipo do usuário ${usuario.nome} atualizado`);
        }
      },
      error: () => this.notificationService.error('Erro ao atualizar tipo')
    });
  }

  excluir(id: number) {
    if (confirm('Tem certeza?')) {
      this.http.delete(`http://localhost/backend/api/utilizadores.php?id=${id}`).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notificationService.success('Usuário excluído');
            this.carregarUsuarios();
          }
        },
        error: () => this.notificationService.error('Erro ao excluir')
      });
    }
  }
}