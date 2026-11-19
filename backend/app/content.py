"""Fiktive Demo-Inhalte für Sterling & Partner Rechtsanwälte."""

PRACTICE_AREAS = [
    {"slug": "business-litigation", "name": "Wirtschaftsrecht", "icon": "briefcase", "image": "/images/courthouse.jpg",
     "summary": "Vertragsstreitigkeiten, Gesellschafterkonflikte und Handelssachen – entschlossen geführt.",
     "description": "Wenn ein Rechtsstreit Ihr Unternehmen bedroht, brauchen Sie Prozessanwälte, die wirtschaftlich denken. Wir vertreten Gründer, Familienunternehmen und Mittelständler vor Landgerichten, Oberlandesgerichten und Schiedsgerichten – und wir wissen, wann ein kluger Vergleich besser ist als ein langer Rechtsstreit.",
     "services": ["Vertragsverletzungen", "Gesellschafterstreitigkeiten", "Wettbewerbsverbote", "Schutz von Geschäftsgeheimnissen", "Handelsschiedsverfahren"]},
    {"slug": "personal-injury", "name": "Personenschäden", "icon": "heart-pulse", "image": "/images/justice.jpg",
     "summary": "Schmerzensgeld und Schadensersatz nach schweren Unfällen – mit transparenten Honoraren.",
     "description": "Nach einem schweren Unfall handeln Versicherer schnell. Wir auch. Unser Team sichert Beweise, arbeitet mit medizinischen Gutachtern zusammen und verhandelt aus einer Position der Stärke. Wenn nötig, setzen wir Ihre Ansprüche vor Gericht durch. Die Deckung Ihrer Rechtsschutzversicherung klären wir für Sie.",
     "services": ["Verkehrsunfälle mit Pkw und Lkw", "Arbeits- und Wegeunfälle", "Arzthaftung", "Verletzung der Verkehrssicherungspflicht", "Hinterbliebenengeld"]},
    {"slug": "estate-planning", "name": "Erbrecht & Nachfolge", "icon": "scroll", "image": "/images/signing.jpg",
     "summary": "Testamente, Erbverträge und Unternehmensnachfolge, die Ihre Familie schützen.",
     "description": "Eine klare Regelung erspart Ihrer Familie Streit, Kosten und Unsicherheit. Wir gestalten Testamente und Erbverträge in verständlicher Sprache, planen die Unternehmensnachfolge und begleiten Erben und Testamentsvollstrecker umsichtig durch den Nachlass.",
     "services": ["Testamente & Erbverträge", "Vorsorgevollmacht & Patientenverfügung", "Unternehmensnachfolge", "Pflichtteilsansprüche", "Testamentsvollstreckung"]},
    {"slug": "family-law", "name": "Familienrecht", "icon": "users", "image": "/images/contract.jpg",
     "summary": "Scheidung, Sorgerecht und Unterhalt – diskret und mit klarem Kurs begleitet.",
     "description": "Familiäre Angelegenheiten sind persönlich. Wir hören zuerst zu, schützen die Interessen Ihrer Kinder und Ihre finanzielle Zukunft und setzen auf Mediation, wenn sie Ihnen dient – bereiten aber jedes Verfahren so vor, als ginge es vor Gericht.",
     "services": ["Scheidung & Trennung", "Sorge- und Umgangsrecht", "Kindes- und Ehegattenunterhalt", "Eheverträge", "Mediation"]},
    {"slug": "real-estate-law", "name": "Immobilienrecht", "icon": "building", "image": "/images/office.jpg",
     "summary": "Gewerbemietverträge, Immobilienkäufe und Grundstücksstreitigkeiten – sauber abgewickelt.",
     "description": "Vom ersten Gewerbemietvertrag bis zur Transaktion mit mehreren Objekten: Wir verhandeln Konditionen, führen die Due Diligence durch und klären Grundbuch- und Grenzstreitigkeiten, damit Ihr Vorhaben pünktlich zum Abschluss kommt.",
     "services": ["Gewerbliches Mietrecht", "Immobilienkaufverträge", "Grundbuchstreitigkeiten", "Bau- und Planungsrecht", "Miet- und Räumungsprozesse"]},
    {"slug": "employment-law", "name": "Arbeitsrecht", "icon": "scale", "image": "/images/books.jpg",
     "summary": "Beratung für Arbeitgeber und Arbeitnehmer zu Verträgen, Kündigungen und Diskriminierung.",
     "description": "Wir unterstützen Arbeitgeber bei rechtssicheren Regelungen und verteidigen sie gegen Klagen. Ebenso stehen wir Arbeitnehmern zur Seite, wenn es um Kündigung, Diskriminierung oder ausstehende Vergütung geht.",
     "services": ["Arbeitsverträge", "Kündigungsschutzklagen", "AGG & Diskriminierung", "Aufhebungsverträge & Abfindungen", "Betriebsverfassungsrecht"]},
]

