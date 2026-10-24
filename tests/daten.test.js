// Prüfungsdaten gegen die Vorgaben aus dem DJB-Programm (Stand 01.02.2024)
const { GRUPPEN, TECH, POOL, BELTS, VOCAB } = require("../data.js");
const { pruefer } = require("./helfer");

module.exports = async function () {
  const check = pruefer();
  const namen = new Set(TECH.map(t => t.n));

  check("8 Gürtel von 8. bis 1. Kyu", BELTS.map(b => b.kyu).join() === "8,7,6,5,4,3,2,1");
  check("zweifarbig genau weiß-gelb, gelb-orange, orange-grün",
    BELTS.filter(b => b.farben.length === 2).map(b => b.name).join() === "weiß-gelb,gelb-orange,orange-grün");
  check("7 Gruppen", Object.keys(GRUPPEN).length === 7);
  check("Technik-Namen eindeutig", namen.size === TECH.length);
  check("jede Technik hat bekannte Gruppe und Programm", TECH.every(t => GRUPPEN[t.g] && ["grund", "erw"].includes(t.p)));
  check("Würfe Grundprogramm: 16", POOL.wurfGrund.length === 16);
  check("Würfe Erweiterungsprogramm: 12", POOL.wurfAlle.length - POOL.wurfGrund.length === 12);
  check("Boden: 9 Grund, 15 Erweiterung",
    TECH.filter(t => !["te", "koshi", "ashi", "sutemi"].includes(t.g) && t.p === "grund").length === 9 &&
    TECH.filter(t => !["te", "koshi", "ashi", "sutemi"].includes(t.g) && t.p === "erw").length === 15);
  check("Basispool 8 Würfe, ab 5. Kyu 6 dazu", POOL.basis.length === 8 && POOL.ab5.length === 6);
  check("27 Quiz-Vokabeln", VOCAB.length === 27);

  const ids = new Set();
  let poolsOk = true, idsOk = true, pflichtOk = true, erwOk = true;
  const tech = n => TECH.find(t => t.n === n);
  BELTS.forEach(b => b.abschnitte.forEach(a => a.inhalt.forEach(i => {
    const key = b.id + ":" + i.id;
    if (ids.has(key)) idsOk = false; ids.add(key);
    if (!i.pool) return;
    const p = i.pool;
    if (!p.aus.every(t => namen.has(t)) || p.aus.length < p.n) poolsOk = false;
    if (!(p.pflicht || []).every(t => p.aus.includes(t)) || (p.pflicht || []).length > p.n) pflichtOk = false;
    if ((p.minErw || 0) > p.aus.filter(t => tech(t).p === "erw").length) erwOk = false;
  })));
  check("IDs pro Gürtel eindeutig", idsOk);
  check("Pools nur mit bekannten Techniken und groß genug", poolsOk);
  check("Pflichttechniken stehen im Pool", pflichtOk);
  check("Erweiterungs-Mindestzahl ist erreichbar", erwOk);

  const pool = (kyu, id) => BELTS.find(b => b.kyu === kyu).abschnitte.flatMap(a => a.inhalt).find(i => i.id === id).pool;
  check("Würfe je Gürtel: 3/6/9/12/15/18/20",
    [7, 6, 5, 4, 3, 2, 1].map(k => pool(k, "wuerfe").n).join() === "3,6,9,12,15,18,20");
  check("Erweiterung je Gürtel: 3/6/9 ab 3. Kyu",
    [3, 2, 1].map(k => pool(k, "wuerfe").minErw).join() === "3,6,9");
  check("Pflichtwürfe 4. Kyu", pool(4, "wuerfe").pflicht.join() === "O-soto-gari,Harai-goshi,Uchi-mata");
  check("Pflichtwürfe 3./2./1. Kyu",
    pool(3, "wuerfe").pflicht.join() === "Tomoe-nage,Tani-otoshi" &&
    pool(2, "wuerfe").pflicht.join() === "Sumi-gaeshi,Soto-makikomi" &&
    pool(1, "wuerfe").pflicht.join() === "Ura-nage,Ko-uchi-makikomi");
  check("7. Kyu: vier Pflicht-Haltegriffe", pool(7, "halten").pflicht.length === 4 && pool(7, "halten").n === 4);
  check("Hebel 4. Kyu (3, Pflicht Juji-gatame/Ude-garami)",
    pool(4, "hebel").n === 3 && pool(4, "hebel").pflicht.join() === "Juji-gatame,Ude-garami");
  check("Hebel 3. Kyu (4 aus Erweiterung)",
    pool(3, "hebel").n === 4 && pool(3, "hebel").aus.every(t => tech(t).p === "erw"));
  check("Würger 2. Kyu 3, 1. Kyu 4", pool(2, "wuerger").n === 3 && pool(1, "wuerger").n === 4);
  return check.ergebnis();
};
