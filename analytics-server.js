/**
 * Geidea Analytics Proxy Server
 * Runs on port 3000 alongside Angular (port 4200)
 */
const express = require("express");
const cors = require("cors");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors()); // open for development

app.use(express.json());

const KEY_PATH = path.join(__dirname, "geidea-analytics-998b0b4f4c67.json");
const analyticsClient = new BetaAnalyticsDataClient({ keyFilename: KEY_PATH });

const PROPERTY_ID = process.env.GA_PROPERTY_ID || "534039360";

async function runReport(dimensions, metrics, dateRanges, orderBys = []) {
  const [response] = await analyticsClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dimensions, metrics, dateRanges, orderBys,
  });
  return response;
}

app.get("/api/health", (req, res) => res.json({ status: "ok", property: PROPERTY_ID }));

app.get("/api/overview", async (req, res) => {
  try {
    const r = await runReport([], [
      { name: "activeUsers" }, { name: "sessions" },
      { name: "bounceRate" }, { name: "averageSessionDuration" }, { name: "screenPageViews" },
    ], [{ startDate: "30daysAgo", endDate: "today" }]);
    const v = r.rows?.[0]?.metricValues || [];
    res.json({
      activeUsers: v[0]?.value || "0", sessions: v[1]?.value || "0",
      bounceRate: parseFloat(v[2]?.value || "0").toFixed(1),
      avgSessionDuration: parseFloat(v[3]?.value || "0").toFixed(0),
      pageViews: v[4]?.value || "0",
    });
  } catch (e) {
    console.error(`[Analytics API Error] ${req.path}:`, e);
    res.status(500).json({ error: "Internal server error fetching analytics data." });
  }
});

app.get("/api/daily-users", async (req, res) => {
  try {
    const r = await runReport([{ name: "date" }], [{ name: "activeUsers" }],
      [{ startDate: "14daysAgo", endDate: "today" }],
      [{ dimension: { orderType: "ALPHANUMERIC", dimensionName: "date" } }]);
    res.json((r.rows || []).map(row => ({
      date: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
    })));
  } catch (e) {
    console.error(`[Analytics API Error] ${req.path}:`, e);
    res.status(500).json({ error: "Internal server error fetching analytics data." });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const r = await runReport([{ name: "eventName" }], [{ name: "eventCount" }],
      [{ startDate: "30daysAgo", endDate: "today" }],
      [{ metric: { metricName: "eventCount" }, desc: true }]);
    res.json((r.rows || []).map(row => ({
      name: row.dimensionValues[0].value, count: parseInt(row.metricValues[0].value),
    })));
  } catch (e) {
    console.error(`[Analytics API Error] ${req.path}:`, e);
    res.status(500).json({ error: "Internal server error fetching analytics data." });
  }
});

app.get("/api/devices", async (req, res) => {
  try {
    const r = await runReport([{ name: "deviceCategory" }], [{ name: "sessions" }],
      [{ startDate: "30daysAgo", endDate: "today" }]);
    res.json((r.rows || []).map(row => ({
      device: row.dimensionValues[0].value, sessions: parseInt(row.metricValues[0].value),
    })));
  } catch (e) {
    console.error(`[Analytics API Error] ${req.path}:`, e);
    res.status(500).json({ error: "Internal server error fetching analytics data." });
  }
});

app.get("/api/pages", async (req, res) => {
  try {
    const r = await runReport([{ name: "pagePath" }],
      [{ name: "screenPageViews" }, { name: "activeUsers" }],
      [{ startDate: "30daysAgo", endDate: "today" }],
      [{ metric: { metricName: "screenPageViews" }, desc: true }]);
    res.json((r.rows || []).slice(0, 10).map(row => ({
      path: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value),
      users: parseInt(row.metricValues[1].value),
    })));
  } catch (e) {
    console.error(`[Analytics API Error] ${req.path}:`, e);
    res.status(500).json({ error: "Internal server error fetching analytics data." });
  }
});

app.get("/api/countries", async (req, res) => {
  try {
    const r = await runReport([{ name: "country" }], [{ name: "activeUsers" }],
      [{ startDate: "30daysAgo", endDate: "today" }],
      [{ metric: { metricName: "activeUsers" }, desc: true }]);
    res.json((r.rows || []).slice(0, 8).map(row => ({
      country: row.dimensionValues[0].value, users: parseInt(row.metricValues[0].value),
    })));
  } catch (e) {
    console.error(`[Analytics API Error] ${req.path}:`, e);
    res.status(500).json({ error: "Internal server error fetching analytics data." });
  }
});

app.listen(PORT, () => {
  console.log("Geidea Analytics Server running on http://localhost:" + PORT);
  console.log("GA4 Property: " + PROPERTY_ID);
});
