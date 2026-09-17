import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
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

