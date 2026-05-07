import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSignal = signal<'light' | 'dark'>('light');
  public currentTheme = this.themeSignal.asReadonly();

  constructor() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    this.themeSignal.set(initialTheme);
    this.applyTheme(initialTheme);

    effect(() => {
      const theme = this.themeSignal();
      localStorage.setItem('theme', theme);
      this.applyTheme(theme);
    });
  }

  toggleTheme() {
    const newTheme = this.themeSignal() === 'light' ? 'dark' : 'light';
    this.themeSignal.set(newTheme);
  }

  private applyTheme(theme: 'light' | 'dark') {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  isDark(): boolean {
    return this.themeSignal() === 'dark';
  }
}