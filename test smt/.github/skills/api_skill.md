---
id: "api-skill"
name: "API Skill"
description: "Erzeugt Basis-Endpunkte (REST/GraphQL), Beispiel-OpenAPI-Specs und Client-Stubbs für Projekte."
trigger: "/api"
inputs:
  [
    {
      "name": "type",
      "type": "string",
      "required": true,
      "description": "rest|graphql"
    },
    {
      "name": "resource",
      "type": "string",
      "required": true
    }
  ]
outputs:
  [
    {
      "name": "files",
      "type": "array"
    }
  ]
examples:
  [
    {
      "invoke": "/api type=rest resource=users",
      "result": {
        "files": [
          "src/api/users.ts",
          "openapi/users.yaml"
        ]
      }
    }
  ]
agent: true
category: "backend"
notes: "Platzhalter-Skill; wird angepasst sobald die PDF mit den echten Skill-Beschreibungen vorliegt."
---

# API Skill

Erzeugt Basis-Endpunkte (REST/GraphQL), Beispiel-OpenAPI-Specs und Client-Stubbs für Projekte.

## Notes

Platzhalter-Skill; wird angepasst sobald die PDF mit den echten Skill-Beschreibungen vorliegt.
