// Gemeinsame Test-Hilfen: App in jsdom starten, prüfen
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const APP = path.join(__dirname, "..");
const lies = f => fs.readFileSync(path.join(APP, f), "utf8");
const html = lies("index.html");
const SKRIPTE = ["data.js", "logik.js", "fehler.js", "app.js"].map(lies).join("\n");

const warte = ms => new Promise(r => setTimeout(r, ms));

// roh: localStorage-Einträge ohne Präfix, z. B. { fortschritt: {...} }
function starteApp(roh) {
  const dom = new JSDOM(html, { runScripts: "outside-only", url: "http://localhost/" });
  const w = dom.window;
  w.scrollTo = () => {}; w.confirm = () => true; w.alert = () => {};
  w.CSS = { escape: s => String(s).replace(/["\\]/g, "\\$&") };
  if (roh) Object.keys(roh).forEach(k => w.localStorage.setItem("judo-kyu:" + k, JSON.stringify(roh[k])));
  // jsdom kapselt jeden eval-Aufruf; im Browser teilen sich die Skripte den Namensraum
  w.eval(SKRIPTE);
  return w;
}

function pruefer() {
  let ok = 0, fail = 0;
  const check = (name, bedingung) => {
    if (bedingung) { ok++; console.log("  ✓", name); }
    else { fail++; console.log("  ✗ FEHLER:", name); }
  };
  check.ergebnis = () => ({ ok, fail });
  return check;
}

function werkzeuge(w) {
  const d = w.document;
  return {
    d,
    S: k => JSON.parse(w.localStorage.getItem("judo-kyu:" + k)),
    text: () => d.getElementById("inhalt").textContent,
    tab: v => d.querySelector(`.tab[data-view="${v}"]`).click(),
    haken: k => {
      const el = d.querySelector(`[data-haken="${k}"]`);
      el.checked = !el.checked;
      el.dispatchEvent(new w.Event("change", { bubbles: true }));
    },
  };
}

module.exports = { starteApp, pruefer, werkzeuge, warte, APP, lies };
