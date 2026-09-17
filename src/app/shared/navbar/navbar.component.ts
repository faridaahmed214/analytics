import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav
      class="navbar"
      [class.scrolled]="isScrolled()"
      role="navigation"
      aria-label="Main navigation"
    >
      <div class="navbar-inner">
        <!-- Logo -->
        <a routerLink="/" class="navbar-logo" aria-label="Home">
          <div class="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#C9A96E"/>
              <path d="M7 14C7 10.134 10.134 7 14 7C17.866 7 21 10.134 21 14H17.5C17.5 12.067 15.933 10.5 14 10.5C12.067 10.5 10.5 12.067 10.5 14H7Z" fill="#1C1917"/>
              <circle cx="14" cy="19" r="2.5" fill="#1C1917"/>
            </svg>
          </div>
        </a>

        <!-- Desktop Links -->
        <div class="navbar-links" role="menubar">
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link"
            role="menuitem"
          >
            Home
          </a>
          <a
            routerLink="/search"
            routerLinkActive="active"
            class="nav-link"
            role="menuitem"
          >
            Search
          </a>
          <a
            routerLink="/form"
            routerLinkActive="active"
            class="nav-link"
            role="menuitem"
          >
            Contact
          </a>
        </div>

        <!-- CTA -->
        <a routerLink="/form" class="navbar-cta" aria-label="Get started">
          Get Started
        </a>

        <!-- Mobile Hamburger -->
        <button
          class="hamburger"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
          aria-label="Toggle navigation menu"
        >
          <span class="bar" [class.open]="menuOpen()"></span>
          <span class="bar" [class.open]="menuOpen()"></span>
          <span class="bar" [class.open]="menuOpen()"></span>
        </button>
      </div>

      <!-- Mobile Drawer -->
      <div class="mobile-menu" [class.open]="menuOpen()" role="menu">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="mobile-link" (click)="closeMenu()" role="menuitem">Home</a>
        <a routerLink="/search" routerLinkActive="active" class="mobile-link" (click)="closeMenu()" role="menuitem">Search</a>
        <a routerLink="/form" routerLinkActive="active" class="mobile-link" (click)="closeMenu()" role="menuitem">Contact</a>
        <a routerLink="/form" class="mobile-cta" (click)="closeMenu()" role="menuitem">Get Started</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: all 0.3s ease;
      border-bottom: 1px solid transparent;
    }

    .navbar.scrolled {
      background: rgba(249, 247, 244, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom-color: rgba(201, 169, 110, 0.15);
      box-shadow: 0 4px 32px rgba(28, 25, 23, 0.06);
    }

    .navbar-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
    }

    .navbar-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      flex-shrink: 0;
    }

    .logo-icon {
      display: flex;
      align-items: center;
      transition: transform 0.3s ease;
    }

    .navbar-logo:hover .logo-icon {
      transform: rotate(-8deg) scale(1.05);
    }

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: var(--color-text);
      letter-spacing: -0.5px;
    }

    .navbar-links {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      justify-content: center;
    }

    .nav-link {
      position: relative;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-muted);
      text-decoration: none;
      border-radius: 8px;
      transition: color 0.2s ease, background 0.2s ease;
      letter-spacing: 0.01em;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: var(--color-accent);
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .nav-link:hover {
      color: var(--color-text);
      background: rgba(201, 169, 110, 0.08);
    }

    .nav-link.active {
      color: var(--color-text);
      font-weight: 600;
    }

    .nav-link.active::after {
      width: 20px;
    }

    .navbar-cta {
      flex-shrink: 0;
      padding: 9px 20px;
      background: var(--color-text);
      color: var(--color-surface);
      font-size: 13px;
      font-weight: 600;
      border-radius: 10px;
      text-decoration: none;
      letter-spacing: 0.02em;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }

    .navbar-cta:hover {
      background: var(--color-accent);
      color: var(--color-text);
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(201, 169, 110, 0.35);
    }

    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }

    .bar {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--color-text);
      border-radius: 2px;
      transition: all 0.3s ease;
      transform-origin: center;
    }

    .bar.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .bar.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .bar.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    .mobile-menu {
      display: none;
      flex-direction: column;
      padding: 0 24px 16px;
      gap: 4px;
      background: rgba(249, 247, 244, 0.97);
      backdrop-filter: blur(20px);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s ease, padding 0.3s ease;
    }

    .mobile-menu.open {
      max-height: 400px;
      padding: 8px 24px 24px;
    }

    .mobile-link {
      padding: 12px 16px;
      font-size: 15px;
      font-weight: 500;
      color: var(--color-text-muted);
      text-decoration: none;
      border-radius: 10px;
      transition: color 0.2s, background 0.2s;
    }

    .mobile-link:hover, .mobile-link.active {
      color: var(--color-text);
      background: rgba(201, 169, 110, 0.08);
    }

    .mobile-cta {
      margin-top: 8px;
      padding: 13px 16px;
      background: var(--color-text);
      color: var(--color-surface);
      font-size: 15px;
      font-weight: 600;
      border-radius: 12px;
      text-decoration: none;
      text-align: center;
      transition: background 0.2s ease;
    }

    .mobile-cta:hover {
      background: var(--color-accent);
      color: var(--color-text);
    }

    /* ===========================
       RESPONSIVE — TABLET (≤900px)
       =========================== */
    @media (max-width: 900px) {
      .navbar-inner { padding: 0 20px; gap: 16px; }
      .nav-link { padding: 8px 10px; font-size: 13px; }
      .navbar-cta { padding: 8px 16px; font-size: 12px; }
    }

    /* ===========================
       RESPONSIVE — MOBILE (≤768px)
       =========================== */
    @media (max-width: 768px) {
      .navbar-links, .navbar-cta { display: none; }
      .hamburger { display: flex; }
      .mobile-menu { display: flex; }
      .navbar.scrolled { border-bottom-color: rgba(201, 169, 110, 0.1); }
      .navbar-inner { height: 64px; padding: 0 20px; }
    }

    /* ===========================
       RESPONSIVE — SMALL MOBILE (≤390px)
       =========================== */
    @media (max-width: 390px) {
      .navbar-inner { padding: 0 16px; }
      .logo-text { font-size: 18px; }
      .mobile-menu { padding-left: 16px; padding-right: 16px; }
    }
  `]
})
export class NavbarComponent {
  isScrolled = signal(false);
  menuOpen = signal(false);

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
}

