---
id: "db-skill"
name: "Database Skill"
description: "Hilft beim Erstellen von Datenbank-Migrationen, Seeds und Tabellenstrukturen (Postgres/Supabase)."
trigger: "/db"
inputs:
  [
    {
      "name": "migrationName",
      "type": "string",
      "required": true
    }
  ]
outputs:
  [
    {
      "name": "migrationFile",
      "type": "string"
    }
  ]
examples:
  [
    {
      "invoke": "/db migrationName=add_users_table",
      "result": {
        "migrationFile": "migrations/2026..._add_users_table.sql"
      }
    }
  ]
agent: true
category: "database"
notes: "Generiert SQL-Migrationen im `supabase/migrations` Ordner."
---

# Database Skill

Hilft beim Erstellen von Datenbank-Migrationen, Seeds und Tabellenstrukturen (Postgres/Supabase).

## Notes

Generiert SQL-Migrationen im `supabase/migrations` Ordner.
