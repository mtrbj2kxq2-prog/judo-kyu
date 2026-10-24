# Judo Kyu-Prüfung

Lern-App für die Kyu-Prüfungen im Deutschen Judo-Bund (Programm Stand 01.02.2024):
Gürtel wählen, Prüfungsinhalte abhaken, Begriffe und Techniken im Quiz üben.
Läuft offline und lässt sich auf dem Handy installieren.

- Starten: Ordner über einen Webserver ausliefern, z. B. `python3 -m http.server`, dann `http://localhost:8000` öffnen
- Tests: `npm install` (einmalig), dann `npm test`

Dateien: `data.js` (Prüfungsinhalte), `logik.js` (Fortschritt, Quiz), `fehler.js` (Fehlerbericht),
`app.js` (Oberfläche), `sw.js` (Offline-Modus). Schrift: Barlow (SIL Open Font License, `fonts/`).
