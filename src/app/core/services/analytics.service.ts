import { Injectable } from '@angular/core';

export interface AnalyticsEvent {
  event: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly eventLog: AnalyticsEvent[] = [];

  track(event: string, payload: Record<string, unknown> = {}): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      payload,
      timestamp: new Date().toISOString(),
    };

    this.eventLog.push(analyticsEvent);
    this.logToConsole(analyticsEvent);
    this.sendToGtag(analyticsEvent);
  }

  getEventLog(): AnalyticsEvent[] {
    return [...this.eventLog];
  }

  private logToConsole(event: AnalyticsEvent): void {
    const styles = {
      badge: 'background:#C9A96E;color:#1C1917;padding:2px 8px;border-radius:4px;font-weight:700;font-size:11px;',
      event: 'color:#C9A96E;font-weight:600;font-size:13px;',
      muted: 'color:#64748b;font-size:11px;',
    };

    console.groupCollapsed(
      `%c ANALYTICS %c ${event.event} %c ${event.timestamp}`,
      styles.badge,
      styles.event,
      styles.muted
    );
    console.log('%cPayload:', 'color:#94a3b8;font-weight:600;', event.payload);
    console.log('%cFull Event:', 'color:#94a3b8;font-weight:600;', event);
    console.groupEnd();
  }

  private sendToGtag(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', event.event, event.payload);
    }
  }
}

