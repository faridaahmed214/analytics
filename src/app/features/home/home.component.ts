import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-page">
      <!-- Animated Background Blobs -->
      <div class="blob blob-1" aria-hidden="true"></div>
      <div class="blob blob-2" aria-hidden="true"></div>
      <div class="blob blob-3" aria-hidden="true"></div>

      <!-- Hero Section -->
      <section class="hero" aria-labelledby="hero-heading">
        <div class="hero-content">
          <div class="hero-badge" [class.animate-in]="isVisible()">
            <span class="badge-dot"></span>
            Premium Financial Platform
          </div>

          <h1 id="hero-heading" class="hero-title" [class.animate-in]="isVisible()">
            <span class="title-line">Empowering</span>
            <span class="title-line title-accent">Smarter Payments</span>
            <span class="title-line">Worldwide</span>
          </h1>

          <p class="hero-desc">
            We deliver next-generation payment infrastructure for businesses
            across the Middle East and Africa â€” fast, secure, and beautifully simple.
          </p>

          <div class="hero-actions" [class.animate-in]="isVisible()">
            <button 
              class="btn-primary" 
              (click)="onCtaClick()"
              aria-label="Get started"
            >
              <span>Get Started</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <a routerLink="/search" class="btn-secondary" id="hero-explore-button">
              Explore Products
            </a>
          </div>

          <!-- Trust Badges -->
          <div class="trust-row" [class.animate-in]="isVisible()">
            <div class="trust-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1L9.8 6H15L10.6 9.3L12.4 14.3L8 11L3.6 14.3L5.4 9.3L1 6H6.2L8 1Z" fill="#C9A96E"/>
              </svg>
              <span>ISO 27001 Certified</span>
            </div>
            <div class="trust-sep" aria-hidden="true">Â·</div>
            <div class="trust-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="5" width="12" height="9" rx="2" stroke="#C9A96E" stroke-width="1.5"/>
                <path d="M5 5V4C5 2.343 6.343 1 8 1C9.657 1 11 2.343 11 4V5" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>PCI DSS Level 1</span>
            </div>
            <div class="trust-sep" aria-hidden="true">Â·</div>
            <div class="trust-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="#C9A96E" stroke-width="1.5"/>
                <path d="M5 8L7 10L11 6" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>99.99% Uptime SLA</span>
            </div>
          </div>
        </div>

        <!-- Hero Visual -->
        <div class="hero-visual" [class.animate-in]="isVisible()" aria-hidden="true">
          <div class="card-mockup">
            <div class="card-face">
              <div class="card-chip"></div>
              <div class="card-number">•••• •••• •••• 4291</div>
              <div class="card-bottom">
                <div>
                  <div class="card-label">Card Holder</div>
                  <div class="card-value">Farida Ahmed</div>
                </div>
                <div>
                  <div class="card-label">Expires</div>
                  <div class="card-value">09/28</div>
                </div>
                <div class="card-logo">
 <div class="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#C9A96E"/>
              <path d="M7 14C7 10.134 10.134 7 14 7C17.866 7 21 10.134 21 14H17.5C17.5 12.067 15.933 10.5 14 10.5C12.067 10.5 10.5 12.067 10.5 14H7Z" fill="#1C1917"/>
              <circle cx="14" cy="19" r="2.5" fill="#1C1917"/>
            </svg>
          </div>                </div>
              </div>
            </div>
          </div>

          <!-- Floating Stats -->
          <div class="stat-chip stat-chip-1">
            <div class="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </div>
            <div>
              <div class="stat-value">+24.8%</div>
              <div class="stat-label">Revenue Growth</div>
            </div>
          </div>
          <div class="stat-chip stat-chip-2">
            <div class="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <div>
              <div class="stat-value">0.3s</div>
              <div class="stat-label">Avg. Processing</div>
            </div>
          </div>
          <div class="stat-chip stat-chip-3">
            <div class="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <div>
              <div class="stat-value">47+</div>
              <div class="stat-label">Countries</div>
            </div>
          </div>
        </div>
      </section>




      <!-- CTA Section -->
      <section class="cta-section" aria-labelledby="cta-section-heading">
        <div class="cta-inner">
          <h2 id="cta-section-heading" class="cta-title">Ready to transform your payment experience?</h2>
          <p class="cta-sub">Join thousands of businesses processing billions in transactions.</p>
          <div class="cta-actions">
            <button id="bottom-cta-button" class="btn-primary" (click)="onCtaClick()">
              <span>Start Free Trial</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <a routerLink="/form" id="bottom-contact-button" class="btn-outline">Contact Sales</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
      overflow: hidden;
      position: relative;
    }

    /* === Blobs === */
    .blob {
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.45;
      pointer-events: none;
      z-index: 0;
    }
    .blob-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(201,169,110,0.35), transparent 70%);
      top: -200px; right: -100px;
      animation: float-blob 12s ease-in-out infinite;
    }
    .blob-2 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(100,116,139,0.18), transparent 70%);
      bottom: 100px; left: -150px;
      animation: float-blob 15s ease-in-out infinite reverse;
    }
    .blob-3 {
      width: 350px; height: 350px;
      background: radial-gradient(circle, rgba(201,169,110,0.2), transparent 70%);
      top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      animation: float-blob 18s ease-in-out infinite 3s;
    }

    @keyframes float-blob {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -20px) scale(1.05); }
      66% { transform: translate(-20px, 15px) scale(0.97); }
    }

    /* === Hero === */
    .hero {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 80px;
      max-width: 1280px;
      margin: 0 auto;
      padding: 120px 40px 80px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(201, 169, 110, 0.1);
      border: 1px solid rgba(201, 169, 110, 0.3);
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      color: #92713d;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 28px;
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .hero-badge.animate-in { opacity: 1; transform: translateY(0); }

    .badge-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #C9A96E;
      animation: pulse-dot 2s ease-in-out infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.8); }
    }

    .hero-title {
      display: flex;
      flex-direction: column;
      font-size: clamp(42px, 5vw, 68px);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -2px;
      color: var(--color-text);
      margin: 0 0 24px;
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
    }
    .hero-title.animate-in { opacity: 1; transform: translateY(0); }

    .title-line { display: block; }
    .title-accent {
      background: linear-gradient(135deg, #C9A96E 0%, #A07840 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-desc {
      font-size: 17px;
      line-height: 1.7;
      color: var(--color-text-muted);
      margin: 0 0 36px;
      max-width: 480px;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
    }
    .hero-desc.animate-in { opacity: 1; transform: translateY(0); }

    .hero-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 40px;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s;
    }
    .hero-actions.animate-in { opacity: 1; transform: translateY(0); }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      background: var(--color-text);
      color: var(--color-surface);
      border: none;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      letter-spacing: 0.01em;
      transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
      position: relative;
      overflow: hidden;
    }
    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(201,169,110,0) 0%, rgba(201,169,110,0.15) 100%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(28, 25, 23, 0.2);
      background: #2d2926;
    }
    .btn-primary:hover::before { opacity: 1; }
    .btn-primary:active { transform: translateY(0); }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 24px;
      background: rgba(201, 169, 110, 0.08);
      color: var(--color-text);
      border: 1px solid rgba(201, 169, 110, 0.25);
      border-radius: 14px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.25s ease;
    }
    .btn-secondary:hover {
      background: rgba(201, 169, 110, 0.15);
      border-color: rgba(201, 169, 110, 0.5);
      transform: translateY(-1px);
    }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 24px;
      background: transparent;
      color: var(--color-surface);
      border: 1px solid rgba(249,247,244,0.3);
      border-radius: 14px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.25s ease;
    }
    .btn-outline:hover {
      background: rgba(249,247,244,0.1);
      border-color: rgba(249,247,244,0.5);
    }

    .trust-row {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s;
    }
    .trust-row.animate-in { opacity: 1; transform: translateY(0); }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-muted);
    }

    .trust-sep { color: var(--color-text-muted); opacity: 0.4; }

    /* === Hero Visual === */
    .hero-visual {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: translateX(32px);
      transition: opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
    }
    .hero-visual.animate-in { opacity: 1; transform: translateX(0); }

    .card-mockup {
      width: 340px;
      height: 210px;
      border-radius: 20px;
      background: linear-gradient(135deg, #2d2926 0%, #1a1714 50%, #3a3229 100%);
      box-shadow:
        0 40px 80px rgba(28,25,23,0.3),
        0 12px 32px rgba(28,25,23,0.15),
        inset 0 1px 0 rgba(255,255,255,0.08);
      padding: 28px;
      position: relative;
      overflow: hidden;
      animation: card-float 6s ease-in-out infinite;
    }

    @keyframes card-float {
      0%, 100% { transform: translateY(0) rotate(-2deg); }
      50% { transform: translateY(-12px) rotate(-1deg); }
    }

    .card-mockup::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 200px; height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201,169,110,0.2), transparent 70%);
    }

    .card-face { height: 100%; display: flex; flex-direction: column; justify-content: space-between; position: relative; }

    .card-chip {
      width: 38px; height: 28px;
      border-radius: 5px;
      background: linear-gradient(135deg, #C9A96E, #A07840);
      box-shadow: inset 0 1px 2px rgba(255,255,255,0.3);
    }

    .card-number {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255,255,255,0.7);
      letter-spacing: 3px;
      font-family: monospace;
    }

    .card-bottom { display: flex; align-items: flex-end; gap: 24px; }

    .card-label { font-size: 9px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .card-value { font-size: 12px; color: rgba(255,255,255,0.85); font-weight: 500; }

    .card-logo { margin-left: auto; }
    .card-logo-inner {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #C9A96E, #7a5c30);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 800;
      color: white;
      box-shadow: 0 4px 12px rgba(201,169,110,0.4);
    }

    /* Floating stat chips */
    .stat-chip {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: rgba(249, 247, 244, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(201, 169, 110, 0.2);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(28, 25, 23, 0.1);
      white-space: nowrap;
    }

    .stat-chip-1 { top: -20px; left: -60px; animation: float-chip 7s ease-in-out infinite; }
    .stat-chip-2 { bottom: 40px; left: -80px; animation: float-chip 9s ease-in-out infinite 2s; }
    .stat-chip-3 { top: 60px; right: -70px; animation: float-chip 8s ease-in-out infinite 1s; }

    @keyframes float-chip {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .stat-icon { font-size: 18px; }
    .stat-value { font-size: 13px; font-weight: 700; color: var(--color-text); line-height: 1.2; }
    .stat-label { font-size: 10px; color: var(--color-text-muted); }

    /* === Features === */
    .features-section {
      position: relative;
      z-index: 1;
      padding: 80px 40px;
      background: rgba(28, 25, 23, 0.03);
    }

    .features-inner { max-width: 1280px; margin: 0 auto; }

    .section-header { text-align: center; margin-bottom: 64px; }

    .section-tag {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(201, 169, 110, 0.1);
      border: 1px solid rgba(201, 169, 110, 0.25);
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      color: #92713d;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .section-title {
      font-size: clamp(28px, 3.5vw, 44px);
      font-weight: 800;
      letter-spacing: -1px;
      color: var(--color-text);
      margin: 0 0 16px;
    }

    .section-desc {
      font-size: 16px;
      color: var(--color-text-muted);
      max-width: 520px;
      margin: 0 auto;
      line-height: 1.7;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .feature-card {
      padding: 32px;
      background: white;
      border: 1px solid rgba(28, 25, 23, 0.06);
      border-radius: 20px;
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      cursor: default;
    }
    .feature-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 60px rgba(28, 25, 23, 0.08);
      border-color: rgba(201, 169, 110, 0.2);
    }

    .feature-icon-wrap {
      width: 52px; height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(201,169,110,0.12), rgba(201,169,110,0.06));
      border: 1px solid rgba(201,169,110,0.2);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
      font-size: 22px;
    }

    .feature-title {
      font-size: 17px; font-weight: 700;
      color: var(--color-text);
      margin: 0 0 10px;
    }

    .feature-desc {
      font-size: 14px;
      color: var(--color-text-muted);
      line-height: 1.65;
      margin: 0;
    }

    /* === Stats === */
    .stats-section {
      position: relative; z-index: 1;
      padding: 80px 40px;
    }

    .stats-inner {
      max-width: 1280px; margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;
      background: rgba(28,25,23,0.08);
      border: 1px solid rgba(28,25,23,0.08);
      border-radius: 20px;
      overflow: hidden;
    }

    .stat-block {
      background: white;
      padding: 40px 32px;
      text-align: center;
      transition: background 0.2s;
    }
    .stat-block:hover { background: rgba(201,169,110,0.04); }

    .stat-num {
      font-size: clamp(32px, 3vw, 48px);
      font-weight: 800;
      letter-spacing: -1.5px;
      color: var(--color-text);
      margin-bottom: 8px;
    }

    .stat-lbl {
      font-size: 13px;
      color: var(--color-text-muted);
      font-weight: 500;
    }

    /* === CTA Section === */
    .cta-section {
      position: relative; z-index: 1;
      padding: 80px 40px;
      background: var(--color-text);
    }

    .cta-inner {
      max-width: 700px;
      margin: 0 auto;
      text-align: center;
    }

    .cta-title {
      font-size: clamp(28px, 3.5vw, 48px);
      font-weight: 800;
      letter-spacing: -1.5px;
      color: var(--color-surface);
      margin: 0 0 16px;
      line-height: 1.1;
    }

    .cta-sub {
      font-size: 16px;
      color: rgba(249,247,244,0.6);
      line-height: 1.7;
      margin: 0 0 40px;
    }

    .cta-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-actions .btn-primary {
      background: var(--color-accent);
      color: var(--color-text);
    }
    .cta-actions .btn-primary:hover {
      background: #d4b07a;
      box-shadow: 0 12px 40px rgba(201,169,110,0.4);
    }

    .sr-only {
      position: absolute; width: 1px; height: 1px;
      padding: 0; margin: -1px; overflow: hidden;
      clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;
    }

    /* ===========================
       RESPONSIVE — TABLET (≤1024px)
       =========================== */
    @media (max-width: 1024px) {
      .hero {
        grid-template-columns: 1fr;
        text-align: center;
        padding: 100px 40px 60px;
        gap: 40px;
        min-height: auto;
      }
      .hero-visual { display: none; }
      .hero-badge { margin: 0 auto 20px; }
      .hero-title { font-size: clamp(36px, 6vw, 56px); }
      .hero-desc { margin: 0 auto 32px; }
      .hero-actions { justify-content: center; }
      .trust-row { justify-content: center; }

      .features-section { padding: 60px 32px; }
      .features-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }

      .stats-section { padding: 60px 32px; }
      .stats-inner { grid-template-columns: repeat(2, 1fr); }

      .cta-section { padding: 60px 32px; }
    }

    /* ===========================
       RESPONSIVE — MOBILE (≤640px)
       =========================== */
    @media (max-width: 640px) {
      .hero {
        padding: 90px 20px 48px;
        gap: 32px;
      }
      .hero-title { font-size: clamp(32px, 9vw, 48px); letter-spacing: -1px; }
      .hero-desc { font-size: 15px; }
      .hero-actions {
        flex-direction: column;
        align-items: center;
        gap: 12px;
        width: 100%;
      }
      .btn-primary,
      .btn-secondary {
        width: 100%;
        justify-content: center;
      }
      .trust-row { gap: 10px; flex-wrap: wrap; justify-content: center; }
      .trust-sep { display: none; }

      .features-section { padding: 48px 20px; }
      .section-title { font-size: clamp(24px, 6vw, 34px); }
      .features-grid { grid-template-columns: 1fr; gap: 16px; }
      .feature-card { padding: 24px; }

      .stats-section { padding: 48px 20px; }
      .stats-inner { grid-template-columns: 1fr 1fr; border-radius: 16px; }
      .stat-block { padding: 28px 16px; }
      .stat-num { font-size: clamp(26px, 7vw, 38px); }

      .cta-section { padding: 48px 20px; }
      .cta-title { font-size: clamp(24px, 6vw, 36px); }
      .cta-actions {
        flex-direction: column;
        align-items: center;
      }
      .cta-actions .btn-primary,
      .cta-actions .btn-outline {
        width: 100%;
        max-width: 320px;
        justify-content: center;
      }
    }

    /* ===========================
       RESPONSIVE — SMALL MOBILE (≤390px)
       =========================== */
    @media (max-width: 390px) {
      .hero { padding: 80px 16px 40px; }
      .stats-inner { grid-template-columns: 1fr; }
      .stat-block { padding: 24px 16px; }
    }
  `]
})
export class HomeComponent implements OnInit {
  isVisible = signal(false);

  features = [
    { id: 1, icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>', title: 'Instant Payments', description: 'Process transactions in under 300ms with our globally distributed payment network and intelligent routing engine.' },
    { id: 2, icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>', title: 'Bank-Grade Security', description: 'PCI DSS Level 1 compliant with end-to-end encryption, real-time fraud detection, and 3D Secure 2.0.' },
    { id: 3, icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>', title: 'Smart Analytics', description: 'Real-time dashboards, conversion funnels, and AI-powered insights to help you make faster business decisions.' },
    { id: 4, icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>', title: 'Global Reach', description: 'Accept payments in 150+ currencies across 47 countries with seamless multi-currency settlement.' },
    { id: 5, icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>', title: 'Easy Integration', description: 'REST APIs, SDKs for every major platform, and no-code options. Go live in days, not months.' },
    { id: 6, icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>', title: 'Omnichannel', description: 'Online, in-store, mobile, and QR — unified payment acceptance across every touchpoint your customers use.' },
  ];

  stats = [
    { value: '$2.4B+', label: 'Annual Transaction Volume' },
    { value: '50K+', label: 'Active Merchants' },
    { value: '99.99%', label: 'Platform Uptime' },
    { value: '47+', label: 'Countries Supported' },
  ];

  constructor(private analytics: AnalyticsService) { }

  ngOnInit(): void {
    // Trigger entrance animations after a tick
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.isVisible.set(true);
      });
    });
  }

  onCtaClick(): void {
    this.analytics.track('cta_click', {
      page: 'home',
      element: 'hero_cta',
      label: 'Get Started',
    });
  }
}

