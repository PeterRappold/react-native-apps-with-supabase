---
id: "agent-skill"
name: "Agent"
description: "Genereller Agent, der zuerst Prototypen anstößt, dann Skills aufruft, Entscheidungen trifft und delegiert (z. B. deploy, rollback)."
trigger: "/agent"
inputs:
  [
    {
      "name": "command",
      "type": "string",
      "required": true
    },
    {
      "name": "options",
      "type": "object",
      "required": false
    }
  ]
outputs:
  [
    {
      "name": "outcome",
      "type": "object"
    }
  ]
examples:
  [
    {
      "invoke": "/agent command=\"deploy\" options={\"env\":\"staging\"}",
      "result": {
        "outcome": "deploy_started"
      }
    }
  ]
agent: true
category: "automation"
notes: "Nutze `Agent` für höhere Steuerungslogik, Prototyping vor der Implementierung und Entscheidungen."
---

# Agent

Genereller Agent, der zuerst Prototypen anstößt, dann Skills aufruft, Entscheidungen trifft und delegiert (z. B. deploy, rollback).

## Notes

Nutze `Agent` für höhere Steuerungslogik, Prototyping vor der Implementierung und Entscheidungen.
