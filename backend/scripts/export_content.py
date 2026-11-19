"""Export demo content to the frontend so offline fallback data stays in sync.

Run from the backend folder:  python -m scripts.export_content
"""
import json
from pathlib import Path

from app.content import ATTORNEYS, INSIGHTS, OFFICES, PRACTICE_AREAS, RESULTS, TESTIMONIALS

TARGET = Path(__file__).resolve().parents[2] / "frontend" / "src" / "data" / "content.json"


def main() -> None:
    payload = {
        "practiceAreas": PRACTICE_AREAS,
        "attorneys": ATTORNEYS,
        "results": sorted(RESULTS, key=lambda r: r["amount"], reverse=True),
        "insights": sorted(INSIGHTS, key=lambda n: n["date"], reverse=True),
        "testimonials": TESTIMONIALS,
        "offices": OFFICES,
    }
    TARGET.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {TARGET}")


if __name__ == "__main__":
    main()
