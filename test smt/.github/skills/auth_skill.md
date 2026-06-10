---
id: "auth-skill"
name: "Authentication Skill"
description: "Erstellt und verwaltet Authentifizierungsflüsse (Signup, Login, Token-Refresh) für Projekte."
trigger: "/auth"
inputs:
  [
    {
      "name": "provider",
      "type": "string",
      "required": false
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
      "name": "result",
      "type": "object"
    }
  ]
examples:
  [
    {
      "invoke": "/auth provider=supabase",
      "result": {
        "result": "auth-configured"
      }
    }
  ]
agent: true
category: "authentication"
notes: "Unterstützt Supabase- und OAuth-basierte Provider."
---

# Authentication Skill

Erstellt und verwaltet Authentifizierungsflüsse (Signup, Login, Token-Refresh) für Projekte.

## Notes

Unterstützt Supabase- und OAuth-basierte Provider.
