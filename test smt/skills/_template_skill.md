---
id: "template-skill"
name: "Template Skill"
description: "Platzhalter-Skill. Ersetze Felder durch echte Skill-Daten aus der PDF."
trigger: "/create-skill"
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
      "invoke": "/create-skill title=\"Neuer Skill\"",
      "result": {
        "status": "created"
      }
    }
  ]
notes: "Kein Emoji in Beschreibungen."
---

# Template Skill

Platzhalter-Skill. Ersetze Felder durch echte Skill-Daten aus der PDF.

## Notes

Kein Emoji in Beschreibungen.
