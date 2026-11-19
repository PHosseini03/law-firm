import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import Contact from "../pages/Contact";
import {
  DEMO_ATTORNEYS, DEMO_INSIGHTS, DEMO_OFFICES, DEMO_PRACTICE_AREAS, DEMO_RESULTS, DEMO_TESTIMONIALS, demoPracticeDetail,
} from "../data/demo";
import { mockApi, renderAt } from "./render";

const ROUTES = {
  "/api/practice-areas/personal-injury": demoPracticeDetail("personal-injury"),
  "/api/practice-areas": DEMO_PRACTICE_AREAS,
  "/api/attorneys/eleanor-sterling": DEMO_ATTORNEYS[0],
  "/api/attorneys": DEMO_ATTORNEYS,
  "/api/results": DEMO_RESULTS,
  "/api/insights": DEMO_INSIGHTS,
  "/api/testimonials": DEMO_TESTIMONIALS,
  "/api/offices": DEMO_OFFICES,
};
const offline = () => vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText("Vollständiger Name"), "Morgan Avery");
  await userEvent.type(screen.getByRole("textbox", { name: "E-Mail" }), "morgan@example.com");
  await userEvent.type(screen.getByRole("textbox", { name: "Telefon" }), "069 1234 5670");
  await userEvent.selectOptions(screen.getByLabelText("Rechtsgebiet"), "business-litigation");
  await userEvent.type(screen.getByLabelText(/anliegen kurz/i), "Ein ehemaliger Partner hält mir zustehende Gewinne zurück.");
}

describe("routing", () => {
  it("renders the home page with API data", async () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<App />);
    expect(screen.getByRole("heading", { level: 1, name: /beistand, der standhält/i })).toBeInTheDocument();
    expect(await screen.findAllByText("Dr. Eleanor Sterling")).not.toHaveLength(0);
  });

  it("renders every listing page", () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    const pages = [["/practice-areas", /wo wir beraten/i], ["/attorneys", /gründlicher vorbereiten/i], ["/results", /vor gericht/i], ["/insights", /perspektiven/i], ["/contact", /vertrauliche erstberatung/i]] as const;
    for (const [path, title] of pages) {
      const { unmount } = renderAt(<App />, path);
      expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
      unmount();
    }
  });

  it("shows practice area detail with related attorneys", async () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<App />, "/practice-areas/personal-injury");
    expect(screen.getByRole("heading", { level: 1, name: "Personenschäden" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Markus Hahn" })).toBeInTheDocument();
    expect(screen.getByLabelText("Rechtsgebiet")).toHaveValue("personal-injury");
  });

  it("shows an attorney profile", () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<App />, "/attorneys/eleanor-sterling");
    expect(screen.getByRole("heading", { level: 1, name: "Dr. Eleanor Sterling" })).toBeInTheDocument();
    expect(screen.getByText("Promotion (Dr. iur.), Goethe-Universität Frankfurt")).toBeInTheDocument();
  });

  it("shows 404 for unknown attorney and practice slugs", async () => {
    offline();
    const { unmount } = renderAt(<App />, "/attorneys/nobody");
    expect(await screen.findByRole("heading", { name: "404" })).toBeInTheDocument();
    unmount();
    renderAt(<App />, "/practice-areas/space-law");
    expect(await screen.findByRole("heading", { name: "404" })).toBeInTheDocument();
  });

  it("shows 404 for unknown routes and toggles the mobile menu", async () => {
    offline();
    renderAt(<App />, "/nowhere");
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /menü öffnen/i }));
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /menü schließen/i })).toHaveAttribute("aria-expanded", "true");
  });
});

describe("filters with offline fallback", () => {
  it("filters case results by practice area", async () => {
    offline();
    renderAt(<App />, "/results");
    await waitFor(() => expect(screen.getByRole("heading", { name: "Schwerer Lkw-Unfall" })).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: "Wirtschaftsrecht" }));
    expect(screen.queryByRole("heading", { name: "Schwerer Lkw-Unfall" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Abfindung eines Minderheitsgesellschafters" })).toBeInTheDocument();
  });

  it("filters insights by topic", async () => {
    offline();
    renderAt(<App />, "/insights");
    await userEvent.click(screen.getByRole("button", { name: "Erbrecht" }));
    expect(screen.getByRole("heading", { name: /testament oder erbvertrag/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /gewerbemietvertrag/i })).not.toBeInTheDocument();
  });
});

describe("consultation form", () => {
  it("blocks submission until fields and consent are valid", async () => {
    const fetchMock = mockApi(ROUTES);
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<Contact />);
    await userEvent.click(screen.getByRole("button", { name: /vertrauliche erstberatung anfragen/i }));
    expect(await screen.findByText("Bitte geben Sie Ihren vollständigen Namen ein")).toBeInTheDocument();
    expect(screen.getByText("Rechtsgebiet ist ein Pflichtfeld")).toBeInTheDocument();
    expect(screen.getByText(/bestätigen sie den hinweis/i)).toBeInTheDocument();
    const posts = fetchMock.mock.calls.filter((c) => ((c as unknown[])[1] as RequestInit | undefined)?.method === "POST");
    expect(posts).toHaveLength(0);
  });

  it("submits a valid request and shows confirmation", async () => {
    const fetchMock = mockApi({ ...ROUTES, "/api/consultations": { id: 12, message: "Vielen Dank, Morgan. Eine Anwältin oder ein Anwalt meldet sich per Videocall innerhalb von 2 Geschäftsstunden." } });
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<Contact />, "/contact?area=family-law");
    expect(screen.getByLabelText("Rechtsgebiet")).toHaveValue("family-law");
    await fillValidForm();
    await userEvent.click(screen.getByLabelText("Videocall"));
    await userEvent.click(screen.getByLabelText(/angelegenheit ist eilig/i));
    await userEvent.click(screen.getByLabelText(/kein mandatsverhältnis/i));
    await userEvent.click(screen.getByRole("button", { name: /vertrauliche erstberatung anfragen/i }));
    expect(await screen.findByText("Anfrage eingegangen")).toBeInTheDocument();
    expect(screen.getAllByText(/meldet sich per Videocall/)).toHaveLength(2); // confirmation + toast
    expect(screen.getByText("Vertrauliches Aktenzeichen SP-00012")).toBeInTheDocument();
    const call = fetchMock.mock.calls.find((c) => String((c as unknown[])[0]) === "/api/consultations") as unknown as [string, RequestInit];
    expect(JSON.parse(call[1].body as string)).toMatchObject({ consent: true, contact_method: "video", urgency: "urgent", practice_area: "business-litigation" });
    await userEvent.click(screen.getByRole("button", { name: /weitere anfrage/i }));
    expect(screen.getByLabelText("Vollständiger Name")).toHaveValue("");
  });

  it("shows an error toast when the server rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, data: null, error: "Zu viele Anfragen." }), { status: 429 })));
    renderAt(<Contact />);
    await fillValidForm();
    await userEvent.click(screen.getByLabelText(/kein mandatsverhältnis/i));
    await userEvent.click(screen.getByRole("button", { name: /vertrauliche erstberatung anfragen/i }));
    await waitFor(() => expect(screen.getAllByRole("alert").length).toBeGreaterThan(0));
    expect(within(screen.getAllByRole("alert")[0]).getByText(/konnte nicht gesendet werden/i)).toBeInTheDocument();
  });
});
