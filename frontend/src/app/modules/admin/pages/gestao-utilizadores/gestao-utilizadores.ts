import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
        <div class="card-header">
          <h2>Lista de Utilizadores</h2>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr><th>ID</th><th>Nome</th><th>Email</th><th>Tipo</th><th>Ações</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let usuario of usuarios">
                  <td>#{{ usuario.id }}</td>
                  <td>{{ usuario.nome }}</td>
                  <td>{{ usuario.email }}</td>
                  <td>
                    <select [(ngModel)]="usuario.tipo" (change)="atualizarTipo(usuario)" class="tipo-select">
                      <option value="cliente">👤 Cliente</option>
                      <option value="admin">👑 Administrador</option>
                    </select>
                  </td>
                  <td>
                    <button class="btn-icon delete" (click)="excluir(usuario.id)" title="Excluir">🗑️</button>
                  </td>
                </tr>
                <tr *ngIf="usuarios.length === 0">
                  <td colspan="5" class="empty-row">Nenhum utilizador encontrado</td>
                </tr>
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
    .card { background: var(--card-bg); border-radius: 16px; overflow: hidden; border: 1px solid var(--border); }
    .card-header { padding: 20px 24px; border-bottom: 1px solid var(--border); }
    .card-header h2 { font-size: 1.2rem; color: var(--text-primary); margin: 0; }
    .card-body { padding: 20px 24px; }
    .table-responsive { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { text-align: left; padding: 12px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
    .data-table td { padding: 12px; border-bottom: 1px solid var(--border); color: var(--text-primary); }
    .tipo-select { padding: 6px 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-primary); color: var(--text-primary); cursor: pointer; }
    .btn-icon { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; transition: all 0.2s; background: rgba(239,68,68,0.1); color: #ef4444; }
    .btn-icon:hover { background: #ef4444; color: white; }
    .empty-row { text-align: center; padding: 40px; color: var(--text-secondary); }
  `]
})
export class GestaoUtilizadores {
  usuarios: Usuario[] = [];

  constructor(private notificationService: NotificationService) {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    const salvos = localStorage.getItem('usuarios');
    if (salvos) {
      this.usuarios = JSON.parse(salvos);
    } else {
      this.usuarios = [
        { id: 1, nome: 'Admin Teste', email: 'admin@email.com', tipo: 'admin' },
        { id: 2, nome: 'Cliente Teste', email: 'cliente@email.com', tipo: 'cliente' }
      ];
      this.salvarUsuarios();
    }
  }

  salvarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }

  atualizarTipo(usuario: Usuario) {
    this.salvarUsuarios();
    this.notificationService.success(`Tipo do usuário ${usuario.nome} atualizado para ${usuario.tipo === 'admin' ? 'Administrador' : 'Cliente'}`);
  }

  excluir(id: number) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarios = this.usuarios.filter(u => u.id !== id);
      this.salvarUsuarios();
      this.notificationService.success('Usuário excluído com sucesso!');
    }
  }
}