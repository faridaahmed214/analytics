import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./shared/navbar/navbar.component";

@Component({
  imports: [RouterOutlet, NavbarComponent],
  selector: "app-root",
  template: `
    <app-navbar />
    <router-outlet />
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class App {}
