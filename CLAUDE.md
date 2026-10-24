# Judo Kyu-Prüfungs-App – Übergabe

## Ziel
Lern-App für Judo-Gürtelprüfungen nach dem offiziellen Programm des Deutschen Judo-Bunds (DJB).
Nutzer wählt seinen Gürtel und sieht alle Prüfungsinhalte, hakt ab, was er kann, und übt mit einem Quiz.

Quelle (verbindlich): „Anforderungen für Kyu-Grade im DJB", Stand 1. Februar 2024
https://www.judobund.de/fileadmin/user_upload/judobund.de/Downloads/Downloadcenter/Kyu-Graduierungen/Anforderungen_fuer_Kyu-Grade_2024.pdf

## Tech-Stack (festgelegt)
- Vanilla HTML/CSS/JavaScript, kein Framework, kein Build-Schritt
- Progressive Web App: `manifest.json` + Service Worker (offline nutzbar, auf dem Handy installierbar)
- Fortschritt in `localStorage` (pro Gürtel), keine Konten, kein Backend
- Daten (TECH, BELTS, VOCAB) getrennt von der UI-Logik halten, z. B. in `data.js`

## Fehlerbericht (wie in der Drahtwerk-App fz2-tool)
- Programmfehler automatisch lokal mitschreiben (`error` / `unhandledrejection`), max. 40 Einträge; der Logger selbst darf nie crashen
- Fehler-Knopf in der Kopfzeile, wird rot, sobald Fehler erfasst sind
- Fehlerfenster: Feld „Was stimmt nicht?", optional Foto/Screenshot, automatischer Schnappschuss (Ansicht, gewählter Gürtel, App-Version, Gerät)
- Senden per E-Mail (fertige Mail), Teilen (z. B. WhatsApp) oder Text kopieren
- Wochenbericht-Banner, wenn eine Woche vorbei ist und Fehler gesammelt wurden
- Empfänger: tigga232332@gmail.com (dieselbe Adresse wie fz2-tool)
- Kein Benutzername/Login – die App hat keine Konten

## Format
- Datum/Uhrzeit immer im deutschen Format (TT.MM.JJJJ, 24h)

## Stand
Es gibt einen funktionierenden Prototyp als Single-File-HTML (judo-kyu.html). Falls die Datei im Ordner liegt: Daten (Konstanten TECH, BELTS, VOCAB) daraus übernehmen. Sonst aus dieser Übergabe neu aufbauen.

## Funktionen (beibehalten)
1. Gürtelauswahl 8. bis 1. Kyu, Gürtel als Farbbalken (zweifarbig bei weiß-gelb, gelb-orange, orange-grün).
2. Pro Gürtel Checkliste der Prüfungsinhalte, gruppiert (Fallen, Würfe, Boden, Randori …).
3. Wahltechniken: Pool mit Zähler „x / benötigt", Pflichttechniken markiert.
4. Pro Technik Button „Video" → YouTube-Suche "<Technik> judo".
5. Quiz, 10 Fragen pro Runde: Technik → Gruppe (nur Techniken bis zum gewählten Gürtel) und japanische Begriffe → Bedeutung.
6. Fortschritt pro Gürtel lokal gespeichert, zurücksetzbar.
7. Mobil zuerst, Hell/Dunkel-Modus.

## Offene Punkte / Ideen
- Feste, geprüfte Video-Links pro Technik statt YouTube-Suche.
- Kurze Erklärung pro Technik (Kuzushi, Ausführung, typische Fehler).
- Synchronisation des Fortschritts zwischen Geräten?
- Annahme: Vokabel-Bedeutungen sind Standardübersetzungen, nicht aus dem DJB-Dokument.

## Gruppen
Te-waza (Handwurf), Koshi-waza (Hüftwurf), Ashi-waza (Fußwurf), Sutemi-waza (Opferwurf), Osaekomi-waza (Haltegriff), Kansetsu-waza (Hebel), Shime-waza (Würger)

## Technik-Pools
Würfe Grundprogramm:
- Te: Seoi-nage, Ippon-seoi-nage, Tai-otoshi
- Koshi: O-goshi, Uki-goshi, Koshi-guruma, Tsurikomi-goshi, Sode-tsurikomi-goshi, Harai-goshi
- Ashi: De-ashi-harai, O-soto-gari, O-uchi-gari, Ko-uchi-gari, Ko-soto-gari/-gake, Sasae-tsurikomi-ashi, Uchi-mata

