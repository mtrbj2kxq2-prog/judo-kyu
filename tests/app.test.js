// Bedienung im Browser: Gürtel wählen, abhaken, speichern, zurücksetzen, Quiz, Farbmodus
const { starteApp, pruefer, werkzeuge } = require("./helfer");
const L = require("../logik.js");
const { VOCAB } = require("../data.js");

// Richtige Antwort aus der Frage ableiten – unabhängig von der App
function richtigeAntwort(frage) {
  let m = /^Zu welcher Gruppe gehört (.+)\?$/.exec(frage);
  if (m) return L.gruppenText(L.techNach[m[1]].g);
  m = /^Was bedeutet (.+)\?$/.exec(frage);
  return VOCAB.find(v => v[0] === m[1])[1];
}

module.exports = async function () {
  const check = pruefer();
  const w = starteApp();
  const { d, S, text, tab, haken } = werkzeuge(w);

  check("Start zeigt 8 Gürtel", d.querySelectorAll(".gurt").length === 8);
  check("zweifarbige Gürtel längs geteilt", d.querySelector('[data-belt="k6"] .obi').getAttribute("style").includes("--oben:var(--g-gelb);--unten:var(--g-orange)"));
  check("DJB-Quelle mit Stand verlinkt", text().includes("01.02.2024") && d.querySelector('a[href*="judobund.de"]') !== null);

  d.querySelector('[data-belt="k5"]').click();
  check("Gürtel-Ansicht 5. Kyu", d.getElementById("kopf-titel").textContent === "5. Kyu");
  check("letzter Gürtel gemerkt", S("letzter") === "k5");
  check("Abschnitte Fallen, Würfe, Boden, Wettkampf",
    [...d.querySelectorAll(".abschnitt > h2")].map(h => h.textContent).join() === "Fallen,Würfe,Boden,Wettkampf oder Randori");
  check("Zähler 0 / 9", d.querySelector(".zaehler").textContent === "0 / 9");

  haken("fallen");
  haken("wuerfe:Seoi-nage");
  haken("wuerfe:Uchi-mata");
  check("Haken gespeichert", S("fortschritt").k5.fallen === true && S("fortschritt").k5["wuerfe:Uchi-mata"] === true);
  check("Zähler 2 / 9", d.querySelector(".zaehler").textContent === "2 / 9");
  check("Fokus bleibt auf dem Haken", d.activeElement && d.activeElement.dataset.haken === "wuerfe:Uchi-mata");
  haken("wuerfe:Seoi-nage");
  check("Haken wieder entfernen", !S("fortschritt").k5["wuerfe:Seoi-nage"] && d.querySelector(".zaehler").textContent === "1 / 9");

  const video = d.querySelector('.video');
  check("Video-Knopf sucht „<Technik> judo“ auf YouTube",
    video.href === "https://www.youtube.com/results?search_query=Seoi-nage%20judo" && video.target === "_blank");

  d.querySelector('[data-zeige="start"]').click();
  check("zurück zur Übersicht", d.querySelectorAll(".gurt").length === 8);
  check("Fortschritt in der Übersicht", d.querySelector('[data-belt="k5"] .gurt-prozent').textContent === "10 %");

  d.querySelector('[data-belt="k4"]').click();
  check("Pflicht markiert (3 im 4. Kyu Würfe + 2 Hebel)", d.querySelectorAll(".marke").length === 5);
  check("fehlende Pflicht wird angezeigt", text().includes("Pflicht fehlt noch: O-soto-gari, Harai-goshi, Uchi-mata"));

  d.querySelector('[data-zeige="start"]').click();
  d.querySelector('[data-belt="k5"]').click();
  d.querySelector('[data-zuruecksetzen="k5"]').click();
  check("Fortschritt zurückgesetzt", !S("fortschritt").k5);
  check("andere Gürtel bleiben", S("fortschritt") !== null);

  // Quiz
  tab("quiz");
  check("Quiz startet mit zuletzt gewähltem Gürtel", d.querySelector(".chip.an").textContent.includes("5. Kyu"));
  d.querySelector('[data-quiz-kyu="3"]').click();
  check("Gürtel im Quiz wählbar", d.querySelector(".chip.an").textContent.includes("3. Kyu"));
  d.querySelector("[data-quiz-start]").click();
  let richtig = 0;
  for (let i = 0; i < 10; i++) {
    const frage = d.querySelector(".frage h2").textContent;
    const knoepfe = [...d.querySelectorAll(".antwort")];
    // jede zweite Frage absichtlich falsch
    const soll = richtigeAntwort(frage);
    const ziel = i % 2 === 0 ? knoepfe.find(k => k.textContent === soll) : knoepfe.find(k => k.textContent !== soll);
    ziel.click();
    if (i % 2 === 0) richtig++;
    if (i === 1) check("falsche Antwort zeigt die richtige", d.querySelector(".rueckmeldung").textContent.startsWith("Falsch. Richtig ist:"));
    if (i === 0) check("Antworten danach gesperrt", d.querySelectorAll(".antwort[disabled]").length === 4 && frage.length > 0);
    d.querySelector("[data-quiz-weiter]").click();
  }
  check("Ergebnis 5 von 10", d.querySelector(".punkte-gross").textContent === richtig + " von 10");
  check("falsche Antworten aufgelistet", d.querySelectorAll(".ergebnis .eintrag").length === 5);
  d.querySelector("[data-quiz-start]").click();
  check("neue Runde gleicher Gürtel", text().includes("Frage 1 von 10 (3. Kyu)"));

  // Hell/Dunkel
  d.getElementById("thema-knopf").click();
  check("Farbmodus hell", d.documentElement.getAttribute("data-theme") === "light" && S("thema") === "hell");
  d.getElementById("thema-knopf").click();
  check("Farbmodus dunkel", d.documentElement.getAttribute("data-theme") === "dark");
  d.getElementById("thema-knopf").click();
  check("Farbmodus wie Gerät", !d.documentElement.hasAttribute("data-theme"));

  // Gespeicherter Fortschritt beim nächsten Start
  const w2 = starteApp({ fortschritt: { k7: { fallen: true } }, letzter: "k7" });
  check("Fortschritt nach Neustart da", w2.document.querySelector('[data-belt="k7"] .gurt-prozent').textContent === "8 %");
  check("zuletzt gewählter Gürtel markiert", w2.document.querySelector('[data-belt="k7"]').classList.contains("zuletzt"));

  // Kaputter Speicher darf die App nicht stoppen
  const w4 = starteApp();
  w4.localStorage.setItem("judo-kyu:fortschritt", "{kaputt");
  w4.eval("render()");
  check("kaputter Speicher: Übersicht trotzdem da", w4.document.querySelectorAll(".gurt").length === 8);
  return check.ergebnis();
};
