---
id: "storybook-skill"
name: "Storybook Skill"
description: "Erzeugt Storybook-Stories für Komponenten, baut Storybook und liefert Anweisungen zum lokalen Anzeigen."
trigger: "/storybook"
inputs:
  [
    {
      "name": "componentPath",
      "type": "string",
      "required": true
    },
    {
      "name": "storyKind",
      "type": "string",
      "required": false
    }
  ]
outputs:
  [
    {
      "name": "storyFile",
      "type": "string"
    },
    {
      "name": "storybookCommand",
      "type": "string"
    }
  ]
examples:
  [
    {
      "invoke": "/storybook componentPath=packages/shared-components/src/WorkoutCard.tsx",
      "result": {
        "storyFile": "packages/shared-components/stories/WorkoutCard.stories.tsx",
        "storybookCommand": "yarn workspace shared-components storybook"
      }
    }
  ]
agent: true
category: "developer-tools"
notes: "Erzeugt TypeScript-Story-Dateien; Anleitung zum Starten von Storybook in `skills.md`."
---

# Storybook Skill

Erzeugt Storybook-Stories für Komponenten, baut Storybook und liefert Anweisungen zum lokalen Anzeigen.

## Notes

Erzeugt TypeScript-Story-Dateien; Anleitung zum Starten von Storybook in `skills.md`.
