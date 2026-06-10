---
id: "discovery-skin"
name: "Discovery Skin"
description: "Scanne das Repository nach Design‑Tokens, Theme‑Variablen und Style‑Konventionen; liefere ein strukturiertes Token‑Verzeichnis und einen Report."
trigger: "/discovery-skin"
inputs:
  [
    {
      "name": "path",
      "type": "string",
      "required": false,
      "description": "Startpfad im Repo (default: Projekt-Root)"
    },
    {
      "name": "formats",
      "type": "string",
      "required": false,
      "description": "Kommagetrennte Formate: css,sass,ts,json"
    }
  ]
outputs:
  [
    {
      "name": "tokens",
      "type": "object"
    },
    {
      "name": "reportFile",
      "type": "string"
    }
  ]
examples:
  [
    {
      "invoke": "/discovery-skin path=packages/shared-components formats=ts,json",
      "result": {
        "reportFile": "reports/discovery_skin_shared_components.json"
      }
    }
  ]
agent: true
category: "design"
notes: "Der Skill sucht nach Farb-, Spacing- und Typografie‑Variablen, exportiert ein konsolidiertes Token‑Objekt und kann Report‑Dateien im `reports/` Ordner ablegen."
---

# Discovery Skin

Scanne das Repository nach Design‑Tokens, Theme‑Variablen und Style‑Konventionen; liefere ein strukturiertes Token‑Verzeichnis und einen Report.

## Notes

Der Skill sucht nach Farb-, Spacing- und Typografie‑Variablen, exportiert ein konsolidiertes Token‑Objekt und kann Report‑Dateien im `reports/` Ordner ablegen.
