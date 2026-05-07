import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Verificar se está logado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    // Verificar se é admin
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/produtos']);
      return false;
    }
    
    return true;
  }
}