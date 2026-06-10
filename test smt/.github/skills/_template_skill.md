---
id: "template-skill"
name: "Template Skill"
description: "Platzhalter-Skill. Ersetze Felder durch echte Skill-Daten aus der PDF."
trigger: "/template"
inputs:
  [
    {
      "name": "title",
      "type": "string",
      "required": true
    }
  ]
outputs:
  [
    {
      "name": "status",
      "type": "string"
    }
  ]
examples:
  [
    {
      "invoke": "/template title=\"Neuer Skill\"",
      "result": {
        "status": "created"
      }
    }
  ]
agent: false
notes: "Keine Emojis in Beschreibungen."
---

# Template Skill

Platzhalter-Skill. Ersetze Felder durch echte Skill-Daten aus der PDF.

## Notes

Keine Emojis in Beschreibungen.
