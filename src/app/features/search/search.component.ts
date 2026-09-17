import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AnalyticsService } from '../../core/services/analytics.service';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  badge: string;
  emoji: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="search-page">
      <!-- Hero Header -->
      <div class="search-header">
        <div class="search-header-inner">
          <span class="section-tag">Product Catalog</span>
          <h1 id="search-heading">Find Your Solution</h1>
          <p class="search-subtitle">Explore our suite of payment and commerce tools built for modern businesses.</p>

          <!-- Search Input -->
          <div class="search-input-wrap" role="search" aria-label="Product search">
            <div class="search-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.6"/>
                <path d="M13 13L17 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </div>
            <input
              id="product-search-input"
              type="search"
              class="search-input"
              placeholder="Search products, categories..."
              [formControl]="searchControl"
              autocomplete="off"
              aria-label="Search products"
              aria-describedby="search-results-count"
            />
            @if (searchControl.value) {
              <button class="search-clear" (click)="clearSearch()" aria-label="Clear search">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="rgba(28,25,23,0.08)"/>
                  <path d="M5 5L11 11M11 5L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Results Area -->
      <div class="search-body">
        <div class="search-body-inner">

          <!-- Results Count -->
          <div class="results-meta" id="search-results-count" role="status" aria-live="polite">
            @if (isLoading()) {
              <div class="results-label loading-pulse">Searching...</div>
            } @else if (currentQuery()) {
              <div class="results-label">
                <span class="results-count">{{ filteredProducts().length }}</span>
                result{{ filteredProducts().length !== 1 ? 's' : '' }} for
                <span class="results-query">"{{ currentQuery() }}"</span>
              </div>
            } @else {
              <div class="results-label">
                Showing all <span class="results-count">{{ allProducts.length }}</span> products
              </div>
            }

            <!-- Category Filter Pills -->
            <div class="category-pills" role="group" aria-label="Filter by category">
              @for (cat of categories; track cat) {
                <button
                  class="pill"
                  [class.active]="activeCategory() === cat"
                  (click)="setCategory(cat)"
                  [attr.id]="'category-' + cat.toLowerCase().replace(' ', '-')"
                  [attr.aria-pressed]="activeCategory() === cat"
                >
                  {{ cat }}
                </button>
              }
            </div>
          </div>

          <!-- Skeleton Loaders -->
          @if (isLoading()) {
            <div class="products-grid" aria-busy="true" aria-label="Loading products">
              @for (s of skeletons; track s) {
                <div class="product-card skeleton-card" aria-hidden="true">
                  <div class="skeleton-emoji"></div>
                  <div class="skeleton-badge"></div>
                  <div class="skeleton-title"></div>
                  <div class="skeleton-desc"></div>
                  <div class="skeleton-desc short"></div>
                  <div class="skeleton-price"></div>
                  <div class="skeleton-btn"></div>
                </div>
              }
            </div>
          }

          <!-- Product Cards -->
          @if (!isLoading()) {
            @if (filteredProducts().length > 0) {
              <div class="products-grid" role="list" aria-label="Search results">
                @for (product of filteredProducts(); track product.id) {
                  <article
                    class="product-card"
                    role="listitem"
                    [attr.id]="'product-' + product.id"
                  >
                    <div class="product-top">
                      <div class="product-emoji" aria-hidden="true">{{ product.emoji }}</div>
                      <span class="product-badge">{{ product.badge }}</span>
                    </div>
                    <div class="product-body">
                      <span class="product-category">{{ product.category }}</span>
                      <h2 class="product-name">{{ product.name }}</h2>
                      <p class="product-desc">{{ product.description }}</p>
                    </div>
                    <div class="product-footer">
                      <div class="product-price">
                        <span class="price-currency">{{ product.currency }}</span>
                        <span class="price-amount">{{ product.price.toLocaleString() }}</span>
                        <span class="price-period">/mo</span>
                      </div>
                      <button
                        class="product-btn"
                        [attr.id]="'learn-more-' + product.id"
                        (click)="onProductClick(product)"
                        [attr.aria-label]="'Learn more about ' + product.name"
                      >
                        Learn More
                      </button>
                    </div>
                  </article>
                }
              </div>
            } @else {
              <div class="empty-state" role="status" aria-live="polite">
                <div class="empty-icon" aria-hidden="true">🔍</div>
                <h2 class="empty-title">No products found</h2>
                <p class="empty-desc">Try a different search term or browse all categories.</p>
                <button id="clear-search-button" class="btn-accent" (click)="clearSearch()">Clear Search</button>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-page {
      min-height: 100vh;
      padding-top: 72px;
      background: var(--color-surface);
    }

    /* === Header === */
    .search-header {
      background: linear-gradient(160deg, #1C1917 0%, #2d2520 100%);
      padding: 64px 40px 80px;
      position: relative;
      overflow: hidden;
    }

    .search-header::before {
      content: '';
      position: absolute;
      top: -100px; right: -100px;
      width: 400px; height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201,169,110,0.15), transparent 70%);
      pointer-events: none;
    }

    .search-header-inner {
      max-width: 720px;
      margin: 0 auto;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .section-tag {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(201, 169, 110, 0.15);
      border: 1px solid rgba(201, 169, 110, 0.3);
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      color: #C9A96E;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 20px;
    }

    h1#search-heading {
      font-size: clamp(32px, 4vw, 52px);
      font-weight: 800;
      letter-spacing: -1.5px;
      color: #F9F7F4;
      margin: 0 0 14px;
    }

    .search-subtitle {
      font-size: 16px;
      color: rgba(249,247,244,0.55);
      line-height: 1.7;
      margin: 0 0 36px;
    }

    /* Search input */
    .search-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 18px;
      color: rgba(249,247,244,0.4);
      display: flex; align-items: center;
      z-index: 1;
      transition: color 0.2s;
    }

    .search-input {
      width: 100%;
      padding: 16px 52px 16px 52px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 16px;
      font-size: 16px;
      font-weight: 400;
      color: #F9F7F4;
      outline: none;
      transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
      font-family: inherit;
    }
    .search-input::placeholder { color: rgba(249,247,244,0.3); }
    .search-input::-webkit-search-cancel-button { display: none; }
    .search-input:focus {
      border-color: rgba(201,169,110,0.5);
      background: rgba(255,255,255,0.1);
      box-shadow: 0 0 0 4px rgba(201,169,110,0.12), 0 8px 32px rgba(0,0,0,0.2);
    }
    .search-input:focus + .search-icon { color: rgba(249,247,244,0.7); }

    .search-clear {
      position: absolute;
      right: 16px;
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(249,247,244,0.5);
      display: flex; align-items: center;
      padding: 4px;
      border-radius: 6px;
      transition: color 0.2s;
    }
    .search-clear:hover { color: rgba(249,247,244,0.9); }

    /* === Body === */
    .search-body { padding: 40px 40px 80px; }
    .search-body-inner { max-width: 1280px; margin: 0 auto; }

    /* Results meta row */
    .results-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 32px;
    }

    .results-label {
      font-size: 14px;
      color: var(--color-text-muted);
    }
    .results-count {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-text);
    }
    .results-query {
      font-weight: 600;
      color: var(--color-accent);
    }

    .loading-pulse { animation: text-pulse 1.5s ease-in-out infinite; }
    @keyframes text-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    .category-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .pill {
      padding: 6px 14px;
      background: white;
      border: 1px solid rgba(28,25,23,0.1);
      border-radius: 100px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .pill:hover {
      border-color: rgba(201,169,110,0.4);
      color: var(--color-text);
      background: rgba(201,169,110,0.06);
    }
    .pill.active {
      background: var(--color-text);
      border-color: var(--color-text);
      color: var(--color-surface);
    }

    /* === Product Grid === */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .product-card {
      background: white;
      border: 1px solid rgba(28,25,23,0.06);
      border-radius: 20px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 0;
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      cursor: default;
      animation: card-appear 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes card-appear {
      from { opacity: 0; transform: translateY(20px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .product-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 64px rgba(28,25,23,0.1);
      border-color: rgba(201,169,110,0.2);
    }

    .product-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .product-emoji {
      font-size: 36px;
      line-height: 1;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));
    }

    .product-badge {
      padding: 4px 10px;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      background: rgba(201,169,110,0.1);
      color: #92713d;
      border: 1px solid rgba(201,169,110,0.2);
    }

    .product-body { flex: 1; margin-bottom: 24px; }

    .product-category {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.07em;
      display: block;
      margin-bottom: 8px;
    }

    .product-name {
      font-size: 18px;
      font-weight: 700;
      color: var(--color-text);
      margin: 0 0 10px;
      letter-spacing: -0.3px;
    }

    .product-desc {
      font-size: 13px;
      color: var(--color-text-muted);
      line-height: 1.65;
      margin: 0;
    }

    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(28,25,23,0.06);
      padding-top: 20px;
    }

    .product-price { display: flex; align-items: baseline; gap: 2px; }
    .price-currency { font-size: 12px; font-weight: 600; color: var(--color-text-muted); }
    .price-amount { font-size: 22px; font-weight: 800; color: var(--color-text); letter-spacing: -0.5px; }
    .price-period { font-size: 12px; color: var(--color-text-muted); }

    .product-btn {
      padding: 9px 18px;
      background: var(--color-text);
      color: var(--color-surface);
      border: none;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .product-btn:hover {
      background: var(--color-accent);
      color: var(--color-text);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(201,169,110,0.3);
    }

    /* === Skeletons === */
    .skeleton-card { animation: none; pointer-events: none; }

    .skeleton-emoji, .skeleton-badge, .skeleton-title, .skeleton-desc, .skeleton-price, .skeleton-btn {
      background: linear-gradient(90deg, #f0ece8 25%, #e8e3de 50%, #f0ece8 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
      border-radius: 8px;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .skeleton-emoji { width: 44px; height: 44px; border-radius: 12px; margin-bottom: 20px; }
    .skeleton-badge { width: 60px; height: 22px; border-radius: 100px; }
    .skeleton-title { height: 22px; width: 75%; margin-bottom: 10px; }
    .skeleton-desc { height: 14px; width: 100%; margin-bottom: 6px; }
    .skeleton-desc.short { width: 60%; margin-bottom: 24px; }
    .skeleton-price { width: 80px; height: 28px; }
    .skeleton-btn { width: 100px; height: 36px; border-radius: 10px; }

    /* === Empty State === */
    .empty-state {
      text-align: center;
      padding: 80px 24px;
    }
    .empty-icon { font-size: 56px; margin-bottom: 20px; display: block; opacity: 0.5; }
    .empty-title { font-size: 22px; font-weight: 700; color: var(--color-text); margin: 0 0 10px; }
    .empty-desc { font-size: 15px; color: var(--color-text-muted); margin: 0 0 32px; line-height: 1.6; }

    .btn-accent {
      padding: 12px 28px;
      background: var(--color-accent);
      color: var(--color-text);
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-accent:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(201,169,110,0.35);
    }

    /* ===========================
       RESPONSIVE — TABLET (≤1024px)
       =========================== */
    @media (max-width: 1024px) {
      .search-header { padding: 56px 32px 72px; }
      .search-body { padding: 36px 32px 72px; }
      .products-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
    }

    /* ===========================
       RESPONSIVE — MOBILE (≤640px)
       =========================== */
    @media (max-width: 640px) {
      .search-header { padding: 40px 20px 56px; }
      h1#search-heading { letter-spacing: -1px; }
      .search-subtitle { font-size: 14px; }
      .search-input { font-size: 15px; padding: 14px 46px; }

      .search-body { padding: 24px 20px 56px; }

      .results-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .category-pills {
        flex-wrap: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 4px;
        scrollbar-width: none;
        width: 100%;
      }
      .category-pills::-webkit-scrollbar { display: none; }
      .pill { flex-shrink: 0; }

      .products-grid { grid-template-columns: 1fr; gap: 16px; }
      .product-card { padding: 22px; }
      .product-emoji { font-size: 30px; }
      .product-name { font-size: 16px; }
      .price-amount { font-size: 20px; }

      .empty-state { padding: 60px 16px; }
      .empty-icon { font-size: 44px; }
    }

    /* ===========================
       RESPONSIVE — SMALL MOBILE (≤390px)
       =========================== */
    @media (max-width: 390px) {
      .search-header { padding: 32px 16px 48px; }
      .search-body { padding: 20px 16px 48px; }
      .product-card { padding: 18px; }
    }
  `]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  isLoading = signal(false);
  currentQuery = signal('');
  activeCategory = signal('All');
  skeletons = Array(6).fill(0);

  private destroy$ = new Subject<void>();

  categories = ['All', 'Payments', 'Commerce', 'Analytics', 'Security', 'APIs'];

  allProducts: Product[] = [
    { id: 1, name: 'Payment Gateway', category: 'Payments', price: 49, currency: 'SAR', description: 'Full-stack payment processing with support for 150+ payment methods and instant settlements.', badge: 'Most Popular', emoji: '💳' },
    { id: 2, name: 'POS Terminal Pro', category: 'Payments', price: 129, currency: 'SAR', description: 'Smart point-of-sale terminal with built-in receipt printer, NFC, and cloud sync.', badge: 'Hardware', emoji: '🖥️' },
    { id: 3, name: 'E-Commerce Suite', category: 'Commerce', price: 89, currency: 'SAR', description: 'Complete online store engine with cart, checkout, and our payments pre-integrated.', badge: 'Bundle', emoji: '🛒' },
    { id: 4, name: 'Insights Dashboard', category: 'Analytics', price: 39, currency: 'SAR', description: 'Real-time transaction analytics, cohort analysis, and revenue forecasting powered by AI.', badge: 'AI-Powered', emoji: '📊' },
    { id: 5, name: 'Fraud Shield', category: 'Security', price: 59, currency: 'SAR', description: 'ML-based fraud detection with 99.97% accuracy and real-time transaction blocking.', badge: 'Security', emoji: '🛡️' },
    { id: 6, name: 'Pay Links', category: 'Payments', price: 0, currency: 'SAR', description: 'Generate shareable payment links in seconds — no website required. Perfect for SMBs.', badge: 'Free', emoji: '🔗' },
    { id: 7, name: 'Subscription Engine', category: 'Commerce', price: 69, currency: 'SAR', description: 'Automated recurring billing with smart dunning, trial management, and upgrade flows.', badge: 'New', emoji: '🔄' },
    { id: 8, name: 'Checkout API', category: 'APIs', price: 29, currency: 'SAR', description: 'Embeddable, customizable checkout UI — prebuilt components for every framework.', badge: 'Developer', emoji: '⚙️' },
    { id: 9, name: 'Multi-Currency Wallet', category: 'Payments', price: 79, currency: 'SAR', description: 'Hold, convert, and send funds in 40+ currencies with real-time exchange rates.', badge: 'Global', emoji: '🌎' },
    { id: 10, name: 'Risk Intelligence', category: 'Security', price: 99, currency: 'SAR', description: 'Comprehensive risk scoring API for onboarding, transactions, and account takeover detection.', badge: 'Enterprise', emoji: '🔎' },
    { id: 11, name: 'QR Pay', category: 'Payments', price: 19, currency: 'SAR', description: 'Dynamic and static QR code payments. Works with all major wallet apps in MENA.', badge: 'MENA', emoji: '📱' },
    { id: 12, name: 'Webhook Studio', category: 'APIs', price: 15, currency: 'SAR', description: 'Reliable event delivery, retry logic, log explorer, and payload transformation tools.', badge: 'Developer', emoji: '🔔' },
    { id: 13, name: 'Loyalty Platform', category: 'Commerce', price: 59, currency: 'SAR', description: 'Points, cashback, tier programs, and branded rewards — fully white-labeled.', badge: 'Retention', emoji: '⭐' },
    { id: 14, name: 'Compliance Suite', category: 'Security', price: 119, currency: 'SAR', description: 'KYC/AML automation, SAMA reporting tools, and audit trails for regulated industries.', badge: 'Regulated', emoji: '⚖️' },
    { id: 15, name: 'Revenue Analytics API', category: 'APIs', price: 49, currency: 'SAR', description: 'Query raw transaction data, build custom reports, and power your BI tools via REST.', badge: 'Data', emoji: '📈' },
    { id: 16, name: 'Smart Invoicing', category: 'Commerce', price: 35, currency: 'SAR', description: 'Professional invoice generation with payment tracking, reminders, and AR automation.', badge: 'Automation', emoji: '🧾' },
    { id: 17, name: 'Terminal Cloud', category: 'Payments', price: 45, currency: 'SAR', description: 'Manage your entire POS fleet remotely — software updates, config, and diagnostics.', badge: 'Fleet', emoji: '☁️' },
    { id: 18, name: 'Mobile SDK', category: 'APIs', price: 0, currency: 'SAR', description: 'Native iOS and Android SDKs for in-app payments, biometric auth, and wallet integration.', badge: 'Free', emoji: '📲' },
    { id: 19, name: 'Business Intelligence', category: 'Analytics', price: 149, currency: 'SAR', description: 'Executive dashboards, benchmarking against industry peers, and predictive revenue models.', badge: 'Premium', emoji: '🏆' },
    { id: 20, name: 'Open Banking Hub', category: 'APIs', price: 89, currency: 'SAR', description: 'Connect to 200+ banks via open banking APIs for account aggregation and payment initiation.', badge: 'Banking', emoji: '🏦' },
  ];

  filteredProducts = computed(() => {
    const query = this.currentQuery().toLowerCase().trim();
    const category = this.activeCategory();
    return this.allProducts.filter(p => {
      const matchesQuery = !query || p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.badge.toLowerCase().includes(query);
      const matchesCategory = category === 'All' || p.category === category;
      return matchesQuery && matchesCategory;
    });
  });

  constructor(private analytics: AnalyticsService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query ?? '');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private performSearch(query: string): void {
    this.isLoading.set(true);
    this.currentQuery.set(query.trim());

    // Simulate async search
    setTimeout(() => {
      this.isLoading.set(false);
      if (query.trim()) {
        this.analytics.track('search', {
          query: query.trim(),
          resultCount: this.filteredProducts().length,
          category: this.activeCategory(),
        });
      }
    }, 600);
  }

  setCategory(cat: string): void {
    this.activeCategory.set(cat);
    const query = this.searchControl.value ?? '';
    if (query.trim()) {
      this.performSearch(query);
    }
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.currentQuery.set('');
    this.isLoading.set(false);
  }

  onProductClick(product: Product): void {
    this.analytics.track('product_click', {
      productId: product.id,
      productName: product.name,
      category: product.category,
    });
  }
}

