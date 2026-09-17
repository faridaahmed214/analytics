import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface OverviewData {
  activeUsers: string; sessions: string; bounceRate: string;
  avgSessionDuration: string; pageViews: string;
}
export interface DailyUser { date: string; users: number; }
export interface EventData { name: string; count: number; }
export interface DeviceData { device: string; sessions: number; }
export interface PageData { path: string; views: number; users: number; }
export interface CountryData { country: string; users: number; }

@Injectable({ providedIn: "root" })
export class DashboardService {
  private readonly base = "/api";
  constructor(private http: HttpClient) {}
  getOverview(): Observable<OverviewData> { return this.http.get<OverviewData>(`${this.base}/overview`); }
  getDailyUsers(): Observable<DailyUser[]> { return this.http.get<DailyUser[]>(`${this.base}/daily-users`); }
  getEvents(): Observable<EventData[]> { return this.http.get<EventData[]>(`${this.base}/events`); }
  getDevices(): Observable<DeviceData[]> { return this.http.get<DeviceData[]>(`${this.base}/devices`); }
  getPages(): Observable<PageData[]> { return this.http.get<PageData[]>(`${this.base}/pages`); }
  getCountries(): Observable<CountryData[]> { return this.http.get<CountryData[]>(`${this.base}/countries`); }
}