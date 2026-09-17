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
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
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
      this.analytics.track("form_submit", { status: "Failed", errors: this.getFormErrors().join(', ') });
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
