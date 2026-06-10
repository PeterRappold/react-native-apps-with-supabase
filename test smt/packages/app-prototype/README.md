# App Prototype

Dieses Package bündelt den visuellen Prototypen für die Workout-Apps.

Die eigentliche Vorlage liegt in `prototype.html` und `prototype.css`.
Der kanonische Ort für veröffentlichte Prototypen im Repo ist jetzt `docs/ui/prototypes/<app-name>/`.
Für diese App wurden die Bildschirmdateien unter `docs/ui/prototypes/workout-app/` angelegt (Landing, Login, Registration, Overview) plus eine gemeinsame `style.css`.

So arbeite ich damit:

1. Öffne die gewünschten Bildschirmdateien unter `docs/ui/prototypes/workout-app/` im Browser (z. B. `docs/ui/prototypes/workout-app/auth/landing.html`).
2. Prüfe Layout, Abstände, Texte und Flow.
3. Übernehme Änderungen in die React-Native-Implementierung und in Storybook‑Stories.
4. Halte `packages/app-prototype` als Referenz und ggf. Exportmodule für automatisierte Inhalte.

Wenn ich den Prototyp aktualisiere, versioniere Änderungen im `docs/` Ordner und passe `packages/app-prototype` an, falls etwas als Codeexport benötigt wird.
