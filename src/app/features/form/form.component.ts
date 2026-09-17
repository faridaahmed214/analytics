import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from "@angular/forms";
import { AnalyticsService } from "../../core/services/analytics.service";
import { ToastComponent, ToastType } from "../../shared/toast/toast.component";

interface ToastState {
  visible: boolean;
  type: ToastType;
  title: string;
  message: string;
}

@Component({
  selector: "app-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent],
  template: `
    <div class="form-page">
      <!-- Toast -->
      @if (toast().visible) {
        <div class="toast-container">
          <app-toast
            [type]="toast().type"
            [title]="toast().title"
            [message]="toast().message"
            (closed)="dismissToast()"
          />
        </div>
      }

      <!-- Background decorations -->
      <div class="form-bg-blob blob-a" aria-hidden="true"></div>
      <div class="form-bg-blob blob-b" aria-hidden="true"></div>

      <div class="form-layout">
        <!-- Left Side Info Panel -->
        <aside class="form-info" aria-label="Contact information">
          <div class="info-inner">
            <span class="section-tag">Get In Touch</span>
            <h1 id="form-heading" class="info-title">
              Let's start a conversation
            </h1>
            <p class="info-desc">
              Ready to transform your payment infrastructure? Our team of experts is here to help you find the perfect solution.
            </p>

            <div class="contact-list" role="list">
              <div class="contact-item" role="listitem">
                <div class="contact-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1C5.134 1 2 4.134 2 8C2 12.786 9 17 9 17C9 17 16 12.786 16 8C16 4.134 12.866 1 9 1Z" stroke="#C9A96E" stroke-width="1.5"/>
                    <circle cx="9" cy="8" r="2.5" stroke="#C9A96E" stroke-width="1.5"/>
                  </svg>
                </div>
                <div>
                  <div class="contact-label">Headquarters</div>
                  <div class="contact-value">Riyadh, Saudi Arabia</div>
                </div>
              </div>
              <div class="contact-item" role="listitem">
                <div class="contact-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="4" width="14" height="10" rx="2" stroke="#C9A96E" stroke-width="1.5"/>
                    <path d="M2 7L9 11L16 7" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
                <div>
                  <div class="contact-label">Email</div>
                  <div class="contact-value">hello@example.com</div>
                </div>
              </div>
              <div class="contact-item" role="listitem">
                <div class="contact-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 4C3 3.448 3.448 3 4 3H6.5L7.5 6.5L5.5 8C6.5 10 8 11.5 10 12.5L11.5 10.5L15 11.5V14C15 14.552 14.552 15 14 15C8 15 3 10 3 4Z" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div class="contact-label">Sales Hotline</div>
                  <div class="contact-value">+966 11 000 0000</div>
                </div>
              </div>
            </div>

            <!-- Social proof -->
            <div class="social-proof">
              <div class="social-avatars" aria-hidden="true">
                <div class="avatar av1">M</div>
                <div class="avatar av2">S</div>
                <div class="avatar av3">A</div>
                <div class="avatar av4">R</div>
              </div>
              <div class="social-text">
                <div class="social-strong">50,000+ businesses</div>
                <div class="social-muted">already trust us</div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Right Side Form -->
        <main class="form-container" aria-labelledby="form-heading">
          <div class="form-card">
            <div class="form-card-header">
              <h2 class="form-card-title">Send us a message</h2>
              <p class="form-card-subtitle">We respond within 24 business hours.</p>
            </div>

            <form
              id="contact-form"
              [formGroup]="contactForm"
              (ngSubmit)="onSubmit()"
              novalidate
              aria-label="Contact form"
            >
              <!-- Name + Email Row -->
              <div class="field-row">
                <div class="field-group" [class.has-error]="isInvalid('fullName')">
                  <label for="fullName" class="field-label">
                    Full Name <span class="required" aria-label="required">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    class="field-input"
                    formControlName="fullName"
                    placeholder="Farida Ahmed"
                    autocomplete="name"
                    [attr.aria-invalid]="isInvalid('fullName')"
                    aria-describedby="fullName-error"
                  />
                  @if (isInvalid("fullName")) {
                    <span class="field-error" id="fullName-error" role="alert">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.3"/>
                        <path d="M6 4V6.5M6 8.5V8.51" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                      </svg>
                      {{ getError("fullName") }}
                    </span>
                  }
                </div>

                <div class="field-group" [class.has-error]="isInvalid('email')">
                  <label for="email" class="field-label">
                    Email Address <span class="required" aria-label="required">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    class="field-input"
                    formControlName="email"
                    placeholder="you@company.com"
                    autocomplete="email"
                    [attr.aria-invalid]="isInvalid('email')"
                    aria-describedby="email-error"
                  />
                  @if (isInvalid("email")) {
                    <span class="field-error" id="email-error" role="alert">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.3"/>
                        <path d="M6 4V6.5M6 8.5V8.51" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                      </svg>
                      {{ getError("email") }}
                    </span>
                  }
                </div>
              </div>

              <!-- Phone + Company -->
              <div class="field-row">
                <div class="field-group" [class.has-error]="isInvalid('phone')">
                  <label for="phone" class="field-label">Phone Number</label>
                  <div class="phone-wrap">
                    <span class="phone-prefix" aria-hidden="true">+966</span>
                    <input
                      id="phone"
                      type="tel"
                      class="field-input phone-input"
                      formControlName="phone"
                      placeholder="5X XXX XXXX"
                      autocomplete="tel"
                      [attr.aria-invalid]="isInvalid('phone')"
                      aria-describedby="phone-error"
                    />
                  </div>
                  @if (isInvalid("phone")) {
                    <span class="field-error" id="phone-error" role="alert">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.3"/>
                        <path d="M6 4V6.5M6 8.5V8.51" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                      </svg>
                      {{ getError("phone") }}
                    </span>
                  }
                </div>

                <div class="field-group">
                  <label for="company" class="field-label">Company</label>
                  <input
                    id="company"
                    type="text"
                    class="field-input"
                    formControlName="company"
                    placeholder="Your company name"
                    autocomplete="organization"
                  />
                </div>
              </div>

              <!-- Interest -->
              <div class="field-group" [class.has-error]="isInvalid('interest')">
                <label for="interest" class="field-label">
                  I am interested in <span class="required" aria-label="required">*</span>
                </label>
                <select
                  id="interest"
                  class="field-input field-select"
                  formControlName="interest"
                  [attr.aria-invalid]="isInvalid('interest')"
                  aria-describedby="interest-error"
                >
                  <option value="" disabled>Select a product or service...</option>
                  <option value="payment_gateway">Payment Gateway</option>
                  <option value="pos_terminal">POS Terminal</option>
                  <option value="ecommerce_suite">E-Commerce Suite</option>
                  <option value="analytics">Analytics & BI</option>
                  <option value="fraud_security">Fraud & Security</option>
                  <option value="enterprise">Enterprise Solutions</option>
                  <option value="other">Other</option>
                </select>
                @if (isInvalid("interest")) {
                  <span class="field-error" id="interest-error" role="alert">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.3"/>
                      <path d="M6 4V6.5M6 8.5V8.51" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                    </svg>
                    {{ getError("interest") }}
                  </span>
                }
              </div>

              <!-- Message -->
              <div class="field-group" [class.has-error]="isInvalid('message')">
                <label for="message" class="field-label">
                  Message <span class="required" aria-label="required">*</span>
                </label>
                <textarea
                  id="message"
                  class="field-input field-textarea"
                  formControlName="message"
                  placeholder="Tell us about your business needs, current payment challenges, and transaction volumes..."
                  rows="5"
                  [attr.aria-invalid]="isInvalid('message')"
                  aria-describedby="message-error message-counter"
                ></textarea>
                <div class="textarea-footer">
                  @if (isInvalid("message")) {
                    <span class="field-error" id="message-error" role="alert">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.3"/>
                        <path d="M6 4V6.5M6 8.5V8.51" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                      </svg>
                      {{ getError("message") }}
                    </span>
                  } @else {
                    <span></span>
                  }
                  <span
                    id="message-counter"
                    class="char-counter"
                    [class.near-limit]="messageLength > 400"
                    aria-live="polite"
                  >
                    {{ messageLength }}/500
                  </span>
                </div>
              </div>

              <!-- Terms -->
              <div class="field-group terms-group" [class.has-error]="isInvalid('terms')">
                <label class="checkbox-wrap" for="terms">
                  <input
                    id="terms"
                    type="checkbox"
                    class="checkbox-input"
                    formControlName="terms"
                    [attr.aria-invalid]="isInvalid('terms')"
                    aria-describedby="terms-error"
                  />
                  <span class="checkbox-custom" aria-hidden="true">
                    <svg class="check-icon" width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span class="checkbox-label">
                    I agree to the <a href="#" class="link-accent" tabindex="0">Terms of Service</a> and
                    <a href="#" class="link-accent" tabindex="0">Privacy Policy</a>
                  </span>
                </label>
                @if (isInvalid("terms")) {
                  <span class="field-error" id="terms-error" role="alert">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.3"/>
                      <path d="M6 4V6.5M6 8.5V8.51" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                    </svg>
                    You must accept the terms to continue
                  </span>
                }
              </div>

              <!-- Submit -->
              <button
                id="form-submit-button"
                type="submit"
                class="submit-btn"
                [class.loading]="isSubmitting()"
                [disabled]="isSubmitting()"
                aria-label="Submit contact form"
              >
                @if (isSubmitting()) {
                  <span class="spinner" aria-hidden="true"></span>
                  <span>Sending...</span>
                } @else {
                  <span>Send Message</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 8H14M10 4L14 8L10 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                }
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .form-page {
      min-height: 100vh;
      padding-top: 72px;
      background: var(--color-surface);
      position: relative;
      overflow: hidden;
    }

    .form-bg-blob {
      position: fixed;
      border-radius: 50%;
      filter: blur(100px);
      pointer-events: none;
      z-index: 0;
    }
    .blob-a {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(201,169,110,0.12), transparent 70%);
      top: -100px; right: -150px;
    }
    .blob-b {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(100,116,139,0.1), transparent 70%);
      bottom: -100px; left: -100px;
    }

    /* Toast */
    .toast-container {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 9999;
    }

    /* Layout */
    .form-layout {
      display: grid;
      grid-template-columns: 420px 1fr;
      min-height: calc(100vh - 72px);
      position: relative;
      z-index: 1;
    }

    /* Left Info Panel */
    .form-info {
      background: linear-gradient(160deg, #1C1917 0%, #2a221c 100%);
      padding: 64px 48px;
      position: relative;
      overflow: hidden;
    }

    .form-info::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201,169,110,0.15), transparent 70%);
      pointer-events: none;
    }

    .form-info::after {
      content: '';
      position: absolute;
      bottom: -60px; left: -60px;
      width: 250px; height: 250px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201,169,110,0.08), transparent 70%);
      pointer-events: none;
    }

    .info-inner { position: relative; z-index: 1; }

    .section-tag {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(201,169,110,0.15);
      border: 1px solid rgba(201,169,110,0.3);
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      color: #C9A96E;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 24px;
    }

    .info-title {
      font-size: clamp(26px, 3vw, 40px);
      font-weight: 800;
      letter-spacing: -1px;
      color: #F9F7F4;
      margin: 0 0 20px;
      line-height: 1.1;
    }

    .info-desc {
      font-size: 15px;
      color: rgba(249,247,244,0.55);
      line-height: 1.7;
      margin: 0 0 48px;
    }

    .contact-list { display: flex; flex-direction: column; gap: 24px; margin-bottom: 56px; }

    .contact-item { display: flex; align-items: flex-start; gap: 16px; }

    .contact-icon {
      width: 40px; height: 40px;
      border-radius: 10px;
      background: rgba(201,169,110,0.12);
      border: 1px solid rgba(201,169,110,0.2);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .contact-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(249,247,244,0.4);
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin-bottom: 4px;
    }

    .contact-value {
      font-size: 14px;
      font-weight: 500;
      color: rgba(249,247,244,0.85);
    }

    /* Social Proof */
    .social-proof {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
    }

    .social-avatars { display: flex; }
    .avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 2px solid #1C1917;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700;
      color: white;
      margin-left: -8px;
    }
    .avatar:first-child { margin-left: 0; }
    .av1 { background: linear-gradient(135deg, #C9A96E, #A07840); }
    .av2 { background: linear-gradient(135deg, #64748b, #475569); }
    .av3 { background: linear-gradient(135deg, #C9A96E, #7a5c30); }
    .av4 { background: linear-gradient(135deg, #475569, #334155); }

    .social-strong { font-size: 14px; font-weight: 700; color: #F9F7F4; }
    .social-muted { font-size: 12px; color: rgba(249,247,244,0.45); }

    /* Right Form */
    .form-container {
      padding: 60px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      overflow-y: auto;
    }

    .form-card {
      width: 100%;
      max-width: 580px;
      background: white;
      border: 1px solid rgba(28,25,23,0.07);
      border-radius: 24px;
      padding: 48px;
      box-shadow: 0 8px 48px rgba(28,25,23,0.06);
    }

    .form-card-header { margin-bottom: 36px; }
    .form-card-title { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: var(--color-text); margin: 0 0 6px; }
    .form-card-subtitle { font-size: 14px; color: var(--color-text-muted); margin: 0; }

    /* Form Fields */
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .field-group { display: flex; flex-direction: column; margin-bottom: 20px; }
    .field-row .field-group { margin-bottom: 0; }

    .field-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 8px;
      letter-spacing: 0.01em;
    }

    .required { color: var(--color-accent); margin-left: 2px; }

    .field-input {
      padding: 12px 16px;
      background: #FAFAF9;
      border: 1.5px solid rgba(28,25,23,0.12);
      border-radius: 12px;
      font-size: 14px;
      color: var(--color-text);
      font-family: inherit;
      outline: none;
      transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
      width: 100%;
      box-sizing: border-box;
    }
    .field-input::placeholder { color: rgba(28,25,23,0.3); }
    .field-input:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(201,169,110,0.15);
      background: white;
    }

    .has-error .field-input {
      border-color: #ef4444;
      background: #fff9f9;
    }
    .has-error .field-input:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
    }

    .field-error {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 6px;
      font-size: 12px;
      font-weight: 500;
      color: #dc2626;
      animation: error-in 0.2s ease;
    }

    @keyframes error-in {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .field-select {
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%231C1917' stroke-opacity='0.4' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 40px;
      cursor: pointer;
    }

    .field-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .textarea-footer { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 6px; }

    .char-counter {
      font-size: 11px;
      color: var(--color-text-muted);
      flex-shrink: 0;
      margin-left: 8px;
    }
    .char-counter.near-limit { color: #f59e0b; font-weight: 600; }

    /* Phone input */
    .phone-wrap { position: relative; }
    .phone-prefix {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text);
      pointer-events: none;
      z-index: 1;
    }
    .phone-input { padding-left: 54px; }

    /* Checkbox */
    .terms-group { margin-bottom: 28px; }
    .checkbox-wrap {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
      user-select: none;
    }
    .checkbox-input {
      position: absolute;
      opacity: 0;
      width: 0; height: 0;
    }
    .checkbox-custom {
      flex-shrink: 0;
      width: 20px; height: 20px;
      border-radius: 6px;
      border: 1.5px solid rgba(28,25,23,0.2);
      background: #FAFAF9;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease;
      margin-top: 1px;
    }
    .checkbox-input:checked + .checkbox-custom {
      background: var(--color-text);
      border-color: var(--color-text);
    }
    .checkbox-input:focus + .checkbox-custom {
      box-shadow: 0 0 0 3px rgba(201,169,110,0.2);
    }
    .check-icon {
      opacity: 0;
      transition: opacity 0.15s ease;
    }
    .checkbox-input:checked + .checkbox-custom .check-icon { opacity: 1; }

    .checkbox-label { font-size: 13px; color: var(--color-text-muted); line-height: 1.5; }
    .link-accent { color: var(--color-accent); text-decoration: none; font-weight: 500; }
    .link-accent:hover { text-decoration: underline; }

    /* Submit button */
    .submit-btn {
      width: 100%;
      padding: 15px 28px;
      background: var(--color-text);
      color: var(--color-surface);
      border: none;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
      letter-spacing: 0.01em;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(28,25,23,0.2);
      background: #2d2926;
    }
    .submit-btn:active:not(:disabled) { transform: translateY(0); }
    .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .submit-btn.loading { pointer-events: none; }

    .spinner {
      width: 18px; height: 18px;
      border: 2.5px solid rgba(249,247,244,0.3);
      border-top-color: rgba(249,247,244,0.9);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ===========================
       RESPONSIVE — TABLET (≤1024px)
       =========================== */
    @media (max-width: 1024px) {
      .form-layout {
        grid-template-columns: 1fr;
      }
      .form-info {
        padding: 48px 40px;
      }
      .info-title { font-size: clamp(24px, 4vw, 36px); }
      .contact-list { margin-bottom: 40px; }
      .form-container { padding: 40px 32px 60px; }
      .form-card { padding: 40px; }
    }

    /* ===========================
       RESPONSIVE — MOBILE (≤640px)
       =========================== */
    @media (max-width: 640px) {
      .form-info { padding: 36px 20px; }
      .info-desc { font-size: 14px; margin-bottom: 32px; }
      .contact-list { gap: 16px; margin-bottom: 32px; }
      .contact-icon { width: 36px; height: 36px; }
      .social-proof { padding: 16px; gap: 12px; }
      .avatar { width: 30px; height: 30px; font-size: 10px; }

      .form-container { padding: 24px 16px 56px; }
      .form-card {
        padding: 24px 20px;
        border-radius: 20px;
        box-shadow: 0 4px 24px rgba(28,25,23,0.05);
      }
      .form-card-header { margin-bottom: 24px; }
      .form-card-title { font-size: 20px; }

      .field-row { grid-template-columns: 1fr; gap: 0; }
      .field-row .field-group { margin-bottom: 20px; }

      .toast-container {
        bottom: 16px;
        right: 16px;
        left: 16px;
      }
    }

    /* ===========================
       RESPONSIVE — SMALL MOBILE (≤390px)
       =========================== */
    @media (max-width: 390px) {
      .form-info { padding: 28px 16px; }
      .form-container { padding: 20px 12px 48px; }
      .form-card { padding: 20px 16px; }
    }
  `]
})
export class FormComponent {
  contactForm: FormGroup;
  isSubmitting = signal(false);
  toast = signal<ToastState>({ visible: false, type: "info", title: "", message: "" });

