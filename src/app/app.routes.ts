import { Routes } from "@angular/router";
import { HomeComponent } from "./features/home/home.component";
import { SearchComponent } from "./features/search/search.component";
import { FormComponent } from "./features/form/form.component";
import { DashboardComponent } from "./features/dashboard/dashboard.component";

export const routes: Routes = [
  { path: "", component: HomeComponent, title: "Home — Empowering Smarter Payments" },
  { path: "search", component: SearchComponent, title: "Search Products" },
  { path: "form", component: FormComponent, title: "Contact Us" },
  { path: "dashboard", component: DashboardComponent, title: "Analytics Dashboard" },
  { path: "**", redirectTo: "" },
];
