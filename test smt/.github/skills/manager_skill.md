---
id: "manager-skill"
name: "Manager"
description: "Koordiniert Planner und Worker, startet Orchestrierungen und fasst Ergebnisse zusammen."
trigger: "/manager"
inputs:
  [
    {
      "name": "action",
      "type": "string",
      "required": true
    },
    {
      "name": "target",
      "type": "string",
      "required": false
    }
  ]
outputs:
  [
    {
      "name": "result",
      "type": "object"
    }
  ]
examples:
  [
    {
      "invoke": "/manager action=orchestrate target=release",
      "result": {
        "result": "orchestration_started"
      }
    }
  ]
agent: true
category: "orchestration"
notes: "Manager delegiert an Worker und überwacht den Fortschritt."
---

# Manager

Koordiniert Planner und Worker, startet Orchestrierungen und fasst Ergebnisse zusammen.

## Notes

Manager delegiert an Worker und überwacht den Fortschritt.
