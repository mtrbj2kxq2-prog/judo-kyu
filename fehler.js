/* Grundbausteine (Speicher, Datum, Hinweise) und Fehlerbericht.
   Wird vor app.js geladen, damit auch Fehler beim Start erfasst werden.
   Aufbau wie in der Drahtwerk-App fz2-tool, nur ohne Benutzer/Login. */

const APP_VERSION = "1.0";
const REPORT_MAIL = "tigga232332@gmail.com";   // Sammeladresse für Fehlerberichte
const WOCHE_MS = 7 * 24 * 3600 * 1000;

/* ---------- Speicher ---------- */
const DB = {
  get(k, std) {
    try { const v = localStorage.getItem("judo-kyu:" + k); return v == null ? std : JSON.parse(v); }
    catch (e) { return std; }
  },
  set(k, v) {
    try { localStorage.setItem("judo-kyu:" + k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  },
};

/* ---------- Helfer ---------- */
function jetzt() {
  const d = new Date(), p = n => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function flash(text) {
  const alt = document.querySelector(".flash"); if (alt) alt.remove();
  const el = document.createElement("div"); el.className = "flash"; el.setAttribute("role", "status"); el.textContent = text;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2600);
}

/* ---------- Fehler automatisch erfassen ---------- */
// Liefert app.js: { ansicht, guertel } – was gerade offen ist
let appZustand = () => ({ ansicht: "?", guertel: "" });

function logFehler(art, nachricht, extra) {
  try {
    const list = DB.get("fehler", []);
    const z = appZustand();
    list.push({
      zeit: jetzt(), art: art,
      nachricht: String(nachricht == null ? "" : nachricht).slice(0, 500),
      extra: extra ? String(extra).slice(0, 1500) : "",
      ansicht: z.ansicht, guertel: z.guertel,
    });
    while (list.length > 40) list.shift();
    DB.set("fehler", list);
    aktualisiereFehlerBadge();
  } catch (e) { /* Fehler-Logger darf selbst nie crashen */ }
}
function aktualisiereFehlerBadge() {
  const k = document.getElementById("fehler-knopf");
  if (k) k.classList.toggle("hat-fehler", DB.get("fehler", []).length > 0);
}
window.addEventListener("error", e => logFehler("Programmfehler", e.message, (e.filename || "") + ":" + (e.lineno || "") + (e.error && e.error.stack ? "\n" + e.error.stack : "")));
window.addEventListener("unhandledrejection", e => logFehler("Programmfehler", (e.reason && e.reason.message) || e.reason, e.reason && e.reason.stack));

/* ---------- Bildschirm beim Tippen auf „Fehler" festhalten ---------- */
let bildschirmSchnappschuss = null;
function merkeBildschirm() {
  try {
    const z = appZustand();
    const main = document.getElementById("inhalt");
    bildschirmSchnappschuss = {
      titel: document.getElementById("kopf-titel").textContent,
      ansicht: z.ansicht, guertel: z.guertel,
      sichtbar: String(main ? (main.innerText || main.textContent) : "").replace(/\n{3,}/g, "\n\n").slice(0, 1500),
    };
  } catch (e) { bildschirmSchnappschuss = null; }
}

/* ---------- Fehlerfenster ---------- */
function renderFehler(inhalt, titel) {
  titel.textContent = "Fehler melden";
  const fehler = DB.get("fehler", []);
  const s = bildschirmSchnappschuss;
  const auto = fehler.length
    ? fehler.slice().reverse().map(f => `<li class="eintrag"><b>${esc(f.art)}:</b> ${esc(f.nachricht)}<div class="meta">${esc(f.zeit)}, Ansicht „${esc(f.ansicht)}"${f.guertel ? ", " + esc(f.guertel) : ""}</div></li>`).join("")
    : `<li class="leer">Bisher kein Programmfehler erfasst.</li>`;
  inhalt.innerHTML = `
    <button class="btn btn-leise btn-klein" data-fehler-zurueck="1">‹ Zurück</button>
    <section class="karte">
      <h2>Was stimmt nicht?</h2>
      <p class="hinweis">Kurz beschreiben reicht. Ansicht, Gürtel, Version und Gerät schickt die App selbst mit.</p>
      <label class="sr-only" for="f-text">Beschreibung</label>
      <textarea id="f-text" rows="4" placeholder="z. B. Bei O-goshi lässt sich der Haken nicht setzen"></textarea>
      <p class="label">Bildschirmfoto anhängen (empfohlen)</p>
      <p class="hinweis">Am iPhone: Seitentaste und Lauter gleichzeitig drücken, dann hier auswählen.</p>
      <input type="file" id="f-foto" class="sr-only" accept="image/*" tabindex="-1">
      <div class="foto-wahl">
        <button class="btn btn-leise btn-klein" data-foto-waehlen="1">Foto auswählen</button>
        <span class="foto-name" id="f-foto-name">Kein Foto gewählt</span>
      </div>
      <button class="btn" data-fehler-senden="1">Per E-Mail senden</button>
      <p class="hinweis">Die Mail an ${esc(REPORT_MAIL)} öffnet sich fertig ausgefüllt. Nur noch auf Senden tippen.</p>
      <p class="label">Kein Mailprogramm?</p>
      <div class="knopfreihe">
        <button class="btn btn-leise btn-klein" data-fehler-teilen="1">Teilen (WhatsApp, Signal …)</button>
        <button class="btn btn-leise btn-klein" data-fehler-kopieren="1">Text kopieren</button>
      </div>
    </section>
    <section class="karte">
      <h2>Wird automatisch mitgeschickt</h2>
      <ul class="liste">
        <li class="eintrag"><b>Ansicht:</b> ${s ? esc(s.titel) : "–"}${s && s.guertel ? ", " + esc(s.guertel) : ""}</li>
        <li class="eintrag"><b>Version:</b> ${APP_VERSION}</li>
        <li class="eintrag"><b>Erfasste Programmfehler:</b> ${fehler.length}</li>
      </ul>
    </section>
    <section class="karte">
      <h2>Automatisch erfasste Fehler</h2>
      <ul class="liste">${auto}</ul>
      ${fehler.length ? `<div class="knopfreihe">
        <button class="btn btn-klein" data-wochenbericht="1">Wochenbericht per Mail senden</button>
        <button class="btn btn-leise btn-klein" data-fehler-loeschen="1">Liste leeren</button>
      </div>` : ""}
    </section>`;
}

function berichtText(beschreibung) {
  const s = bildschirmSchnappschuss;
  const f = DB.get("fehler", []);
  let t = "FEHLERMELDUNG – Judo Kyu-App\n";
  t += "================================\n";
  t += "Beschreibung: " + (beschreibung || "(keine)") + "\n\n";
  t += "Zeit: " + jetzt() + "\n";
  t += "App-Version: " + APP_VERSION + "\n";
  if (s) {
    t += "\n--- Bildschirm beim Fehler ---\n";
    t += "Ansicht: " + s.titel + " (" + s.ansicht + ")\n";
    if (s.guertel) t += "Gürtel: " + s.guertel + "\n";
    t += "\nAngezeigter Inhalt:\n" + s.sichtbar + "\n";
  }
  if (f.length) {
    t += "\n--- Automatisch erfasste Programmfehler (" + f.length + ") ---\n";
    f.slice(-8).forEach((x, i) => { t += (i + 1) + ") " + x.zeit + " [" + x.ansicht + "] " + x.art + ": " + String(x.nachricht).slice(0, 200) + "\n"; });
  }
  t += "\n--- Gerät ---\n" + (navigator.userAgent || "") + "\n";
  return t;
}

function verkleinereFoto(file, maxKante, guete) {
  return new Promise((resolve, reject) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const max = maxKante || 1200; let w = img.width, h = img.height;
      if (w > max || h > max) { const f = max / Math.max(w, h); w = Math.round(w * f); h = Math.round(h * f); }
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      c.toBlob(b => b ? resolve(new File([b], "bildschirm.jpg", { type: "image/jpeg" })) : reject(new Error("Foto nicht lesbar")), "image/jpeg", guete || 0.7);
    };
    img.onerror = reject; img.src = url;
  });
}

