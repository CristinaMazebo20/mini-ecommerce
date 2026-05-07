import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="brand-icon">
              <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="mazeboGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#8b5cf6" />
                    <stop offset="100%" style="stop-color:#5b21b6" />
                  </linearGradient>
                </defs>
                <rect x="4" y="4" width="28" height="28" rx="10" fill="url(#mazeboGrad)"/>
                <path d="M12 12 L16 24 L20 18 L24 24 L28 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              </svg>
            </div>
            <h3>MazeboShop</h3>
            <p>{{ t('footer.sobre.texto') }}</p>
          </div>
          
          <div class="footer-links">
            <h4>{{ t('footer.links') }}</h4>
            <ul>
              <li><a routerLink="/produtos">{{ t('footer.produtos') }}</a></li>
              <li><a routerLink="/carrinho">{{ t('footer.carrinho') }}</a></li>
              <li><a routerLink="/pedidos">{{ t('footer.pedidos') }}</a></li>
            </ul>
          </div>
          
          <div class="footer-contact">
            <h4>{{ t('footer.contato') }}</h4>
            <ul>
              <li>📍 Luanda, Angola</li>
              <li>📞 +244 999 999 999</li>
              <li>✉️ contato@mazeboshop.ao</li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2026 MazeboShop - {{ t('footer.direitos') }}</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--footer-bg);
      color: white;
      padding: 48px 0 24px;
      margin-top: 48px;
    }
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      margin-bottom: 40px;
    }
    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .brand-icon {
      margin-bottom: 8px;
    }
    .footer-brand h3 {
      font-size: 20px;
      color: white;
    }
    .footer-brand p {
      color: #9ca3af;
      line-height: 1.5;
    }
    .footer-links h4, .footer-contact h4 {
      margin-bottom: 16px;
      color: white;
    }
    .footer-links ul, .footer-contact ul {
      list-style: none;
      padding: 0;
    }
    .footer-links li, .footer-contact li {
      margin-bottom: 10px;
      color: #9ca3af;
    }
    .footer-links a {
      color: #9ca3af;
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-links a:hover {
      color: var(--primary);
    }
    .footer-bottom {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #374151;
      color: #9ca3af;
      font-size: 14px;
    }
    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .footer-brand {
        align-items: center;
      }
    }
  `]
})
export class FooterComponent {
  constructor(private i18n: I18nService) {}

  t(key: string): string {
    return this.i18n.t(key);
  }
}