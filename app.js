/* Oberfläche: Gürtelauswahl, Checkliste pro Gürtel, Quiz. Daten aus data.js, Rechnen in logik.js. */

const state = { view: "start", belt: null, quiz: null, quizKyu: null, vorher: "start" };
const inhalt = document.getElementById("inhalt");
const titel = document.getElementById("kopf-titel");

appZustand = () => {
  // Im Quiz zählt der Quiz-Gürtel, sonst der zuletzt geöffnete
  const kyu = state.quiz ? state.quiz.kyu : state.view === "quiz" ? state.quizKyu : null;
  const b = kyu ? BELTS.find(x => x.kyu === kyu) : state.belt ? Logik.belt(state.belt) : null;
  return { ansicht: state.view, guertel: b ? b.kyu + ". Kyu " + b.name : "" };
};

/* ---------- Fortschritt ---------- */
function haken(beltId) { return DB.get("fortschritt", {})[beltId] || {}; }
function setzeHaken(beltId, schluessel, an) {
  const alle = DB.get("fortschritt", {});
  const h = alle[beltId] || {};
  if (an) h[schluessel] = true; else delete h[schluessel];
  alle[beltId] = h;
  if (!DB.set("fortschritt", alle)) flash("Speichern nicht möglich. Ist privates Surfen aktiv?");
}
function setzeZurueck(beltId) {
  const alle = DB.get("fortschritt", {});
  delete alle[beltId];
  DB.set("fortschritt", alle);
}

/* ---------- Bausteine ---------- */
function obi(b, prozent, gross) {
  const [a, z] = b.farben.length > 1 ? b.farben : [b.farben[0], b.farben[0]];
  return `<div class="obi${gross ? " obi-gross" : ""}" style="--oben:var(--g-${a});--unten:var(--g-${z});--schrift:var(--t-${z})">
    <span class="naht" aria-hidden="true"></span>
    <span class="naht naht-fertig" aria-hidden="true" style="width:${prozent}%"></span>
    ${gross ? '<svg class="knoten" viewBox="0 0 120 100" aria-hidden="true"><path d="M46 52 L22 98 L42 98 L60 60 Z" /><path d="M74 52 L98 98 L78 98 L60 60 Z" /><path d="M40 6 L80 6 L86 62 L60 50 L34 62 Z" /></svg>' : ""}
  </div>`;
}
function videoLink(technik) {
  return `<a class="video" href="https://www.youtube.com/results?search_query=${encodeURIComponent(technik + " judo")}" target="_blank" rel="noopener" aria-label="Video zu ${esc(technik)} suchen">Video</a>`;
}
function checkbox(schluessel, an, beschriftung) {
  return `<input type="checkbox" id="h-${esc(schluessel)}" data-haken="${esc(schluessel)}"${an ? " checked" : ""} aria-label="${esc(beschriftung)}">`;
}

/* ---------- Ansichten ---------- */
function renderStart() {
  titel.textContent = "Kyu-Prüfung";
  const letzter = DB.get("letzter", null);
  inhalt.innerHTML = `
    <p class="einleitung">Wähle deinen nächsten Gürtel. Hake ab, was du schon kannst, und übe die Begriffe im Quiz.</p>
    <ul class="gurtregal">
      ${BELTS.map(b => {
        const f = Logik.fortschritt(b.id, haken(b.id));
        return `<li><button class="gurt${b.id === letzter ? " zuletzt" : ""}" data-belt="${b.id}">
          ${obi(b, f.prozent)}
          <span class="gurt-text" style="--schrift:var(--t-${b.farben[b.farben.length - 1]})">
            <span class="gurt-kyu">${b.kyu}. Kyu</span>
            <span class="gurt-name">${esc(b.name)}</span>
            <span class="gurt-prozent">${f.prozent} %</span>
          </span>
        </button></li>`;
      }).join("")}
    </ul>
    <p class="quelle">Nach „${esc(QUELLE.titel)}“, Stand ${QUELLE.stand}. <a href="${QUELLE.url}" target="_blank" rel="noopener">Original-PDF des DJB</a></p>`;
}

