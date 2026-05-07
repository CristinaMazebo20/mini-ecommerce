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

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php`, {
      action: 'login',
      email,
      senha
    }).pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          localStorage.setItem('usuario', JSON.stringify(response.data));
          this.usuarioSignal.set(response.data);
        }
      })
    );
  }

  registar(dados: { nome: string; email: string; senha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php`, {
      action: 'registar',
      ...dados
    });
  }

  // Recuperação de senha
  solicitarRecuperacao(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar.php`, {
      action: 'solicitar',
      email
    });
  }

  verificarToken(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar.php`, {
      action: 'verificar',
      token
    });
  }

  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar.php`, {
      action: 'redefinir',
      token,
      novaSenha
    });
  }

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