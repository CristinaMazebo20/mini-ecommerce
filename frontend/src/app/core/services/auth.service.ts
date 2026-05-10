import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'cliente' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  data?: Usuario;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioSignal = signal<Usuario | null>(null);
  public usuario = this.usuarioSignal.asReadonly();
  public isAdmin = computed(() => this.usuarioSignal()?.tipo === 'admin');
  public isLoggedIn = computed(() => !!this.usuarioSignal());

  constructor(private http: HttpClient, private router: Router) {
    this.carregarUsuarioStorage();
  }

  // ==================== LOGIN ====================
  login(email: string, senha: string): Observable<AuthResponse> {
  console.log('Chamando API de login para:', email);
  
  return this.http.post<AuthResponse>(`${this.apiUrl}/auth.php`, {
    action: 'login',
    email,
    senha
  }).pipe(
    tap(response => {
      console.log('Resposta da API:', response);
      if (response.success && response.data) {
        // Limpar qualquer dado antigo antes de salvar o novo
        localStorage.removeItem('usuario');
        localStorage.setItem('usuario', JSON.stringify(response.data));
        this.usuarioSignal.set(response.data);
      }
    })
  );
}

  // ==================== REGISTO ====================
  registar(dados: { nome: string; email: string; senha: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth.php`, {
      action: 'registar',
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha
    });
  }

  // ==================== RECUPERAÇÃO DE SENHA ====================
  solicitarRecuperacao(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php`, {
      action: 'recuperar',
      email
    });
  }

  verificarToken(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php`, {
      action: 'verificar_token',
      token
    });
  }

  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php`, {
      action: 'redefinir',
      token,
      novaSenha
    });
  }

  // ==================== LOGOUT ====================
  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioSignal.set(null);
    this.router.navigate(['/login']);
  }

  private carregarUsuarioStorage(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.usuarioSignal.set(JSON.parse(usuario));
    }
  }
}