function renderPool(b, i, h) {
  const p = i.pool, s = Logik.poolStand(i, h), pflicht = p.pflicht || [];
  const offen = [];
  if (s.pflichtFehlt.length) offen.push("Pflicht fehlt noch: " + s.pflichtFehlt.join(", "));
  if (s.erwFehlt) offen.push("Noch " + s.erwFehlt + " aus dem Erweiterungsprogramm");
  return `<li class="pool${s.erfuellt ? " erfuellt" : ""}">
    <div class="pool-kopf">
      <h3>${esc(i.text)}</h3>
      <span class="zaehler" aria-label="${s.gewaehlt} von ${s.benoetigt} gewählt">${s.gewaehlt} / ${s.benoetigt}</span>
    </div>
    ${p.hinweis ? `<p class="hinweis">${esc(p.hinweis)}</p>` : ""}
    ${s.minErw ? `<p class="hinweis">Davon mindestens ${s.minErw} aus dem Erweiterungsprogramm (gewählt: ${s.erw}).</p>` : ""}
    ${offen.length ? `<p class="offen">${offen.map(esc).join(". ")}.</p>` : ""}
    <ul class="techniken">
      ${p.aus.map(t => {
        const k = Logik.poolSchluessel(i.id, t), tech = Logik.techNach[t];
        const g = GRUPPEN[tech.g];
        return `<li class="zeile">
          ${checkbox(k, h[k], t)}
          <label for="h-${esc(k)}" class="zeile-text">
            <span class="technik">${esc(t)}</span>
            <span class="meta">${esc(g.name)}, ${esc(g.deutsch)}${tech.p === "erw" ? ", Erweiterung" : ""}</span>
          </label>
          ${pflicht.includes(t) ? '<span class="marke">Pflicht</span>' : ""}
          ${videoLink(t)}
        </li>`;
      }).join("")}
    </ul>
  </li>`;
}

function renderGuertel() {
  const b = Logik.belt(state.belt);
  if (!b) return zeige("start");
  const h = haken(b.id), f = Logik.fortschritt(b.id, h);
  titel.textContent = b.kyu + ". Kyu";
  inhalt.innerHTML = `
    <button class="btn btn-leise btn-klein" data-zeige="start">‹ Alle Gürtel</button>
    <header class="gurt-kopf">
      ${obi(b, f.prozent, true)}
      <h2 class="gurt-titel">${b.kyu}. Kyu <span>${esc(b.name)}</span></h2>
      <p class="stand">${f.erledigt} von ${f.gesamt} Schritten geschafft</p>
    </header>
    ${b.abschnitte.map(a => `
      <section class="abschnitt">
        <h2>${esc(a.titel)}</h2>
        <ul class="punkte">
          ${a.inhalt.map(i => i.pool ? renderPool(b, i, h) : `<li class="zeile">
            ${checkbox(i.id, h[i.id], i.text)}
            <label for="h-${esc(i.id)}" class="zeile-text">${esc(i.text)}</label>
          </li>`).join("")}
        </ul>
      </section>`).join("")}
    <p class="quelle">Ähnliche Techniken und Mischformen dürfen ersetzt werden, z. B. Ko-soto-gari/-gake oder O-goshi/Tsuri-goshi.</p>
    <button class="btn btn-leise" data-zuruecksetzen="${b.id}">Fortschritt für ${b.kyu}. Kyu zurücksetzen</button>`;
}

