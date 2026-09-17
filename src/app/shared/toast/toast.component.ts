import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

export type ToastType = "success" | "error" | "info";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
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