function beschreibungOderHinweis() {
  const beschreibung = document.getElementById("f-text").value.trim();
  if (!beschreibung) flash("Bitte kurz beschreiben, was nicht stimmt.");
  return beschreibung;
}
async function fotoDatei() {
  const fInput = document.getElementById("f-foto");
  return (fInput.files && fInput.files[0]) ? verkleinereFoto(fInput.files[0]) : null;
}

async function sendeFehlerbericht() {
  const beschreibung = beschreibungOderHinweis(); if (!beschreibung) return;
  const text = berichtText(beschreibung);
  const betreff = "Fehler Judo Kyu-App – " + jetzt();
  // Mit Foto: über Teilen (Mail auswählen), damit das Bild mitgeht
  try {
    const bild = await fotoDatei();
    if (bild) {
      const txt = new File([new Blob([text], { type: "text/plain" })], "fehlerbericht.txt", { type: "text/plain" });
      if (navigator.canShare && navigator.canShare({ files: [bild, txt] })) {
        await navigator.share({ files: [bild, txt], title: betreff, text: text });
        flash("Im Teilen-Menü „Mail“ wählen und an " + REPORT_MAIL + " senden.");
        return;
      }
    }
  } catch (e) { /* Teilen abgebrochen oder nicht möglich -> fertige Mail öffnen */ }
  location.href = "mailto:" + REPORT_MAIL + "?subject=" + encodeURIComponent(betreff) + "&body=" + encodeURIComponent(text);
  flash("E-Mail wird geöffnet. Nur noch auf Senden tippen.");
}

