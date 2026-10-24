/* Rechenlogik ohne Oberfläche: Fortschritt pro Gürtel und Quiz-Fragen.
   Im Browser kommen die Daten aus data.js, in den Tests über require. */
(function (global, D) {
  const { GRUPPEN, TECH, BELTS, VOCAB } = D;

  const techNach = {};
  TECH.forEach(t => { techNach[t.n] = t; });

  function belt(id) { return BELTS.find(b => b.id === id) || null; }

  // Schlüssel im gespeicherten Fortschritt: Punkt = "id", Pool-Technik = "id:Technik"
  function poolSchluessel(inhaltId, technik) { return inhaltId + ":" + technik; }

  /* Stand eines Pools: wie viele gewählt, ob Pflicht und Erweiterungs-Mindestzahl erfüllt sind. */
  function poolStand(inhalt, haken) {
    const p = inhalt.pool, pflicht = p.pflicht || [];
    const gewaehlt = p.aus.filter(t => haken[poolSchluessel(inhalt.id, t)]);
    const erw = gewaehlt.filter(t => techNach[t] && techNach[t].p === "erw").length;
    const pflichtFehlt = pflicht.filter(t => !gewaehlt.includes(t));
    const erwFehlt = Math.max(0, (p.minErw || 0) - erw);
    const erfuellt = gewaehlt.length >= p.n && pflichtFehlt.length === 0 && erwFehlt === 0;
    return { gewaehlt: gewaehlt.length, benoetigt: p.n, erw, minErw: p.minErw || 0, pflichtFehlt, erwFehlt, erfuellt };
  }

  /* Fortschritt eines Gürtels in Teilschritten: jeder Punkt zählt 1, ein Pool zählt n.
     Ein voller, aber nicht regelkonformer Pool (Pflicht oder Erweiterung fehlt) zählt n-1. */
  function fortschritt(beltId, haken) {
    const b = belt(beltId);
    if (!b) return { erledigt: 0, gesamt: 0, prozent: 0 };
    haken = haken || {};
    let erledigt = 0, gesamt = 0;
    b.abschnitte.forEach(a => a.inhalt.forEach(i => {
      if (i.pool) {
        const s = poolStand(i, haken);
        gesamt += s.benoetigt;
        erledigt += s.erfuellt ? s.benoetigt : Math.min(s.gewaehlt, s.benoetigt - 1);
      } else {
        gesamt += 1;
        if (haken[i.id]) erledigt += 1;
      }
    }));
    return { erledigt, gesamt, prozent: gesamt ? Math.round(erledigt / gesamt * 100) : 0 };
  }

  /* Alle Techniken, die bis einschließlich zu diesem Gürtel in Prüfungen vorkommen. */
  function technikenBis(kyu) {
    const menge = new Set();
    BELTS.filter(b => b.kyu >= kyu).forEach(b => b.abschnitte.forEach(a => a.inhalt.forEach(i => {
      if (i.pool) i.pool.aus.forEach(t => menge.add(t));
    })));
    return TECH.filter(t => menge.has(t.n));
  }

  function mische(arr, zufall) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(zufall() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function gruppenText(g) { return GRUPPEN[g].name + " (" + GRUPPEN[g].deutsch + ")"; }

  /* Eine Quiz-Runde: anzahl Fragen, je 4 Antworten. Halb Technik → Gruppe, halb Begriff → Bedeutung;
     gibt es bis zum Gürtel noch keine Techniken (8. Kyu), nur Begriffe. */
  function erzeugeQuiz(kyu, anzahl, zufall) {
    anzahl = anzahl || 10; zufall = zufall || Math.random;
    const techniken = mische(technikenBis(kyu), zufall);
    const begriffe = mische(VOCAB, zufall);
    let nTech = techniken.length ? Math.min(Math.ceil(anzahl / 2), techniken.length) : 0;
    let nVoc = Math.min(anzahl - nTech, begriffe.length);
    nTech = Math.min(anzahl - nVoc, techniken.length);
    const alleGruppen = Object.keys(GRUPPEN);
    const fragen = [];
    techniken.slice(0, nTech).forEach(t => {
      const falsch = mische(alleGruppen.filter(g => g !== t.g), zufall).slice(0, 3);
      fragen.push({
        art: "technik", frage: "Zu welcher Gruppe gehört " + t.n + "?", begriff: t.n,
        antworten: mische([t.g, ...falsch], zufall).map(gruppenText), richtig: gruppenText(t.g),
      });
    });
    begriffe.slice(0, nVoc).forEach(([wort, bedeutung]) => {
      const falsch = mische(VOCAB.filter(v => v[0] !== wort).map(v => v[1]), zufall).slice(0, 3);
      fragen.push({
        art: "begriff", frage: "Was bedeutet " + wort + "?", begriff: wort,
        antworten: mische([bedeutung, ...falsch], zufall), richtig: bedeutung,
      });
    });
    return mische(fragen, zufall);
  }

  const api = { belt, poolSchluessel, poolStand, fortschritt, technikenBis, erzeugeQuiz, mische, gruppenText, techNach };
  if (typeof module !== "undefined") module.exports = api;
  else global.Logik = api;
})(this, typeof module !== "undefined" ? require("./data.js")
  // const aus data.js liegt im Browser im globalen Gültigkeitsbereich, aber nicht auf window
  : { GRUPPEN, TECH, BELTS, VOCAB });
