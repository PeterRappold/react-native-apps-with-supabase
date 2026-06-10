# Meine Skills — kurze Doku

Das ist meine persönliche Kurz-Anleitung zu den Skill-Definitionen im Repo.

## Wo liegen die Skills

- Alle Skill-JSONs liegen in `.github/skills/`.

## Wie ich neue Skills anlege

1. Ich kopiere `_template_skill.json` nach `.github/skills/` und nenne die Datei aussagekräftig, zum Beispiel `mein_skill.json`.
2. Ich fülle `id`, `name`, `description`, `trigger`, `inputs`, `outputs`, `examples` und optional `agent`/`category` aus.
3. Ich committe die Datei ins Repo.

## Beispiel für ein Skill-JSON

```json
{
  "id": "mein-skill",
  "name": "Mein Skill",
  "description": "Kurzbeschreibung",
  "trigger": "/mein-skill",
  "inputs": [],
  "outputs": [],
  "examples": []
}
```

## Wie ich Skills benutze

- Ich rufe Skills über den direkten Slash-Trigger auf, zum Beispiel:

```bash
# Auth konfigurieren
/auth provider=supabase

# Story für eine Komponente erzeugen
/storybook componentPath=packages/shared-components/src/WorkoutCard.tsx
```

## Prototypen zuerst, dann Implementierung

- Bevor ich eine Komponente wirklich fertig baue, mache ich zuerst einen kleinen HTML/CSS-Prototypen oder Proof-of-Concept.
- Danach lasse ich die eigentliche Implementierung vom passenden Skill erzeugen oder vervollständigen.
- Der Agent koordiniert den Ablauf, der Worker setzt die konkrete Arbeit um.
- So gehe ich meistens vor: Idee testen, Prototyp prüfen, danach sauber implementieren und im Storybook anschauen.

## HTML/CSS-Prototyp

- Mein Prototyp liegt in `packages/app-prototype/prototype.html` und `packages/app-prototype/prototype.css`.
- Ich nutze diese Dateien als visuelle Vorlage für Layout, Farben, Abstände und Komponentenstruktur.
- Erst nachdem der Prototyp passt, übernehme ich ihn in die React-Native-Apps und Storybook-Stories.
- Wenn ich etwas ändere, starte ich immer beim HTML/CSS-Prototypen und ziehe die Änderungen danach in die Implementierung nach.

## Storybook

- Generierte Stories lege ich unter `packages/<package>/stories/` ab.
- Zum lokalen Start im Monorepo nutze ich:

```bash
yarn workspace shared-components storybook
```

## PDF → automatische Generierung

- Wenn ich die PDF mit den Skill-Beschreibungen habe, parse ich sie und erstelle für jeden Skill eine JSON-Datei in `.github/skills/`.
- Ablauf: PDF hochladen → ich parse → JSONs generieren → du prüfst → wir committen.

## Kurzfassung

- Template kopieren, Felder ausfüllen, committen.
- Skills rufe ich über ihren Slash-Trigger auf, z. B. `/agent` oder `/worker`.

### Lokal testen

Es gibt ein kleines Testskript, das die JSON-Skills lädt und einen Slash-Invoke syntaktisch prüft:

```bash
python3 .github/skills/run_skill.py "/agent command=deploy options={\"env\":\"staging\"}"
```

Das Skript validiert nur Syntax und Pflichfelder; es führt keine echten Aktionen aus.

## Detaillierte Beschreibungen der einzelnen Skills

### `template-skill`

- Was ich damit gemacht habe: Eine Vorlage, die ich kopiere, wenn ich neue Skills anlege.
- Wie ich sie nutze: Datei kopieren, Felder ausfüllen, committen.
- Beispiel: Die Vorlage heißt `_template_skill.json` und enthält das benötigte Schema.
- Hinweis: `agent` ist normalerweise `false` für das Template.

### `auth-skill`

- Was ich damit gemacht habe: Konfiguriere Authentifizierung (Signup, Login, Token-Refresh). Ich habe Unterstützung für Supabase und OAuth vorgesehen.
- Wie ich sie nutze: Ich rufe den Trigger auf und übergebe Provider-Optionen.
- Beispiel:

```bash
/auth provider=supabase
```

