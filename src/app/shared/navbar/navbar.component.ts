import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isScrolled = signal(false);
  menuOpen = signal(false);

  constructor(private analytics: AnalyticsService) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  onCtaClick(): void {
    this.analytics.track('cta_click', {
      page: 'navbar',
      element: 'desktop_cta',
      label: 'Get Started',
    });
  }

  onMobileCtaClick(): void {
    this.closeMenu();
    this.analytics.track('cta_click', {
      page: 'navbar',
      element: 'mobile_cta',
      label: 'Get Started',
    });
  }
}