Würfe Erweiterungsprogramm (3.–1. Kyu):
- Te: Kata-guruma, Uki-otoshi
- Koshi: Tsuri-goshi, Utsuri-goshi
- Ashi: Ashi-guruma, Okuri-ashi-harai
- Sutemi: Tomoe-nage, Sumi-gaeshi, Ura-nage, Tani-otoshi, Soto-makikomi, Ko-uchi-makikomi

Boden Grundprogramm:
- Halten: Kuzure-kesa-gatame, Kesa-gatame, Yoko-shiho-gatame, Kami-shiho-gatame, Tate-shiho-gatame
- Hebel: Juji-gatame, Ude-garami
- Würger: Gyaku-juji-jime, Okuri-eri-jime

Boden Erweiterungsprogramm:
- Halten: Kata-gatame, Kuzure-kami-shiho-gatame, Ushiro-kesa-gatame, Ura-gatame, Uki-gatame
- Hebel: Waki-gatame, Ude-gatame, Hiza-gatame, Sankaku-gatame
- Würger: Katate-jime, Kataha-jime, Hadaka-jime, Sode-guruma-jime, Sankaku-jime, Tsukkomi-jime

Basispool Würfe 7./6. Kyu: Seoi-nage, Ippon-seoi-nage, Tai-otoshi, O-goshi, Uki-goshi, O-soto-gari, De-ashi-harai, O-uchi-gari
Ab 5. Kyu zusätzlich: Tsurikomi-goshi, Sode-tsurikomi-goshi, Harai-goshi, Sasae-tsurikomi-ashi, Ko-uchi-gari, Uchi-mata

## Pro Gürtel
8. Kyu weiß-gelb: nur Grundverständnis – Werte/Etikette, sicher fallen, kontrolliert werfen, am Boden auf den Rücken bringen und halten, Abklopfen = Stopp.

7. Kyu gelb:
- Fallen aus dem Stand rückwärts, seitwärts, Rolle (eine Seite); als Uke Ausgangssituationen herstellen; einfache Verteidigung gegen Haltegriffe
- 3 Würfe aus Basispool (1 Eindreh Hauptseite, 1 Gegenseite, 1 Fußtechnik)
- Halten Pflicht: Kesa-, Tate-shiho-, Yoko-shiho-, Kami-shiho-gatame; 2 Haltegriffwechsel; Übergang Wurf→Halten
- je 2 Aufgaben-Randori Stand/Boden à 2 Min

6. Kyu gelb-orange:
- Fallen aus dem Stand beidseitig (rückwärts mit Rolle, seitwärts, Rolle vorwärts)
- 6 Würfe aus Basispool (2 Hauptseite, 2 Gegenseite, 2 Fuß)
- 4 weitere Haltegriffe (Varianten erlaubt); 3 Haltegriffwechsel; Umdrehen aus Bauchlage
- 1 offizieller Wettkampf (Judopass) oder je 2 Randori Stand/Boden à 2 Min

5. Kyu orange:
- Fallen aus dem Gehen beidseitig; Ausgangssituationen herstellen; Abwehr gegen Hebel
- 9 Würfe (3/3/3)
- 4 Befreiungen: auf den Bauch drehen, Bein klammern, Gegner zwischen die Beine nehmen, mit Brücke überrollen
- Wiederholung 7.–6. Kyu; Beinklammer lösen; Angriff gegen Bankposition
- 2 Wettkämpfe oder Randori à 2 Min

4. Kyu orange-grün:
- Fallen aus zügiger Bewegung beidseitig; Ausgangssituationen; Abwehr Hebel
- 12 Würfe aus dynamischen Situationen, Pflicht O-soto-gari, Harai-goshi, Uchi-mata
- 3 Hebel, Pflicht Juji-gatame, Ude-garami
- Wiederholung 7.–5. Kyu; Angriff aus eigener Rückenlage; Angriff gegen gegnerische Rückenlage
- 2 Wettkämpfe oder Randori à 2 Min

