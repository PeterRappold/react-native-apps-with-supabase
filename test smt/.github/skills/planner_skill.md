---
id: "planner-skill"
name: "Planner"
description: "Plane Aufgaben, priorisiere sie und exportiere strukturierte Pläne (TODOs)."
trigger: "/planner"
inputs:
  [
    {
      "name": "task",
      "type": "string",
      "required": true
    },
    {
      "name": "due",
      "type": "string",
      "required": false
    },
    {
      "name": "meta",
      "type": "object",
      "required": false
    }
  ]
outputs:
  [
    {
      "name": "planId",
      "type": "string"
    },
    {
      "name": "plan",
      "type": "object"
    }
  ]
examples:
  [
    {
      "invoke": "/planner task=\"Release v1\" due=2026-06-15",
      "result": {
        "planId": "plan_123"
      }
    }
  ]
agent: true
category: "orchestration"
notes: "Erstellt strukturierte Pläne, die Worker ausführen können."
---

# Planner

Plane Aufgaben, priorisiere sie und exportiere strukturierte Pläne (TODOs).

## Notes

Erstellt strukturierte Pläne, die Worker ausführen können.
