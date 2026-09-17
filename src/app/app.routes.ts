import { Routes } from "@angular/router";
import { HomeComponent } from "./features/home/home.component";
import { SearchComponent } from "./features/search/search.component";
import { FormComponent } from "./features/form/form.component";

export const routes: Routes = [
  { path: "", component: HomeComponent, title: "Geidea — Empowering Smarter Payments" },
  { path: "search", component: SearchComponent, title: "Search Products — Geidea" },
  { path: "form", component: FormComponent, title: "Contact Us — Geidea" },
  { path: "**", redirectTo: "" },
];
