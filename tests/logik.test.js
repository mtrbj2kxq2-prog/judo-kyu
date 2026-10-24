// Rechenregeln: Fortschritt, Pool-Bedingungen, Quiz
const L = require("../logik.js");
const { GRUPPEN, VOCAB } = require("../data.js");
const { pruefer } = require("./helfer");

// Fester Zufall, damit Tests jedes Mal gleich laufen
function zufall(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

module.exports = async function () {
  const check = pruefer();

  check("ohne Haken 0 %", L.fortschritt("k7", {}).prozent === 0);
  const wurf7 = L.belt("k7").abschnitte[1].inhalt[0];
  const h = {};
  ["Seoi-nage", "Tai-otoshi", "O-soto-gari"].forEach(t => { h[L.poolSchluessel("wuerfe", t)] = true; });
  check("Pool 7. Kyu mit 3 Würfen erfüllt", L.poolStand(wurf7, h).erfuellt);
  h[L.poolSchluessel("wuerfe", "O-goshi")] = true;
  check("mehr als benötigt zählt nicht doppelt", L.fortschritt("k7", h).erledigt === 3);

  const alle = {};
  L.belt("k7").abschnitte.forEach(a => a.inhalt.forEach(i => {
    if (i.pool) i.pool.aus.forEach(t => { alle[L.poolSchluessel(i.id, t)] = true; });
    else alle[i.id] = true;
  }));
  check("alles abgehakt = 100 %", L.fortschritt("k7", alle).prozent === 100);

  // 4. Kyu: 12 Würfe ohne Pflicht Uchi-mata -> nicht erfüllt
  const wurf4 = L.belt("k4").abschnitte[1].inhalt[0];
  const h4 = {};
  wurf4.pool.aus.filter(t => t !== "Uchi-mata").slice(0, 12).forEach(t => { h4[L.poolSchluessel("wuerfe", t)] = true; });
  const s4 = L.poolStand(wurf4, h4);
  check("Pflicht fehlt -> Pool nicht erfüllt", !s4.erfuellt && s4.pflichtFehlt.join() === "Uchi-mata");
  check("nicht erfüllter voller Pool zählt n-1", L.fortschritt("k4", h4).erledigt === 11);

  // 3. Kyu: 15 Würfe, nur Pflicht aus Erweiterung (2) -> es fehlt 1
  const wurf3 = L.belt("k3").abschnitte[1].inhalt[0];
  const h3 = {};
  [...wurf3.pool.aus.filter(t => L.techNach[t].p === "grund").slice(0, 13), "Tomoe-nage", "Tani-otoshi"]
    .forEach(t => { h3[L.poolSchluessel("wuerfe", t)] = true; });
  const s3 = L.poolStand(wurf3, h3);
  check("3. Kyu: Erweiterung zu wenig erkannt", !s3.erfuellt && s3.erwFehlt === 1 && s3.erw === 2);

  check("8. Kyu: keine Techniken fürs Quiz", L.technikenBis(8).length === 0);
  check("7. Kyu: Basispool + 4 Haltegriffe", L.technikenBis(7).length === 12);
  check("1. Kyu: alle Techniken", L.technikenBis(1).length === 52);

  const q = L.erzeugeQuiz(5, 10, zufall(7));
  check("10 Fragen", q.length === 10);
  check("halb Technik, halb Begriff", q.filter(f => f.art === "technik").length === 5);
  check("je 4 verschiedene Antworten mit der richtigen", q.every(f =>
    f.antworten.length === 4 && new Set(f.antworten).size === 4 && f.antworten.includes(f.richtig)));
  check("keine Frage doppelt", new Set(q.map(f => f.frage)).size === 10);
  const bis5 = new Set(L.technikenBis(5).map(t => t.n));
  check("nur Techniken bis zum gewählten Gürtel", q.filter(f => f.art === "technik").every(f => bis5.has(f.begriff)));
  check("Technik-Antwort ist die richtige Gruppe", q.filter(f => f.art === "technik").every(f =>
    f.richtig === L.gruppenText(L.techNach[f.begriff].g)));
  check("Begriff-Antwort stimmt mit Vokabel", q.filter(f => f.art === "begriff").every(f =>
    VOCAB.find(v => v[0] === f.begriff)[1] === f.richtig));
  const q8 = L.erzeugeQuiz(8, 10, zufall(3));
  check("8. Kyu: 10 Begriff-Fragen", q8.length === 10 && q8.every(f => f.art === "begriff"));
  check("Gruppen-Text mit Übersetzung", L.gruppenText("koshi") === "Koshi-waza (Hüftwurf)" && Object.keys(GRUPPEN).length === 7);
  return check.ergebnis();
};
