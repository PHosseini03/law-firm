from app.content import PRACTICE_SLUGS
from app.schemas import PracticeArea

VALID = {
    "name": "Morgan Avery",
    "email": "morgan@example.com",
    "phone": "+1 212 555 0100",
    "practice_area": "business-litigation",
    "contact_method": "email",
    "urgency": "standard",
    "description": "A former partner is withholding profits owed under our operating agreement.",
    "consent": True,
}


def test_health_envelope(client):
    res = client.get("/api/health")
    assert res.json() == {"success": True, "data": {"status": "ok", "site": "Sterling & Partner"}, "error": None}


def test_security_headers(client):
    h = client.get("/api/health").headers
    assert h["x-frame-options"] == "DENY"
    assert h["x-content-type-options"] == "nosniff"
    assert "frame-ancestors 'none'" in h["content-security-policy"]


def test_cors_allow_list(client):
    good = client.get("/api/health", headers={"Origin": "http://localhost:5178"})
    bad = client.get("/api/health", headers={"Origin": "https://evil.example"})
    assert good.headers.get("access-control-allow-origin") == "http://localhost:5178"
    assert "access-control-allow-origin" not in bad.headers


def test_practice_enum_matches_content():
    assert set(PRACTICE_SLUGS) <= set(PracticeArea.__args__)


def test_list_practice_areas(client):
    data = client.get("/api/practice-areas").json()["data"]
    assert [p["slug"] for p in data][:2] == ["business-litigation", "personal-injury"]
    assert len(data) == 6


def test_practice_area_detail_includes_related(client):
    data = client.get("/api/practice-areas/personal-injury").json()["data"]
    assert data["name"] == "Personenschäden"
    assert any(a["slug"] == "markus-hahn" for a in data["attorneys"])
    assert data["results"][0]["amount"] >= data["results"][-1]["amount"]


def test_practice_area_not_found(client):
    res = client.get("/api/practice-areas/space-law")
    assert res.status_code == 404
    assert res.json() == {"success": False, "data": None, "error": "Rechtsgebiet nicht gefunden."}


def test_slug_pattern_blocks_injection(client):
    res = client.get("/api/attorneys/x' OR '1'='1")
    assert res.status_code in (404, 422)
    assert res.json()["success"] is False


def test_attorneys(client):
    data = client.get("/api/attorneys").json()["data"]
    assert len(data) == 4
    one = client.get("/api/attorneys/eleanor-sterling").json()["data"]
    assert one["title"] == "Gründungspartnerin"
    assert client.get("/api/attorneys/nobody-here").status_code == 404


def test_results_sorted_and_filtered(client):
    all_results = client.get("/api/results").json()["data"]
    amounts = [r["amount"] for r in all_results]
    assert amounts == sorted(amounts, reverse=True)
    biz = client.get("/api/results?category=business-litigation").json()["data"]
    assert {r["category"] for r in biz} == {"business-litigation"}
    assert client.get("/api/results?category=<x>").status_code == 422


def test_insights_testimonials_offices(client):
    insights = client.get("/api/insights").json()["data"]
    assert insights[0]["date"] >= insights[-1]["date"]
    assert len(client.get("/api/testimonials").json()["data"]) == 3
    assert client.get("/api/offices").json()["data"][0]["city"] == "Frankfurt am Main"


def test_create_consultation(client):
    res = client.post("/api/consultations", json=VALID)
    assert res.status_code == 201
    data = res.json()["data"]
    assert data["id"] == 1
    assert data["message"] == "Vielen Dank, Morgan. Eine Anwältin oder ein Anwalt meldet sich per E-Mail innerhalb eines Werktags."


def test_urgent_consultation_message(client):
    res = client.post("/api/consultations", json={**VALID, "urgency": "urgent"})
    assert "2 Geschäftsstunden" in res.json()["data"]["message"]


