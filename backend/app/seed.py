"""Create tables and seed fictional demo data."""
import json
import sqlite3

from .content import ATTORNEYS, INSIGHTS, PRACTICE_AREAS, RESULTS, TESTIMONIALS

SCHEMA = """
CREATE TABLE IF NOT EXISTS practice_areas (slug TEXT PRIMARY KEY, position INTEGER NOT NULL, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS attorneys (slug TEXT PRIMARY KEY, position INTEGER NOT NULL, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS results (id INTEGER PRIMARY KEY, category TEXT NOT NULL, amount INTEGER NOT NULL, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS insights (id INTEGER PRIMARY KEY, published TEXT NOT NULL, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS testimonials (id INTEGER PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
    practice_area TEXT NOT NULL, contact_method TEXT NOT NULL, urgency TEXT NOT NULL,
    description TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
"""


def seed(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)
    if conn.execute("SELECT COUNT(*) FROM practice_areas").fetchone()[0] == 0:
        conn.executemany("INSERT INTO practice_areas VALUES (?, ?, ?)",
                         [(p["slug"], i, json.dumps(p)) for i, p in enumerate(PRACTICE_AREAS)])
        conn.executemany("INSERT INTO attorneys VALUES (?, ?, ?)",
                         [(a["slug"], i, json.dumps(a)) for i, a in enumerate(ATTORNEYS)])
        conn.executemany("INSERT INTO results VALUES (?, ?, ?, ?)",
                         [(r["id"], r["category"], r["amount"], json.dumps(r)) for r in RESULTS])
        conn.executemany("INSERT INTO insights VALUES (?, ?, ?)",
                         [(n["id"], n["date"], json.dumps(n)) for n in INSIGHTS])
        conn.executemany("INSERT INTO testimonials VALUES (?, ?)",
                         [(t["id"], json.dumps(t)) for t in TESTIMONIALS])
    conn.commit()
