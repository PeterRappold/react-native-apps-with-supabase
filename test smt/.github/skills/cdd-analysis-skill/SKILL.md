---
id: cdd-analysis-skill
name: CDD Analysis Skill
description: Analyzes an HTML prototype, injects tracking IDs, and categorizes UI components.
trigger: /cdd-analysis
inputs:
  - name: prototypePath
    type: string
    required: true
---

# Instructions

## Atome
Atome sind die kleinsten unteilbaren Bausteine einer UI, wie Buttons, Inputs, Labels oder Icons. 
Erkenne sie anhand grundlegender HTML-Tags wie <button>, <input>, <a> oder elementaren <div>-Knoten, die nicht weiter unterteilt werden.

## Moleküle
Moleküle sind Gruppierungen von Atomen, die gemeinsam eine funktionale Einheit bilden. 
Beispiele: Ein Suchfeld (Input + Button), eine Profilkarte (Bild + Text), ein Listen-Element.
Erkenne sie, wenn mehrere Atome semantisch und visuell in einem Container gruppiert sind.

## Organismen
Organismen sind komplexe, eigenständige UI-Komponenten, die aus Molekülen und/oder Atomen bestehen. 
Beispiele: Eine Navigation Bar, ein Formular, ein Dashboard-Widget.
Erkenne sie als große funktionale Blöcke, die eine eigenständige Sektion auf der Seite bilden.

## Konsolidierung & Workflow Checkpointing
- **Current State:** Der aktuelle Stand der Konvertierung (siehe workflow-progress.json).
- **Delta-Updates:** Wenn das Parsing-Skript beim nächsten Durchlauf geänderte Datei-Hashes meldet, aktualisiere die workflow-progress.json. Prüfe Dependencies: Wenn sich ein Atom ändert, müssen abhängige Moleküle als 'needs_update' markiert werden. Nur geänderte oder neue Komponenten werden neu generiert.
