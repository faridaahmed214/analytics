import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

export type ToastType = "success" | "error" | "info";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="toast-wrapper"
      [class]="'toast toast-' + type"
      [class.toast-exit]="isExiting()"
      role="alert"
      aria-live="polite"
    >
      <div class="toast-icon">
        @if (type === "success") {
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15"/>
            <path d="M6 10L8.5 12.5L14 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        }
        @if (type === "error") {
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15"/>
            <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        }
        @if (type === "info") {
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15"/>
            <path d="M10 9V14M10 7V7.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        }
      </div>
      <div class="toast-content">
        <p class="toast-title">{{ title }}</p>
        @if (message) {
          <p class="toast-message">{{ message }}</p>
        }
      </div>
      <button class="toast-close" (click)="onClose()" aria-label="Dismiss notification">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .toast-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 18px;
      border-radius: 14px;
      border: 1px solid;
      min-width: 300px;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(28,25,23,0.12), 0 4px 16px rgba(28,25,23,0.08);
      animation: toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .toast-exit {
      animation: toast-out 0.2s ease forwards;
    }

    @keyframes toast-in {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes toast-out {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to { opacity: 0; transform: translateY(10px) scale(0.97); }
    }

    .toast-success {
      background: rgba(240,253,244,0.98);
      border-color: rgba(34,197,94,0.25);
      color: #15803d;
    }

    .toast-error {
      background: rgba(254,242,242,0.98);
      border-color: rgba(239,68,68,0.25);
      color: #dc2626;
    }

    .toast-info {
      background: rgba(249,247,244,0.98);
      border-color: rgba(201,169,110,0.3);
      color: #92713d;
    }

    .toast-icon { flex-shrink: 0; margin-top: 1px; }

    .toast-content { flex: 1; min-width: 0; }

    .toast-title {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 2px;
      color: inherit;
      line-height: 1.4;
    }

    .toast-message {
      font-size: 13px;
      margin: 0;
      opacity: 0.75;
      line-height: 1.5;
      color: #374151;
    }

    .toast-close {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px;
      opacity: 0.5;
      color: inherit;
      border-radius: 4px;
      transition: opacity 0.2s, background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toast-close:hover { opacity: 1; background: rgba(0,0,0,0.06); }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() type: ToastType = "info";
  @Input() title = "";
  @Input() message = "";
  @Input() duration = 4500;
  @Output() closed = new EventEmitter<void>();

  isExiting = signal(false);
  private timer?: ReturnType<typeof setTimeout>;
  private exitTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    if (this.duration > 0) {
      this.timer = setTimeout(() => this.startExit(), this.duration);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
    if (this.exitTimer) clearTimeout(this.exitTimer);
  }

  onClose(): void {
    this.startExit();
  }

  private startExit(): void {
    this.isExiting.set(true);
    this.exitTimer = setTimeout(() => this.closed.emit(), 220);
  }
}