def test_consent_required(client):
    for consent in (False, None):
        res = client.post("/api/consultations", json={**VALID, "consent": consent})
        assert res.status_code == 422
    missing = {k: v for k, v in VALID.items() if k != "consent"}
    assert client.post("/api/consultations", json=missing).status_code == 422
    res = client.post("/api/consultations", json={**VALID, "consent": False})
    assert res.json()["error"] == "Einwilligung: Sie müssen den Hinweis bestätigen"


def test_rejects_invalid_fields(client):
    cases = [
        {"email": "bad"},
        {"phone": "not a phone"},
        {"practice_area": "space-law"},
        {"contact_method": "pigeon"},
        {"description": "too short"},
        {"description": "x" * 2001},
        {"name": "<script>alert(1)</script>"},
        {"description": "Please see <img src=x onerror=alert(1)> for details of my case"},
        {"is_admin": True},
    ]
    for override in cases:
        res = client.post("/api/consultations", json={**VALID, **override})
        assert res.status_code == 422, override
        assert res.json()["success"] is False


def test_sql_injection_stored_as_text(client):
    payload = {**VALID, "description": "'); DROP TABLE consultations; -- this is my case description"}
    assert client.post("/api/consultations", json=payload).status_code == 201
    assert client.post("/api/consultations", json=VALID).json()["data"]["id"] == 2


def test_body_size_limit(client):
    res = client.post("/api/consultations", content=b"x" * 20000, headers={"Content-Type": "application/json"})
    assert res.status_code == 413


def test_bad_content_length(client):
    res = client.post("/api/consultations", content=b"{}", headers={"Content-Type": "application/json", "Content-Length": "abc"})
    assert res.status_code in (400, 422)


def test_rate_limit(client):
    codes = [client.post("/api/consultations", json=VALID).status_code for _ in range(12)]
    assert 429 in codes
    assert "Zu viele Anfragen" in client.post("/api/consultations", json=VALID).json()["error"]


def test_unknown_route_envelope(client):
    res = client.get("/api/nope")
    assert res.status_code == 404 and res.json()["success"] is False
    assert res.json()["error"] == "Nicht gefunden."


def test_validation_messages_are_german(client):
    cases = {
        "email": ("bad", "E-Mail: ist keine gültige E-Mail-Adresse"),
        "phone": ("not a phone", "Telefon: muss eine gültige Telefonnummer sein"),
        "practice_area": ("space-law", "Rechtsgebiet: enthält einen ungültigen Wert"),
        "description": ("too short", "Beschreibung: muss mindestens 20 Zeichen lang sein"),
        "name": ("<b>x</b>", "Name: enthält ungültige Zeichen"),
        "is_admin": (True, "is_admin: ist nicht erlaubt"),
    }
    for field, (value, expected) in cases.items():
        res = client.post("/api/consultations", json={**VALID, field: value})
        assert res.json()["error"] == expected, field
    too_long = client.post("/api/consultations", json={**VALID, "description": "x" * 2001})
    assert too_long.json()["error"] == "Beschreibung: darf höchstens 2000 Zeichen lang sein"
    missing = {k: v for k, v in VALID.items() if k != "name"}
    assert client.post("/api/consultations", json=missing).json()["error"] == "Name: ist erforderlich"
    assert client.post("/api/consultations", json={**VALID, "consent": None}).json()["error"] == "Einwilligung: muss ja oder nein sein"
    assert client.get("/api/results?category=<x>").json()["error"] == "Kategorie: hat ein ungültiges Format"


def test_http_message_fallbacks():
    from app.messages import http_message, validation_message
    assert http_message(405, "Method Not Allowed") == "Diese Methode ist nicht erlaubt."
    assert http_message(418, "I'm a Teapot") == "Die Anfrage ist fehlgeschlagen."
    assert http_message(999, "Custom") == "Custom"
    assert http_message(404, {"x": 1}) == "Die Anfrage ist fehlgeschlagen."
    assert validation_message([]) == "Ungültige Anfrage."
    assert validation_message([{"type": "weird", "loc": ()}]) == "ist ungültig"
