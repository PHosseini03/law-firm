import { describe, expect, it, vi } from "vitest";
import { formatAmount, formatDate } from "../lib/format";
import { rules, validate } from "../lib/validation";
import { api, ApiError, request } from "../api/client";
import { DEMO_PRACTICE_AREAS, DEMO_RESULTS, demoPracticeDetail } from "../data/demo";

describe("formatters", () => {
  it("formats verdict amounts", () => {
    expect(formatAmount(8_750_000)).toBe("8,75 Mio. €");
    expect(formatAmount(14_200_000)).toBe("14,2 Mio. €");
    expect(formatAmount(3_000_000)).toBe("3 Mio. €");
    expect(formatAmount(650_000)).toBe("650.000 €");
    expect(formatAmount(0)).toBe("Abgewiesen");
  });

  it("formats ISO dates and passes through invalid ones", () => {
    expect(formatDate("2026-10-28")).toBe("28. Oktober 2026");
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});

describe("demo data", () => {
  it("builds practice detail with related attorneys and results", () => {
    const detail = demoPracticeDetail("personal-injury");
    expect(detail?.attorneys.map((a) => a.slug)).toContain("markus-hahn");
    expect(detail?.results.every((r) => r.category === "personal-injury")).toBe(true);
  });

  it("returns null for unknown practice areas", () => {
    expect(demoPracticeDetail("space-law")).toBeNull();
  });

  it("has six practice areas and results sorted by amount", () => {
    expect(DEMO_PRACTICE_AREAS).toHaveLength(6);
    const amounts = DEMO_RESULTS.map((r) => r.amount);
    expect(amounts).toEqual([...amounts].sort((a, b) => b - a));
  });
});

describe("validate", () => {
  const schema = { name: [rules.name], email: [rules.email], phone: [rules.phone], description: [rules.minLength("Beschreibung", 20), rules.safeText] };

  it("accepts valid input", () => {
    expect(validate({ name: "Morgan Avery", email: "m@example.com", phone: "212 555 0100", description: "Streit mit einem ehemaligen Geschäftspartner." }, schema)).toEqual({});
  });

  it("rejects invalid input, one message per field", () => {
    const errors = validate({ name: "<x>", email: "bad", phone: "abc", description: "short" }, schema);
    expect(Object.keys(errors).sort()).toEqual(["description", "email", "name", "phone"]);
    expect(rules.safeText("<script>")).toMatch(/entfernen/);
    expect(rules.required("Rechtsgebiet")("")).toBe("Rechtsgebiet ist ein Pflichtfeld");
    expect(rules.number("Alter", 1, 5)("9")).toBe("Alter muss zwischen 1 und 5 liegen");
    expect(errors.email).toBe("Bitte geben Sie eine gültige E-Mail-Adresse ein");
  });
});

describe("api client", () => {
  it("unwraps a successful envelope", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: { ok: 1 }, error: null }))));
    await expect(api.get("/api/x")).resolves.toEqual({ ok: 1 });
  });

  it("surfaces the server error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, data: null, error: "consent: required" }), { status: 422 })));
    await expect(api.post("/api/x", {})).rejects.toThrow("consent: required");
  });

  it("marks network failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    const err = await request("/api/x").catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).isNetwork).toBe(true);
  });

  it("handles non-JSON responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>", { status: 502 })));
    await expect(request("/api/x")).rejects.toThrow("unerwartete Antwort");
  });
});
