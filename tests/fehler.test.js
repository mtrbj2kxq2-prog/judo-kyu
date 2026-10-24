// Fehlerbericht wie in der Drahtwerk-App: erfassen, Knopf rot, Fenster, Bericht, Wochenbericht
const { starteApp, pruefer, werkzeuge } = require("./helfer");

module.exports = async function () {
  const check = pruefer();
  const w = starteApp();
  const { d, S, text } = werkzeuge(w);

  check("Fehler-Knopf anfangs nicht rot", !d.getElementById("fehler-knopf").classList.contains("hat-fehler"));
  d.querySelector('[data-belt="k3"]').click();
  w.dispatchEvent(new w.ErrorEvent("error", { message: "Testfehler", filename: "app.js", lineno: 7 }));
  const f = S("fehler");
  check("Programmfehler erfasst", f.length === 1 && f[0].nachricht === "Testfehler");
  check("Fehler kennt Ansicht und Gürtel", f[0].ansicht === "guertel" && f[0].guertel === "3. Kyu grün");
  check("Zeit im deutschen Format", /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/.test(f[0].zeit));
  check("Fehler-Knopf wird rot", d.getElementById("fehler-knopf").classList.contains("hat-fehler"));

  for (let i = 0; i < 50; i++) w.eval(`logFehler("Test", "Nr ${i}")`);
  check("höchstens 40 Fehler gespeichert", S("fehler").length === 40 && S("fehler")[39].nachricht === "Nr 49");

  d.getElementById("fehler-knopf").click();
  check("Fehlerfenster offen", d.getElementById("kopf-titel").textContent === "Fehler melden" && d.getElementById("f-text") !== null);
  check("Schnappschuss kennt Gürtel", text().includes("3. Kyu grün"));
  check("drei Wege zum Senden", d.querySelector("[data-fehler-senden]") && d.querySelector("[data-fehler-teilen]") && d.querySelector("[data-fehler-kopieren]"));
  check("Foto anhängen möglich", d.getElementById("f-foto").accept === "image/*" && d.querySelector("[data-foto-waehlen]") !== null);

  // Ohne Beschreibung wird nichts geschickt
  d.querySelector("[data-fehler-kopieren]").click();
  check("leere Beschreibung -> Hinweis", d.querySelector(".flash").textContent.includes("Bitte kurz beschreiben"));

  d.getElementById("f-text").value = "Zähler stimmt nicht";
  const bericht = w.eval("berichtText(document.getElementById('f-text').value)");
  check("Bericht enthält Beschreibung, Gürtel, Version", bericht.includes("Zähler stimmt nicht") && bericht.includes("Gürtel: 3. Kyu grün") && bericht.includes("App-Version: "));
  check("Bericht enthält erfasste Fehler", bericht.includes("Automatisch erfasste Programmfehler (40)"));
  check("kein Benutzername im Bericht", !bericht.includes("Benutzer"));

  d.querySelector("[data-fehler-zurueck]").click();
  check("Zurück führt zum Gürtel", d.getElementById("kopf-titel").textContent === "3. Kyu");

  // Wochenbericht
  check("Banner aus, solange keine Woche um ist", d.getElementById("wochen-banner").hidden);
  const w2 = starteApp({ fehler: [{ zeit: "01.10.2026 10:00", art: "Test", nachricht: "x", ansicht: "start" }], report_last_ts: Date.now() - 8 * 24 * 3600 * 1000 });
  const b = w2.document.getElementById("wochen-banner");
  check("Wochenbericht-Banner nach einer Woche", !b.hidden && b.textContent.includes("1 Fehler"));
  const w3 = starteApp({ fehler: [], report_last_ts: Date.now() - 8 * 24 * 3600 * 1000 });
  check("kein Banner ohne Fehler", w3.document.getElementById("wochen-banner").hidden);

  // Im Quiz meldet der Schnappschuss den Quiz-Gürtel, nicht den zuletzt geöffneten
  d.querySelector('.tab[data-view="quiz"]').click();
  d.querySelector('[data-quiz-kyu="6"]').click();
  d.getElementById("fehler-knopf").click();
  const ansicht = [...d.querySelectorAll(".eintrag")].find(e => e.textContent.startsWith("Ansicht:")).textContent;
  check("Schnappschuss im Quiz: Quiz-Gürtel", ansicht === "Ansicht: Quiz, 6. Kyu gelb-orange");

  // Liste leeren
  d.getElementById("fehler-knopf").click();
  d.querySelector("[data-fehler-loeschen]").click();
  check("Liste geleert, Knopf nicht mehr rot", S("fehler").length === 0 && !d.getElementById("fehler-knopf").classList.contains("hat-fehler"));
  return check.ergebnis();
};
