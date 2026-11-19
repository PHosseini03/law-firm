"""German user-facing error messages, including translations of Pydantic validation errors."""
from http import HTTPStatus

FIELD_LABELS = {
    "name": "Name",
    "email": "E-Mail",
    "phone": "Telefon",
    "practice_area": "Rechtsgebiet",
    "contact_method": "Kontaktweg",
    "urgency": "Dringlichkeit",
    "description": "Beschreibung",
    "consent": "Einwilligung",
    "category": "Kategorie",
    "slug": "Adresse",
}

STATUS_MESSAGES = {
    400: "Ungültige Anfrage.",
    404: "Nicht gefunden.",
    405: "Diese Methode ist nicht erlaubt.",
    413: "Die Anfrage ist zu groß.",
}

TOO_MANY_REQUESTS = "Zu viele Anfragen. Bitte versuchen Sie es gleich noch einmal."
SERVER_ERROR = "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut."
INVALID_REQUEST = "Ungültige Anfrage."
REQUEST_FAILED = "Die Anfrage ist fehlgeschlagen."

_SIMPLE = {
    "missing": "ist erforderlich",
    "extra_forbidden": "ist nicht erlaubt",
    "literal_error": "enthält einen ungültigen Wert",
    "enum": "enthält einen ungültigen Wert",
    "bool_type": "muss ja oder nein sein",
    "bool_parsing": "muss ja oder nein sein",
    "string_type": "muss Text sein",
    "string_pattern_mismatch": "hat ein ungültiges Format",
    "json_invalid": "enthält ungültiges JSON",
}


def _message(err: dict) -> str:
    kind = str(err.get("type", ""))
    ctx = err.get("ctx") or {}
    if kind in _SIMPLE:
        return _SIMPLE[kind]
    if kind == "string_too_short":
        return f"muss mindestens {ctx.get('min_length')} Zeichen lang sein"
    if kind == "string_too_long":
        return f"darf höchstens {ctx.get('max_length')} Zeichen lang sein"
    if kind == "value_error":
        msg = str(err.get("msg", "")).removeprefix("Value error, ")
        # email-validator reports in English; our own validators already speak German.
        return "ist keine gültige E-Mail-Adresse" if "email address" in msg else msg
    return "ist ungültig"


def validation_message(errors: list[dict]) -> str:
    parts = []
    for err in errors:
        loc = [str(p) for p in err.get("loc", ()) if p not in ("body", "query", "path")]
        field = FIELD_LABELS.get(loc[-1], loc[-1]) if loc else ""
        msg = _message(err)
        parts.append(f"{field}: {msg}" if field else msg)
    return "; ".join(parts) or INVALID_REQUEST


def http_message(status_code: int, detail: object) -> str:
    if not isinstance(detail, str):
        return REQUEST_FAILED
    try:
        default = HTTPStatus(status_code).phrase
    except ValueError:
        default = None
    if detail == default:
        return STATUS_MESSAGES.get(status_code, REQUEST_FAILED)
    return detail
