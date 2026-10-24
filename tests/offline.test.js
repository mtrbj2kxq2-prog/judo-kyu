// Offline-Modus: alles, was die App braucht, liegt im Cache und existiert wirklich
const fs = require("fs");
const path = require("path");
const { pruefer, APP, lies } = require("./helfer");

module.exports = async function () {
  const check = pruefer();
  const sw = lies("sw.js");
  const liste = JSON.parse("[" + /DATEIEN = \[([\s\S]*?)\];/.exec(sw)[1].replace(/,\s*$/, "") + "]");
  check("alle Cache-Dateien vorhanden", liste.filter(f => f !== "./").every(f => fs.existsSync(path.join(APP, f))));
  const html = lies("index.html");
  const skripte = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
  check("alle Skripte im Cache", skripte.every(s => liste.includes(s)));
  check("Stylesheet im Cache", liste.includes("style.css"));
  const css = lies("style.css");
  const fonts = [...css.matchAll(/url\("([^"]+)"\)/g)].map(m => m[1]);
  check("alle Schriften im Cache", fonts.length === 4 && fonts.every(f => liste.includes(f)));
  const manifest = JSON.parse(lies("manifest.json"));
  check("Manifest-Icons im Cache", manifest.icons.every(i => liste.includes(i.src)));
  check("Manifest installierbar (standalone, 192 + 512)", manifest.display === "standalone" &&
    manifest.icons.some(i => i.sizes === "192x192") && manifest.icons.some(i => i.sizes === "512x512"));
  check("Reihenfolge: Daten, Logik, Fehler, App", skripte.join() === "data.js,logik.js,fehler.js,app.js");
  return check.ergebnis();
};
