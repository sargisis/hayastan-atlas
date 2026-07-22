import { describe, it, expect } from "vitest";
import { haversineKm, locationScore } from "../lib/quizQuestions";

// ── haversineKm ──────────────────────────────────────────────────────────────
describe("haversineKm", () => {
  it("same point = 0 km", () => {
    expect(haversineKm(39.15, 44.72, 39.15, 44.72)).toBe(0);
  });

  it("Yerevan to Tbilisi ≈ 250 km", () => {
    const km = haversineKm(40.18, 44.51, 41.69, 44.83);
    expect(km).toBeGreaterThan(150);
    expect(km).toBeLessThan(350);
  });

  it("Yerevan to Rome ≈ 2800 km", () => {
    const km = haversineKm(40.18, 44.51, 41.9, 12.5);
    expect(km).toBeGreaterThan(2000);
    expect(km).toBeLessThan(3500);
  });
});

// ── locationScore ─────────────────────────────────────────────────────────────
describe("locationScore", () => {
  it("0 km → 100 pts", () => expect(locationScore(0)).toBe(100));
  it("30 km → 100 pts", () => expect(locationScore(30)).toBe(100));
  it("31 km → 90 pts", () => expect(locationScore(31)).toBe(90));
  it("80 km → 90 pts", () => expect(locationScore(80)).toBe(90));
  it("150 km → 75 pts", () => expect(locationScore(150)).toBe(75));
  it("300 km → 55 pts", () => expect(locationScore(300)).toBe(55));
  it("500 km → 35 pts", () => expect(locationScore(500)).toBe(35));
  it("1000 km → 15 pts", () => expect(locationScore(1000)).toBe(15));
  it("> 1000 km → 0 pts", () => expect(locationScore(1001)).toBe(0));
});
