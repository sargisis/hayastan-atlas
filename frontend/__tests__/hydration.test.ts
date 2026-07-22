import { describe, it, expect } from "vitest";

/**
 * Guards against SSR/client hydration mismatches.
 *
 * Rule: any value rendered in HTML must be deterministic on both server (no
 * window/document) and client. Reading window.location, Date.now(), Math.random()
 * inside useState initializer or component body (outside useEffect) causes mismatches.
 */

// Simulate SSR environment — window is undefined
const originalWindow = globalThis.window;

describe("SSR safety — no window access at module init time", () => {
  it("fmt() works without window", async () => {
    // @ts-expect-error – simulate SSR
    delete globalThis.window;
    try {
      const { fmt } = await import("../lib/lang");
      expect(fmt(-782, "en")).toBe("782 BC");
      expect(fmt(451, "en")).toBe("451 AD");
      expect(fmt(-782, "hy")).toBe("782 մ.թ.ա.");
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it("LESSONS data is static and has no window dependency", async () => {
    // @ts-expect-error – simulate SSR
    delete globalThis.window;
    try {
      const { LESSONS } = await import("../lib/lessons");
      expect(LESSONS.length).toBeGreaterThan(0);
      for (const lesson of LESSONS) {
        expect(lesson.id).toBeTruthy();
        expect(lesson.steps.length).toBeGreaterThan(0);
      }
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it("worldContext getWorldContextForYear works without window", async () => {
    // @ts-expect-error – simulate SSR
    delete globalThis.window;
    try {
      const { getWorldContextForYear } = await import("../lib/worldContext");
      const items = getWorldContextForYear(451);
      expect(Array.isArray(items)).toBe(true);
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it("quizQuestions LOCATION_QUESTIONS is static (no window dep)", async () => {
    // @ts-expect-error – simulate SSR
    delete globalThis.window;
    try {
      const { LOCATION_QUESTIONS } = await import("../lib/quizQuestions");
      expect(LOCATION_QUESTIONS.length).toBeGreaterThan(0);
      for (const q of LOCATION_QUESTIONS) {
        expect(typeof q.lat).toBe("number");
        expect(typeof q.lng).toBe("number");
      }
    } finally {
      globalThis.window = originalWindow;
    }
  });
});