ATTORNEYS = [
    {"slug": "eleanor-sterling", "name": "Dr. Eleanor Sterling", "title": "Gründungspartnerin", "image": "/images/attorney-2.jpg",
     "practice": ["business-litigation", "employment-law"], "years": 24, "email": "e.sterling@sterling-partner.example",
     "bio": "Eleanor Sterling gründete die Kanzlei 2002 nach acht Jahren als Staatsanwältin. Sie hat mehr als 60 Verfahren bis zum Urteil geführt und ist dafür bekannt, komplexe Wirtschaftsstreitigkeiten für Gerichte klar und überzeugend aufzubereiten.",
     "education": ["Promotion (Dr. iur.), Goethe-Universität Frankfurt", "Zweites Juristisches Staatsexamen, Hessen"],
     "admissions": ["Rechtsanwaltskammer Frankfurt am Main", "Fachanwältin für Handels- und Gesellschaftsrecht"]},
    {"slug": "markus-hahn", "name": "Markus Hahn", "title": "Partner, Prozessführung", "image": "/images/attorney-1.jpg",
     "practice": ["personal-injury", "business-litigation"], "years": 17, "email": "m.hahn@sterling-partner.example",
     "bio": "Markus Hahn leitet unser Prozessteam. Er hat für verletzte Mandanten Ersatzleistungen von mehr als 60 Mio. € durchgesetzt und ist Lehrbeauftragter für Zivilprozessrecht an der Universität Mainz.",
     "education": ["Erstes und Zweites Staatsexamen, Universität Heidelberg", "LL.M., King’s College London"],
     "admissions": ["Rechtsanwaltskammer Frankfurt am Main", "Fachanwalt für Verkehrsrecht"]},
    {"slug": "daniel-okafor", "name": "Daniel Okafor", "title": "Partner, Privatmandanten", "image": "/images/attorney-3.jpg",
     "practice": ["estate-planning", "real-estate-law"], "years": 15, "email": "d.okafor@sterling-partner.example",
     "bio": "Daniel Okafor berät Familien und Unternehmer bei Nachfolgeplanung, Testamenten und Immobilienvermögen – mit dem Ziel, Regelungen einfach und Kosten planbar zu halten.",
     "education": ["Erstes und Zweites Staatsexamen, LMU München", "Master of Taxation, Universität Münster"],
     "admissions": ["Rechtsanwaltskammer Düsseldorf", "Fachanwalt für Erbrecht"]},
    {"slug": "jonas-richter", "name": "Jonas Richter", "title": "Rechtsanwalt", "image": "/images/attorney-4.jpg",
     "practice": ["family-law", "employment-law"], "years": 8, "email": "j.richter@sterling-partner.example",
     "bio": "Jonas Richter betreut familien- und arbeitsrechtliche Mandate. Mandanten schätzen seine Ruhe in schwierigen Momenten und seine akribische Vorbereitung.",
     "education": ["Erstes und Zweites Staatsexamen, Universität zu Köln", "Zertifizierter Mediator"],
     "admissions": ["Rechtsanwaltskammer Düsseldorf", "Fachanwalt für Arbeitsrecht"]},
]

