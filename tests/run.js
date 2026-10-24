// Führt alle Tests aus:  npm test
const suiten = [
  ["Prüfungsdaten", "./daten.test.js"],
  ["Fortschritt und Quiz", "./logik.test.js"],
  ["App im Browser", "./app.test.js"],
  ["Fehlerbericht", "./fehler.test.js"],
  ["Offline-Modus", "./offline.test.js"],
];

(async () => {
  let ok = 0, fail = 0;
  for (const [name, datei] of suiten) {
    console.log("\n== " + name + " ==");
    try {
      const r = await require(datei)();
      ok += r.ok; fail += r.fail;
    } catch (e) {
      fail++;
      console.log("  ✗ ABBRUCH:", e.message);
      if (process.env.DEBUG) console.log(e.stack);
    }
  }
  console.log("\n" + "=".repeat(40));
  console.log(fail === 0 ? `✓ alles grün – ${ok} Prüfungen` : `✗ ${fail} Fehler (${ok} grün)`);
  process.exit(fail ? 1 : 0);
})();