3. Kyu grün:
- zusätzlich freier Fall; Abwehr Hebel
- 15 Würfe (3 aus Erweiterung), Pflicht Tomoe-nage, Tani-otoshi; je 1 Konter, Finte, Kombination
- 4 Hebel aus Erweiterung, Pflicht Hiza-gatame, Sankaku-gatame
- Wiederholung 7.–4. Kyu; 1 Positionswechsel Verteidigung→Angriff
- 3 Wettkämpfe oder Randori à 3 Min

2. Kyu blau:
- alle bisherigen Falltechniken; Abwehr gegen Würger
- 18 Würfe (6 aus Erweiterung), Pflicht Sumi-gaeshi, Soto-makikomi; je 1 Konter/Finte/Kombi (DJB-Musterlösungen); Grifferarbeitung inkl. Griff lösen mit Wurf in Ai-yotsu und Kenka-yotsu
- 3 Würger, Pflicht Gyaku-juji-jime, Okuri-eri-jime (als Koshi-jime)
- Wiederholung 7.–4. Kyu; 2 Positionswechsel
- 3 Wettkämpfe oder Randori à 3 Min

1. Kyu braun:
- alle bisherigen Falltechniken; Abwehr gegen alle Bodentechniken
- 20 Würfe (9 aus Erweiterung), Pflicht Ura-nage, Ko-uchi-makikomi; je 2 Konter, Finten, Kombinationen
- 4 Würger, Pflicht Sode-guruma-jime, Okuri-eri-jime (als Rollwürger)
- Wiederholung 7.–4. Kyu; Übergang Stand/Boden aus Ai-yotsu und Kenka-yotsu; 3 Positionswechsel
- Persönlicher Schwerpunkt: ca. 10 Aktionen aus Randori/Wettkampf, Kata, Selbstverteidigung oder Taiso
- 3 Wettkämpfe oder Randori à 3 Min

Ähnliche Techniken/Mischformen dürfen ersetzt werden (z. B. Ko-soto-gari/-gake, O-goshi/Tsuri-goshi).

## Quiz-Vokabeln
Tori = führt die Technik aus; Uke = nimmt die Technik an; Ukemi = Falltechnik; Nage-waza = Wurftechniken; Katame-waza = Bodentechniken; Osaekomi-waza = Haltetechniken; Kansetsu-waza = Hebeltechniken; Shime-waza = Würgetechniken; Randori = freies Üben; Shiai = Wettkampf; Kuzushi = Gleichgewicht brechen; Tsukuri = Wurf vorbereiten/eindrehen; Kake = Wurf ausführen; Hajime = Beginnt!; Matte = Wartet!; Sore-made = Ende des Kampfes; Rei = Gruß; Ippon = voller Punkt; Waza-ari = halbe Wertung; Toketa = Haltegriff gelöst; Ai-yotsu = gleiche Auslage; Kenka-yotsu = gegengleiche Auslage; Dojo = Übungsraum; Judogi = Judoanzug; Obi = Gürtel; Migi = rechts; Hidari = links

## Skills, Agenten & Plugins – Recherche vor Installation
Bevor mit der Umsetzung begonnen wird bzw. bei neuen Projektabschnitten:

1. Erst im Internet recherchieren, welche Skills, Subagenten und Plugins
   zum Projekt passen (Tech-Stack, Art der App, typische Anforderungen
   für so ein Projekt).
2. Danach eine LISTE schreiben mit:
   - Name des Skills/Agenten/Plugins
   - Kurz wofür er gut ist
   - Warum er für dieses Projekt passt
3. Diese Liste mir zuerst zeigen und auf Freigabe warten.
4. ERST NACH meiner Bestätigung installieren/einrichten.

Reihenfolge ist immer: Recherche → Liste zeigen → Freigabe abwarten →
Installation. Kein Punkt wird übersprungen, auch nicht bei "offensichtlich
sinnvollen" Skills.

Installiert (freigegeben am 24.10.2026): frontend-design
(claude-plugins-official, eingetragen in `.claude/settings.json`).

## Fehler-Protokoll (Update-Regel)
Wenn Claude einen Fehler macht oder etwas korrigiert werden muss, wird das
hier festgehalten, bevor weitergearbeitet wird. Format für jeden Eintrag:

```
### [Datum]
- Was ist passiert: [kurze Beschreibung des Fehlers/Verhaltens]
- Warum falsch: [z. B. falsche Annahme, falscher Wert, gegen Vorgabe verstoßen]
- Regel für die Zukunft: [was Claude stattdessen tun soll]
```
