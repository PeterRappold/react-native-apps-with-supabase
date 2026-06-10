---
id: "worker-skill"
name: "Worker"
description: "Erstellt erst Prototypen oder Proof-of-Concepts und führt danach konkrete Jobs wie Tests, Builds oder Scripts aus."
trigger: "/worker"
inputs:
  [
    {
      "name": "job",
      "type": "string",
      "required": true
    },
    {
      "name": "params",
      "type": "object",
      "required": false
    }
  ]
outputs:
  [
    {
      "name": "status",
      "type": "string"
    },
    {
      "name": "log",
      "type": "string"
    }
  ]
examples:
  [
    {
      "invoke": "/worker job=run-tests params={\"scope\":\"packages/shared-components\"}",
      "result": {
        "status": "started"
      }
    }
  ]
agent: true
category: "automation"
notes: "Worker erzeugen zuerst einen schnellen Prototypen und übernehmen danach die konkrete Ausführung; sie können von Manager/Planner delegiert werden."
---

# Worker

Erstellt erst Prototypen oder Proof-of-Concepts und führt danach konkrete Jobs wie Tests, Builds oder Scripts aus.

## Notes

Worker erzeugen zuerst einen schnellen Prototypen und übernehmen danach die konkrete Ausführung; sie können von Manager/Planner delegiert werden.