// Teilen: geht auch ohne Mailkonto (WhatsApp, Signal, Notizen …)
async function teileFehlerbericht() {
  const beschreibung = beschreibungOderHinweis(); if (!beschreibung) return;
  const text = "An: " + REPORT_MAIL + "\n\n" + berichtText(beschreibung);
  try {
    const bild = await fotoDatei();
    if (bild && navigator.canShare && navigator.canShare({ files: [bild] })) {
      await navigator.share({ files: [bild], text: text, title: "Fehler Judo Kyu-App" });
      return;
    }
    if (navigator.share) { await navigator.share({ text: text, title: "Fehler Judo Kyu-App" }); return; }
  } catch (e) { return; }   // Nutzer hat abgebrochen
  kopiereFehlerbericht();    // Teilen nicht verfügbar -> kopieren
}

// Kopieren: letzter Rettungsanker, Text landet in der Zwischenablage
async function kopiereFehlerbericht() {
  const beschreibung = beschreibungOderHinweis(); if (!beschreibung) return;
  const text = "An: " + REPORT_MAIL + "\n\n" + berichtText(beschreibung);
  try {
    await navigator.clipboard.writeText(text);
    flash("Text kopiert. Irgendwo einfügen und an " + REPORT_MAIL + " schicken.");
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); flash("Text kopiert."); }
    catch (e2) { flash("Kopieren nicht möglich. Bitte E-Mail oder Teilen nutzen."); }
    ta.remove();
  }
}

/* ---------- Wochenbericht ---------- */
function pruefeWochenbericht() {
  const banner = document.getElementById("wochen-banner");
  if (!banner) return;
  let last = DB.get("report_last_ts", null);
  if (last == null) { last = Date.now(); DB.set("report_last_ts", last); }  // Woche ab erster Nutzung
  const anzahl = DB.get("fehler", []).length;
  const faellig = (Date.now() - last >= WOCHE_MS) && anzahl > 0;
  banner.hidden = !faellig;
  if (faellig) banner.textContent = "Wochenbericht fällig: " + anzahl + " Fehler erfasst. Zum Senden tippen.";
}

function wochenberichtMail() {
  const fehler = DB.get("fehler", []);
  let body = "Wochenbericht Judo Kyu-App (Version " + APP_VERSION + ")\n";
  body += "Erstellt: " + jetzt() + "\n";
  body += "Gerät: " + (navigator.userAgent || "") + "\n\n";
  if (!fehler.length) body += "Keine automatischen Meldungen in diesem Zeitraum.\n";
  else {
    body += fehler.length + " automatisch erfasste Meldung(en):\n";
    fehler.slice(-15).forEach((f, i) => {
      body += (i + 1) + ") " + f.zeit + " [" + f.ansicht + (f.guertel ? ", " + f.guertel : "") + "] " + f.art + ": " + String(f.nachricht).slice(0, 150) + "\n";
    });
  }
  DB.set("report_last_ts", Date.now());
  pruefeWochenbericht();
  location.href = "mailto:" + REPORT_MAIL + "?subject=" + encodeURIComponent("Wochenbericht Judo Kyu-App – " + jetzt()) + "&body=" + encodeURIComponent(body);
  flash("E-Mail wird geöffnet. Bitte absenden.");
}

function leereFehlerliste() {
  if (!confirm("Alle erfassten Fehler löschen?")) return false;
  DB.set("fehler", []);
  aktualisiereFehlerBadge();
  pruefeWochenbericht();
  return true;
}