- Ausgabe: Konfigurationshinweise oder generierte Auth-Stubbs. In Projekten lege ich zugehörige Dateien in `supabase/` oder `apps/<app>/` ab, je nach Bedarf.

### `db-skill`

- Was ich damit gemacht habe: Generiere SQL-Migrationen, Seeds und helfe beim Entwurf von Tabellen (Postgres/Supabase).
- Wie ich sie nutze: Migration benennen und ausführen lassen; die Migration wird unter `supabase/migrations/` abgelegt.
- Beispiel:

```bash
/db migrationName=add_users_table
```

- Ausgabe: SQL-Datei mit dem Migrations-SQL, die ich anschließend reviewe und einspiele.

### `storybook-skill`

- Was ich damit gemacht habe: Erzeuge Storybook-Stories für Komponenten automatisch und liefere den empfohlenen Start-Befehl.
- Wie ich sie nutze: Pfad zur Komponente angeben; die Story lege ich unter `packages/<package>/stories/` ab.
- Beispiel:

```bash
/storybook componentPath=packages/shared-components/src/WorkoutCard.tsx
```

- Ausgabe: `packages/shared-components/stories/WorkoutCard.stories.tsx` und der Hinweis, wie ich Storybook lokal starte (`yarn workspace shared-components storybook`).

### `api-skill`

- Was ich damit gemacht habe: Erstelle Boilerplate für API-Endpunkte (REST/GraphQL), OpenAPI-Specs und Client-Stubs.
- Wie ich sie nutze: Typ und Resource angeben; Dateien werden unter `src/api/` und `openapi/` erzeugt.
- Beispiel:

```bash
/api type=rest resource=users
```

- Ausgabe: Beispiel-Files wie `src/api/users.ts` und `openapi/users.yaml` für eine schnelle Integration.

### `planner`

- Was ich damit gemacht habe: Ich nutze `planner`, um größere Aufgaben zu gliedern, Prioritäten zu setzen und TODO-Pläne zu exportieren.
- Wie ich sie nutze: `task` und optional `due` übergeben; der Planner liefert ein `planId` zurück.
- Beispiel:

```bash
/planner task="Prepare release" due=2026-06-20
```

### `worker`

- Was ich damit gemacht habe: `worker` erstellt zuerst Prototypen oder Proof-of-Concepts und führt danach konkrete Jobs aus — Tests, Builds oder Shell-Commands.
- Wie ich sie nutze: `job` und `params` angeben; Ergebnis ist `status` und `log`.
- Beispiel:

```bash
/worker job=run-tests params={"scope":"packages/shared-components"}
```

### `manager`

- Was ich damit gemacht habe: `manager` orchestriert Planner und Worker, startet Abläufe und fasst Ergebnisse zusammen.
- Wie ich sie nutze: `action` angeben (z. B. `orchestrate`) und Ziel (`target`).
- Beispiel:

```bash
/manager action=orchestrate target=release
```

### `discovery-skin`

- Was ich damit gemacht habe: `discovery-skin` durchsucht den Code nach Design-Tokens (Farben, Abstände, Schriftgrößen, Variablen), extrahiert sie und liefert ein konsolidiertes Token-Objekt.
- Wie ich sie nutze: Optional `path` angeben (Standard: Repo-Root) und `formats` (z. B. `ts,json,css`). Der Skill erstellt eine `reportFile` im `reports/` Ordner.
- Beispiel:

```bash
/discovery-skin path=packages/shared-components formats=ts,json
```

- Ausgabe: Eine JSON-Datei unter `reports/` mit allen gefundenen Tokens sowie ein `tokens`-Objekt, das ich direkt in Themes oder Build-Pipelines importieren kann.

### `agent`

- Was ich damit gemacht habe: `agent` steuert den Ablauf insgesamt, stößt zuerst Prototypen an und delegiert danach die Implementierung an die passenden Skills.
- Wie ich sie nutze: `command` und optionale `options` übergeben; der Agent liefert ein `outcome` zurück.
- Beispiel:

```bash
/agent command="prototype-then-implement" options={"feature":"storybook component"}
```

- Ausgabe: Koordinierter Ablauf mit Prototyp, Implementierung und anschließender Storybook-Prüfung.
