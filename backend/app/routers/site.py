"""Law firm endpoints."""
import json
from typing import Annotated

from fastapi import APIRouter, HTTPException, Path, Query, Request

from ..config import settings
from ..content import OFFICES
from ..db import fetch_all, insert
from ..responses import ok
from ..schemas import ConsultationRequest
from ..security import limiter

router = APIRouter()

CONTACT_METHOD_TEXT = {"phone": "telefonisch", "email": "per E-Mail", "video": "per Videocall"}

Slug = Annotated[str, Path(pattern=r"^[a-z0-9-]{2,60}$")]


def _rows(sql: str, params: tuple = ()) -> list[dict]:
    return [json.loads(r["data"]) for r in fetch_all(sql, params)]


def _one(sql: str, slug: str, what: str) -> dict:
    rows = _rows(sql, (slug,))
    if not rows:
        raise HTTPException(status_code=404, detail=f"{what} nicht gefunden.")
    return rows[0]


@router.get("/practice-areas")
def list_practice_areas():
    return ok(_rows("SELECT data FROM practice_areas ORDER BY position"))


@router.get("/practice-areas/{slug}")
def get_practice_area(slug: Slug):
    area = _one("SELECT data FROM practice_areas WHERE slug = ?", slug, "Rechtsgebiet")
    attorneys = [a for a in _rows("SELECT data FROM attorneys ORDER BY position") if slug in a["practice"]]
    results = _rows("SELECT data FROM results WHERE category = ? ORDER BY amount DESC", (slug,))
    return ok({**area, "attorneys": attorneys, "results": results})


@router.get("/attorneys")
def list_attorneys():
    return ok(_rows("SELECT data FROM attorneys ORDER BY position"))


@router.get("/attorneys/{slug}")
def get_attorney(slug: Slug):
    return ok(_one("SELECT data FROM attorneys WHERE slug = ?", slug, "Anwaltsprofil"))


@router.get("/results")
def list_results(category: Annotated[str | None, Query(pattern=r"^[a-z0-9-]{2,60}$")] = None):
    if category:
        return ok(_rows("SELECT data FROM results WHERE category = ? ORDER BY amount DESC", (category,)))
    return ok(_rows("SELECT data FROM results ORDER BY amount DESC"))


@router.get("/insights")
def list_insights():
    return ok(_rows("SELECT data FROM insights ORDER BY published DESC"))


@router.get("/testimonials")
def list_testimonials():
    return ok(_rows("SELECT data FROM testimonials ORDER BY id"))


@router.get("/offices")
def list_offices():
    return ok(OFFICES)


@router.post("/consultations", status_code=201)
@limiter.limit(settings.rate_limit)
def create_consultation(request: Request, body: ConsultationRequest):
    consultation_id = insert(
        "INSERT INTO consultations (name, email, phone, practice_area, contact_method, urgency, description)"
        " VALUES (?, ?, ?, ?, ?, ?, ?)",
        (body.name, str(body.email), body.phone, body.practice_area, body.contact_method,
         body.urgency, body.description),
    )
    first = body.name.split()[0]
    method = CONTACT_METHOD_TEXT[body.contact_method]
    window = "innerhalb von 2 Geschäftsstunden" if body.urgency == "urgent" else "innerhalb eines Werktags"
    return ok({"id": consultation_id,
               "message": f"Vielen Dank, {first}. Eine Anwältin oder ein Anwalt meldet sich {method} {window}."})
