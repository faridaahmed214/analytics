import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import {
  DashboardService,
  OverviewData,
  DailyUser,
  EventData,
  DeviceData,
  PageData,
  CountryData,
} from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="dash-page">
      <!-- Header -->
      <div class="dash-header">
        <div class="dash-header-inner">
          <div class="dash-title-row">
            <div>
              <span class="section-tag">Analytics Dashboard</span>
              <h1 id="dashboard-heading" class="dash-title">Site Performance</h1>
              <p class="dash-subtitle">Last 30 days — powered by Google Analytics</p>
            </div>
            <div class="dash-badge">
              <span class="live-dot"></span>
              Live Data
            </div>
          </div>
        </div>
      </div>

      <div class="dash-body">
        <!-- Error state -->
        @if (error()) {
          <div class="error-banner" role="alert">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.5"/>
              <path d="M9 5V9.5M9 12.5V12.51" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>{{ error() }}</span>
          </div>
        }

        <!-- KPI Cards -->
        <div class="kpi-grid">
          @if (loading()) {
            @for (s of [1,2,3,4,5]; track s) {
              <div class="kpi-card skeleton-card">
                <div class="skeleton sk-label"></div>
                <div class="skeleton sk-value"></div>
                <div class="skeleton sk-sub"></div>
              </div>
            }
          } @else {
            <div class="kpi-card" id="kpi-users">
              <div class="kpi-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div class="kpi-value">{{ overview()?.activeUsers | number }}</div>
              <div class="kpi-label">Active Users</div>
            </div>
            <div class="kpi-card" id="kpi-sessions">
              <div class="kpi-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
              </div>
              <div class="kpi-value">{{ overview()?.sessions | number }}</div>
              <div class="kpi-label">Sessions</div>
            </div>
            <div class="kpi-card" id="kpi-pageviews">
              <div class="kpi-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div class="kpi-value">{{ overview()?.pageViews | number }}</div>
              <div class="kpi-label">Page Views</div>
            </div>
            <div class="kpi-card" id="kpi-bounce">
              <div class="kpi-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
              </div>
              <div class="kpi-value">{{ overview()?.bounceRate }}%</div>
              <div class="kpi-label">Bounce Rate</div>
            </div>
            <div class="kpi-card" id="kpi-duration">
              <div class="kpi-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div class="kpi-value">{{ formatDuration(overview()?.avgSessionDuration) }}</div>
              <div class="kpi-label">Avg. Session</div>
            </div>
          }
        </div>

        <div class="dash-grid">
          <!-- Daily Users Chart -->
          <div class="dash-card span-2" id="daily-users-chart">
            <div class="card-header">
              <h2 class="card-title">Daily Active Users</h2>
              <span class="card-tag">14 days</span>
            </div>
            @if (loading()) {
              <div class="skeleton sk-chart"></div>
            } @else {
              <div class="bar-chart" role="img" aria-label="Daily active users bar chart">
                @if (dailyUsers().length === 0) {
                  <div class="no-data">No data yet</div>
                } @else {
                  @for (day of dailyUsers(); track day.date) {
                    <div class="bar-wrap">
                      <div
                        class="bar"
                        [style.height.%]="getBarHeight(day.users)"
                        [attr.title]="formatDate(day.date) + ': ' + day.users + ' users'"
                        role="presentation"
                      ></div>
                      <span class="bar-label">{{ formatDate(day.date) }}</span>
                    </div>
                  }
                }
              </div>
            }
          </div>

          <!-- Top Events -->
          <div class="dash-card" id="top-events-card">
            <div class="card-header">
              <h2 class="card-title">Top Events</h2>
              <span class="card-tag">30 days</span>
            </div>
            @if (loading()) {
              <div class="skeleton sk-list"></div>
            } @else if (events().length === 0) {
              <div class="no-data">No events tracked yet</div>
            } @else {
              <div class="event-list">
                @for (ev of events().slice(0, 8); track ev.name) {
                  <div class="event-row">
                    <div class="event-name">{{ formatEventName(ev.name) }}</div>
                    <div class="event-bar-wrap">
                      <div
                        class="event-bar"
                        [style.width.%]="getEventBarWidth(ev.count)"
                      ></div>
                    </div>
                    <div class="event-count">{{ ev.count | number }}</div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Devices -->
          <div class="dash-card" id="devices-card">
            <div class="card-header">
              <h2 class="card-title">Devices</h2>
              <span class="card-tag">Sessions</span>
            </div>
            @if (loading()) {
              <div class="skeleton sk-list"></div>
            } @else {
              <div class="device-list">
                @for (d of devices(); track d.device) {
                  <div class="device-row">
                    <div class="device-icon" [innerHTML]="deviceIcon(d.device)"></div>
                    <div class="device-info">
                      <div class="device-name">{{ d.device | titlecase }}</div>
                      <div class="device-bar-wrap">
                        <div
                          class="device-bar"
                          [style.width.%]="getDeviceBarWidth(d.sessions)"
                        ></div>
                      </div>
                    </div>
                    <div class="device-count">{{ d.sessions | number }}</div>
                  </div>
                }
                @if (devices().length === 0) {
                  <div class="no-data">No data yet</div>
                }
              </div>
            }
          </div>

          <!-- Top Pages -->
          <div class="dash-card" id="top-pages-card">
            <div class="card-header">
              <h2 class="card-title">Top Pages</h2>
              <span class="card-tag">Views</span>
            </div>
            @if (loading()) {
              <div class="skeleton sk-list"></div>
            } @else {
              <div class="pages-table">
                <div class="pages-head">
                  <span>Page</span>
                  <span>Views</span>
                  <span>Users</span>
                </div>
                @for (p of pages(); track p.path) {
                  <div class="pages-row">
                    <span class="page-path">{{ p.path }}</span>
                    <span class="page-views">{{ p.views | number }}</span>
                    <span class="page-users">{{ p.users | number }}</span>
                  </div>
                }
                @if (pages().length === 0) {
                  <div class="no-data">No data yet</div>
                }
              </div>
            }
          </div>

          <!-- Countries -->
          <div class="dash-card" id="countries-card">
            <div class="card-header">
              <h2 class="card-title">Top Countries</h2>
              <span class="card-tag">Users</span>
            </div>
            @if (loading()) {
              <div class="skeleton sk-list"></div>
            } @else {
              <div class="country-list">
                @for (c of countries(); track c.country) {
                  <div class="country-row">
                    <div class="country-name">{{ c.country }}</div>
                    <div class="country-bar-wrap">
                      <div
                        class="country-bar"
                        [style.width.%]="getCountryBarWidth(c.users)"
                      ></div>
                    </div>
                    <div class="country-count">{{ c.users | number }}</div>
                  </div>
                }
                @if (countries().length === 0) {
                  <div class="no-data">No data yet</div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dash-page {
      min-height: 100vh;
      padding-top: 72px;
      background: var(--color-surface);
    }

    /* Header */
    .dash-header {
      background: linear-gradient(160deg, #1C1917 0%, #2d2520 100%);
      padding: 48px 40px 56px;
      position: relative;
      overflow: hidden;
    }
    .dash-header::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 350px; height: 350px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201,169,110,0.15), transparent 70%);
      pointer-events: none;
    }
    .dash-header-inner {
      max-width: 1280px;
      margin: 0 auto;
      position: relative; z-index: 1;
    }
    .dash-title-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .section-tag {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(201,169,110,0.15);
      border: 1px solid rgba(201,169,110,0.3);
      border-radius: 100px;
      font-size: 11px; font-weight: 700;
      color: #C9A96E;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .dash-title {
      font-size: clamp(28px, 3.5vw, 44px);
      font-weight: 800;
      letter-spacing: -1.5px;
      color: #F9F7F4;
      margin: 0 0 8px;
    }
    .dash-subtitle {
      font-size: 14px;
      color: rgba(249,247,244,0.45);
    }
    .dash-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      color: #F9F7F4;
      flex-shrink: 0;
    }
    .live-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #22c55e;
      animation: pulse-live 2s ease-in-out infinite;
    }
    @keyframes pulse-live {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }

    /* Body */
    .dash-body {
      max-width: 1280px;
      margin: 0 auto;
      padding: 40px 40px 80px;
    }

    /* Error */
    .error-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      color: #dc2626;
      font-size: 14px;
      margin-bottom: 24px;
    }

    /* KPI Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
      margin-bottom: 28px;
    }
    .kpi-card {
      background: white;
      border: 1px solid rgba(28,25,23,0.07);
      border-radius: 20px;
      padding: 24px;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .kpi-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(28,25,23,0.08);
    }
    .kpi-icon { font-size: 24px; margin-bottom: 12px; }
    .kpi-value {
      font-size: clamp(22px, 2.5vw, 32px);
      font-weight: 800;
      letter-spacing: -1px;
      color: var(--color-text);
      margin-bottom: 4px;
    }
    .kpi-label {
      font-size: 12px;
      color: var(--color-text-muted);
      font-weight: 500;
    }

    /* Dashboard grid */
    .dash-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .dash-card {
      background: white;
      border: 1px solid rgba(28,25,23,0.07);
      border-radius: 20px;
      padding: 28px;
    }
    .span-2 { grid-column: span 2; }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-text);
      margin: 0;
      letter-spacing: -0.3px;
    }
    .card-tag {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-muted);
      background: rgba(28,25,23,0.05);
      padding: 3px 10px;
      border-radius: 100px;
    }

    /* Bar chart */
    .bar-chart {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      height: 160px;
      padding-bottom: 28px;
      position: relative;
    }
    .bar-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
      gap: 6px;
    }
    .bar {
      width: 100%;
      background: linear-gradient(180deg, #C9A96E 0%, #A07840 100%);
      border-radius: 6px 6px 0 0;
      min-height: 4px;
      transition: opacity 0.2s;
      cursor: default;
    }
    .bar:hover { opacity: 0.75; }
    .bar-label {
      font-size: 9px;
      color: var(--color-text-muted);
      white-space: nowrap;
    }

    /* Event list */
    .event-list { display: flex; flex-direction: column; gap: 12px; }
    .event-row {
      display: grid;
      grid-template-columns: 140px 1fr 60px;
      align-items: center;
      gap: 12px;
    }
    .event-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .event-bar-wrap {
      height: 6px;
      background: rgba(28,25,23,0.06);
      border-radius: 100px;
      overflow: hidden;
    }
    .event-bar {
      height: 100%;
      background: linear-gradient(90deg, #C9A96E, #A07840);
      border-radius: 100px;
      transition: width 0.6s ease;
    }
    .event-count {
      font-size: 13px;
      font-weight: 700;
      color: var(--color-text);
      text-align: right;
    }

    /* Device list */
    .device-list { display: flex; flex-direction: column; gap: 16px; }
    .device-row {
      display: grid;
      grid-template-columns: 36px 1fr 60px;
      align-items: center;
      gap: 12px;
    }
    .device-icon { font-size: 22px; }
    .device-info { display: flex; flex-direction: column; gap: 6px; }
    .device-name { font-size: 13px; font-weight: 600; color: var(--color-text); }
    .device-bar-wrap {
      height: 6px;
      background: rgba(28,25,23,0.06);
      border-radius: 100px;
      overflow: hidden;
    }
    .device-bar {
      height: 100%;
      background: linear-gradient(90deg, #C9A96E, #A07840);
      border-radius: 100px;
      transition: width 0.6s ease;
    }
    .device-count {
      font-size: 13px;
      font-weight: 700;
      color: var(--color-text);
      text-align: right;
    }

    /* Pages table */
    .pages-table { display: flex; flex-direction: column; gap: 0; }
    .pages-head {
      display: grid;
      grid-template-columns: 1fr 64px 64px;
      gap: 8px;
      padding: 0 0 10px;
      border-bottom: 1px solid rgba(28,25,23,0.07);
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .pages-row {
      display: grid;
      grid-template-columns: 1fr 64px 64px;
      gap: 8px;
      padding: 10px 0;
      border-bottom: 1px solid rgba(28,25,23,0.04);
      align-items: center;
    }
    .pages-row:last-child { border-bottom: none; }
    .page-path {
      font-size: 13px;
      color: var(--color-text);
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .page-views, .page-users {
      font-size: 13px;
      font-weight: 700;
      color: var(--color-text);
      text-align: right;
    }

    /* Country list */
    .country-list { display: flex; flex-direction: column; gap: 12px; }
    .country-row {
      display: grid;
      grid-template-columns: 120px 1fr 52px;
      align-items: center;
      gap: 12px;
    }
    .country-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .country-bar-wrap {
      height: 6px;
      background: rgba(28,25,23,0.06);
      border-radius: 100px;
      overflow: hidden;
    }
    .country-bar {
      height: 100%;
      background: linear-gradient(90deg, #C9A96E, #A07840);
      border-radius: 100px;
      transition: width 0.6s ease;
    }
    .country-count {
      font-size: 13px;
      font-weight: 700;
      color: var(--color-text);
      text-align: right;
    }

    /* No data */
    .no-data {
      text-align: center;
      padding: 32px;
      font-size: 14px;
      color: var(--color-text-muted);
    }

    /* Skeletons */
    .skeleton {
      background: linear-gradient(90deg, #f0ece8 25%, #e8e3de 50%, #f0ece8 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
      border-radius: 8px;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .skeleton-card { pointer-events: none; }
    .sk-label { height: 14px; width: 60%; margin-bottom: 12px; }
    .sk-value { height: 32px; width: 80%; margin-bottom: 8px; }
    .sk-sub { height: 12px; width: 40%; }
    .sk-chart { height: 160px; border-radius: 12px; }
    .sk-list { height: 200px; border-radius: 12px; }

    /* Responsive */
    @media (max-width: 1100px) {
      .kpi-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 1024px) {
      .dash-header { padding: 40px 32px 48px; }
      .dash-body { padding: 32px 32px 60px; }
      .dash-grid { grid-template-columns: 1fr; }
      .span-2 { grid-column: span 1; }
      .event-row { grid-template-columns: 120px 1fr 52px; }
      .country-row { grid-template-columns: 100px 1fr 52px; }
    }
    @media (max-width: 640px) {
      .dash-header { padding: 32px 20px 40px; }
      .dash-body { padding: 20px 20px 48px; }
      .dash-title-row { flex-direction: column; }
      .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .kpi-card { padding: 18px; }
      .kpi-value { font-size: 22px; }
      .dash-card { padding: 20px; }
      .bar-chart { height: 120px; gap: 4px; }
      .event-row { grid-template-columns: 100px 1fr 44px; }
      .country-row { grid-template-columns: 90px 1fr 44px; }
    }
    @media (max-width: 390px) {
      .kpi-grid { grid-template-columns: 1fr 1fr; }
      .dash-header { padding: 28px 16px 36px; }
      .dash-body { padding: 16px 16px 40px; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  error = signal('');
  overview = signal<OverviewData | null>(null);
  dailyUsers = signal<DailyUser[]>([]);
  events = signal<EventData[]>([]);
  devices = signal<DeviceData[]>([]);
  pages = signal<PageData[]>([]);
  countries = signal<CountryData[]>([]);

  private maxDailyUsers = 0;
  private maxEventCount = 0;
  private maxDeviceSessions = 0;
  private maxCountryUsers = 0;

  constructor(private dashService: DashboardService) {}

  ngOnInit(): void {
    forkJoin({
      overview: this.dashService.getOverview(),
      dailyUsers: this.dashService.getDailyUsers(),
      events: this.dashService.getEvents(),
      devices: this.dashService.getDevices(),
      pages: this.dashService.getPages(),
      countries: this.dashService.getCountries(),
    }).subscribe({
      next: (data) => {
        this.overview.set(data.overview);
        this.dailyUsers.set(data.dailyUsers);
        this.events.set(data.events);
        this.devices.set(data.devices);
        this.pages.set(data.pages);
        this.countries.set(data.countries);

        this.maxDailyUsers = Math.max(...data.dailyUsers.map(d => d.users), 1);
        this.maxEventCount = Math.max(...data.events.map(e => e.count), 1);
        this.maxDeviceSessions = Math.max(...data.devices.map(d => d.sessions), 1);
        this.maxCountryUsers = Math.max(...data.countries.map(c => c.users), 1);

        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          'Could not connect to analytics server. Make sure analytics-server.js is running on port 3000.'
        );
        console.error('Dashboard error:', err);
      },
    });
  }

  getBarHeight(users: number): number {
    return Math.max((users / this.maxDailyUsers) * 100, 3);
  }
  getEventBarWidth(count: number): number {
    return (count / this.maxEventCount) * 100;
  }
  getDeviceBarWidth(sessions: number): number {
    return (sessions / this.maxDeviceSessions) * 100;
  }
  getCountryBarWidth(users: number): number {
    return (users / this.maxCountryUsers) * 100;
  }

  formatDate(d: string): string {
    if (!d || d.length !== 8) return d;
    return `${d.slice(6)}/${d.slice(4, 6)}`;
  }

  formatDuration(seconds?: string): string {
    if (!seconds) return '0s';
    const s = parseInt(seconds);
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  }

  formatEventName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  deviceIcon(device: string): string {
    const d = device?.toLowerCase();
    if (d === 'mobile') return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>';
    if (d === 'desktop') return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>';
    if (d === 'tablet') return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>';
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>';
  }
}