RESULTS = [
    {"id": 1, "amount": 2400000, "label": "Urteil", "category": "personal-injury", "year": 2025,
     "title": "Schwerer Lkw-Unfall", "summary": "Schmerzensgeld, Verdienstausfall und Pflegemehrbedarf für einen Kurierfahrer, der nach einem Auffahrunfall dauerhaft schwer verletzt ist."},
    {"id": 2, "amount": 8750000, "label": "Vergleich", "category": "business-litigation", "year": 2025,
     "title": "Abfindung eines Minderheitsgesellschafters", "summary": "Vollständige Abfindung zum Verkehrswert für einen Gesellschafter, der aus einem Familienunternehmen gedrängt werden sollte."},
    {"id": 3, "amount": 3100000, "label": "Schiedsspruch", "category": "business-litigation", "year": 2024,
     "title": "Verletzung einer Exklusivlizenz", "summary": "Schiedsspruch zugunsten eines SaaS-Start-ups, dessen Plattform ein Vertriebspartner entgegen einer Exklusivlizenz weiterverkaufte."},
    {"id": 4, "amount": 1200000, "label": "Vergleich", "category": "employment-law", "year": 2024,
     "title": "Nachzahlung von Überstunden", "summary": "Nachzahlung nicht vergüteter Überstunden für 140 Lagerbeschäftigte nach einer unwirksamen Pauschalabgeltung."},
    {"id": 5, "amount": 650000, "label": "Vergleich", "category": "personal-injury", "year": 2024,
     "title": "Verletzte Verkehrssicherungspflicht", "summary": "Vergleich für eine Kundin, die in der Filiale einer bundesweiten Handelskette von einem umstürzenden Regal verletzt wurde."},
    {"id": 6, "amount": 0, "label": "Klageabweisung", "category": "real-estate-law", "year": 2023,
     "title": "Abwehr einer Grundbuchklage", "summary": "Vollständige Abweisung einer Grundbuchberichtigungsklage über 5 Mio. € gegen eine gewerbliche Vermieterin."},
]

INSIGHTS = [
    {"id": 1, "title": "Fünf Klauseln, die in keinem Gewerbemietvertrag fehlen sollten", "category": "Immobilienrecht", "date": "2026-10-28", "minutes": 6,
     "excerpt": "Wertsicherung, Untervermietung und Schriftform: worauf Mieter und Vermieter 2026 achten sollten."},
    {"id": 2, "title": "Die ersten 72 Stunden nach einem schweren Unfall", "category": "Schadensersatz", "date": "2026-10-09", "minutes": 4,
     "excerpt": "Welche Schritte Beweise sichern und Ihre Ansprüche schützen, bevor Sie mit einer Versicherung sprechen."},
    {"id": 3, "title": "Testament oder Erbvertrag? Ein verständlicher Vergleich", "category": "Erbrecht", "date": "2026-09-17", "minutes": 7,
     "excerpt": "Kosten, Bindungswirkung, Pflichtteil und Flexibilität: So finden Sie die passende Grundlage für Ihre Nachfolge."},
    {"id": 4, "title": "Wann ist ein nachvertragliches Wettbewerbsverbot wirksam?", "category": "Arbeitsrecht", "date": "2026-08-30", "minutes": 5,
     "excerpt": "Karenzentschädigung, Dauer und Reichweite: Was Arbeitgeber und Arbeitnehmer jetzt wissen müssen."},
]

TESTIMONIALS = [
    {"id": 1, "quote": "Das Team von Dr. Sterling hat sich unseres Rechtsstreits angenommen, als wäre es der eigene. Das Ergebnis hat alle Erwartungen übertroffen.", "author": "Geschäftsführer, regionales Logistikunternehmen", "rating": 5},
    {"id": 2, "quote": "Nach meinem Unfall konnte ich kaum einen klaren Gedanken fassen. Herr Hahn hat jeden Schritt erklärt und um jeden Euro gekämpft.", "author": "Ehemaliger Mandant, Personenschaden", "rating": 5},
    {"id": 3, "quote": "Herr Okafor hat unsere Nachfolge verständlich geregelt. Zum ersten Mal haben meine Frau und ich das Gefühl, dass unsere Kinder abgesichert sind.", "author": "Privatmandant, Taunus", "rating": 5},
]

OFFICES = [
    {"city": "Frankfurt am Main", "address": "Adresse Standort 1", "phone": "Telefonnummer Standort 1", "hours": "Mo–Fr 8:30–18:30 Uhr"},
    {"city": "Düsseldorf", "address": "Adresse Standort 2", "phone": "Telefonnummer Standort 2", "hours": "Mo–Fr 9:00–17:30 Uhr"},
]

PRACTICE_SLUGS = tuple(p["slug"] for p in PRACTICE_AREAS)