/* ---------- Quiz ---------- */
function renderQuiz() {
  titel.textContent = "Quiz";
  const q = state.quiz;
  if (!q) {
    const kyu = state.quizKyu || (Logik.belt(DB.get("letzter", "k7")) || BELTS[1]).kyu;
    state.quizKyu = kyu;
    inhalt.innerHTML = `
      <section class="karte">
        <h2>Für welchen Gürtel übst du?</h2>
        <p class="hinweis">10 Fragen: Zu welcher Gruppe gehört eine Technik (nur Techniken bis zu diesem Gürtel) und was bedeuten die japanischen Begriffe.</p>
        <div class="chips" role="radiogroup" aria-label="Gürtel">
          ${BELTS.map(b => `<button class="chip${b.kyu === kyu ? " an" : ""}" role="radio" aria-checked="${b.kyu === kyu}" data-quiz-kyu="${b.kyu}">
            <span class="chip-farbe" style="--oben:var(--g-${b.farben[0]});--unten:var(--g-${b.farben[b.farben.length - 1]})"></span>${b.kyu}. Kyu</button>`).join("")}
        </div>
        <button class="btn" data-quiz-start="1">Quiz starten</button>
      </section>`;
    return;
  }
  if (q.pos >= q.fragen.length) {
    const falsch = q.fragen.filter(f => f.gewaehlt !== f.richtig);
    const richtig = q.fragen.length - falsch.length;
    inhalt.innerHTML = `
      <section class="karte ergebnis">
        <p class="punkte-gross">${richtig} von ${q.fragen.length}</p>
        <p>${richtig === q.fragen.length ? "Alles richtig." : richtig >= 7 ? "Gut gemacht. Schau dir die falschen Antworten noch einmal an." : "Weiter üben. Hier sind die richtigen Antworten."}</p>
        ${falsch.length ? `<ul class="liste">${falsch.map(f => `<li class="eintrag"><b>${esc(f.begriff)}</b>: ${esc(f.richtig)}<div class="meta">Deine Antwort: ${esc(f.gewaehlt)}</div></li>`).join("")}</ul>` : ""}
        <div class="knopfreihe">
          <button class="btn" data-quiz-start="1">Neue Runde</button>
          <button class="btn btn-leise" data-quiz-ende="1">Anderen Gürtel wählen</button>
        </div>
      </section>`;
    return;
  }
  const f = q.fragen[q.pos], beantwortet = f.gewaehlt != null;
  inhalt.innerHTML = `
    <section class="karte frage">
      <p class="fortschritt-text">Frage ${q.pos + 1} von ${q.fragen.length} (${q.kyu}. Kyu)</p>
      <div class="balken" aria-hidden="true"><span style="width:${q.pos / q.fragen.length * 100}%"></span></div>
      <h2>${esc(f.frage)}</h2>
      <div class="antworten">
        ${f.antworten.map((a, n) => {
          let cls = "";
          if (beantwortet) cls = a === f.richtig ? " richtig" : a === f.gewaehlt ? " falsch" : " aus";
          return `<button class="antwort${cls}" data-antwort="${n}"${beantwortet ? " disabled" : ""}>${esc(a)}</button>`;
        }).join("")}
      </div>
      <p class="rueckmeldung" role="status">${beantwortet ? (f.gewaehlt === f.richtig ? "Richtig." : "Falsch. Richtig ist: " + esc(f.richtig)) : ""}</p>
      ${beantwortet ? `<button class="btn" data-quiz-weiter="1">${q.pos + 1 < q.fragen.length ? "Nächste Frage" : "Ergebnis zeigen"}</button>` : ""}
    </section>`;
  if (beantwortet) inhalt.querySelector("[data-quiz-weiter]").focus();
}

/* ---------- Router ---------- */
function zeige(view) {
  if (view !== "fehler") state.vorher = view;
  state.view = view;
  render();
  window.scrollTo(0, 0);
}
function render() {
  document.querySelectorAll(".tab").forEach(t => {
    const an = t.dataset.view === (state.view === "guertel" ? "start" : state.view);
    t.classList.toggle("an", an);
    if (an) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
  });
  if (state.view === "guertel") renderGuertel();
  else if (state.view === "quiz") renderQuiz();
  else if (state.view === "fehler") renderFehler(inhalt, titel);
  else renderStart();
}

