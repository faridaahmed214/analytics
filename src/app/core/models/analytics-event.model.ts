export interface AnalyticsEvent {
  event: string;
  payload: Record<string, unknown>;
  timestamp: string;
}