  get messageLength(): number {
    return (this.contactForm.get("message")?.value ?? "").length;
  }

  constructor(private fb: FormBuilder, private analytics: AnalyticsService) {
    this.contactForm = this.fb.group({
      fullName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.pattern(/^5\d{8}$/)]],
      company: [""],
      interest: ["", Validators.required],
      message: ["", [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      terms: [false, Validators.requiredTrue],
    });
  }

  isInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getError(field: string): string {
    const control = this.contactForm.get(field);
    if (!control || !control.errors) return "";
    if (control.errors["required"] || control.errors["requiredTrue"]) return "This field is required.";
    if (control.errors["email"]) return "Please enter a valid email address.";
    if (control.errors["minlength"]) {
      const min = control.errors["minlength"].requiredLength;
      return `Must be at least ${min} characters.`;
    }
    if (control.errors["maxlength"]) {
      const max = control.errors["maxlength"].requiredLength;
      return `Cannot exceed ${max} characters.`;
    }
    if (control.errors["pattern"]) return "Please enter a valid Saudi phone number (e.g. 5X XXX XXXX).";
    return "Invalid value.";
  }

  onSubmit(): void {
    if (this.isSubmitting()) return;

    this.contactForm.markAllAsTouched();

    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.analytics.track("form_submit", { status: "Succeeded", interest: this.contactForm.get("interest")?.value });
        this.showToast("success", "Message Sent!", "Thank you! Our team will get back to you within 24 business hours.");
        this.contactForm.reset();
      }, 1800);
    } else {
      this.analytics.track("form_submit", { status: "Failed", errors: this.getFormErrors() });
      this.showToast("error", "Please fix the errors", "Some required fields are missing or invalid. Please review and try again.");
    }
  }

  private getFormErrors(): string[] {
    const errors: string[] = [];
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control?.invalid) errors.push(key);
    });
    return errors;
  }

  private showToast(type: ToastType, title: string, message: string): void {
    this.toast.set({ visible: true, type, title, message });
  }

  dismissToast(): void {
    this.toast.update(t => ({ ...t, visible: false }));
  }
}