/* ---------- Hell/Dunkel ---------- */
const THEMEN = ["auto", "hell", "dunkel"];
const THEMA_SYMBOL = {
  auto: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>',
  hell: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></g></svg>',
  dunkel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="currentColor"/></svg>',
};
function setzeThema(t) {
  if (t === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", t === "hell" ? "light" : "dark");
  const k = document.getElementById("thema-knopf");
  k.innerHTML = THEMA_SYMBOL[t];
  k.setAttribute("aria-label", "Farbmodus: " + (t === "auto" ? "wie Gerät" : t) + ". Tippen zum Wechseln");
}

/* ---------- Ereignisse ---------- */
document.addEventListener("click", e => {
  const el = e.target.closest("button, [data-zeige]");
  if (!el) return;
  const d = el.dataset;
  if (el.classList.contains("tab")) { state.quiz = null; zeige(d.view); }
  else if (d.zeige) zeige(d.zeige);
  else if (d.belt) { state.belt = d.belt; DB.set("letzter", d.belt); zeige("guertel"); }
  else if (d.zuruecksetzen) {
    const b = Logik.belt(d.zuruecksetzen);
    if (confirm("Alle Haken für den " + b.kyu + ". Kyu entfernen?")) { setzeZurueck(b.id); render(); flash("Fortschritt für " + b.kyu + ". Kyu zurückgesetzt."); }
  }
  else if (d.quizKyu) { state.quizKyu = Number(d.quizKyu); render(); }
  else if (d.quizStart) {
    const kyu = state.quiz ? state.quiz.kyu : state.quizKyu;
    state.quiz = { kyu, pos: 0, fragen: Logik.erzeugeQuiz(kyu, 10) };
    render();
  }
  else if (d.antwort != null) {
    const f = state.quiz.fragen[state.quiz.pos];
    f.gewaehlt = f.antworten[Number(d.antwort)];
    render();
  }
  else if (d.quizWeiter) { state.quiz.pos++; render(); }
  else if (d.quizEnde) { state.quizKyu = state.quiz.kyu; state.quiz = null; render(); }
  else if (el.id === "fehler-knopf") { merkeBildschirm(); zeige("fehler"); }
  else if (d.fehlerZurueck) zeige(state.vorher || "start");
  else if (d.fotoWaehlen) document.getElementById("f-foto").click();
  else if (d.fehlerSenden) sendeFehlerbericht();
  else if (d.fehlerTeilen) teileFehlerbericht();
  else if (d.fehlerKopieren) kopiereFehlerbericht();
  else if (d.fehlerLoeschen) { if (leereFehlerliste()) render(); }
  else if (d.wochenbericht || el.id === "wochen-banner") wochenberichtMail();
  else if (el.id === "thema-knopf") {
    const t = THEMEN[(THEMEN.indexOf(DB.get("thema", "auto")) + 1) % THEMEN.length];
    DB.set("thema", t); setzeThema(t);
  }
});

document.addEventListener("change", e => {
  if (e.target.id === "f-foto") {
    const f = e.target.files && e.target.files[0];
    document.getElementById("f-foto-name").textContent = f ? f.name : "Kein Foto gewählt";
    return;
  }
  const k = e.target.dataset && e.target.dataset.haken;
  if (!k || state.view !== "guertel") return;
  setzeHaken(state.belt, k, e.target.checked);
  // Neu zeichnen (Zähler, Naht), Bildlage und Fokus behalten
  const y = window.scrollY;
  render();
  window.scrollTo(0, y);
  const neu = inhalt.querySelector(`[data-haken="${CSS.escape(k)}"]`);
  if (neu) neu.focus();
});

/* ---------- Start ---------- */
setzeThema(DB.get("thema", "auto"));
render();
aktualisiereFehlerBadge();
pruefeWochenbericht();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(err => logFehler("Offline-Modus", err.message));
}
