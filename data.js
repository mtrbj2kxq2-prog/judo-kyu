/* Prüfungsinhalte nach „Anforderungen für Kyu-Grade im DJB", Stand 01.02.2024.
   Nur Daten – keine Oberfläche. Wird im Browser und in den Tests geladen. */

const GRUPPEN = {
  te:       { name: "Te-waza",       deutsch: "Handwurf" },
  koshi:    { name: "Koshi-waza",    deutsch: "Hüftwurf" },
  ashi:     { name: "Ashi-waza",     deutsch: "Fußwurf" },
  sutemi:   { name: "Sutemi-waza",   deutsch: "Opferwurf" },
  osaekomi: { name: "Osaekomi-waza", deutsch: "Haltegriff" },
  kansetsu: { name: "Kansetsu-waza", deutsch: "Hebel" },
  shime:    { name: "Shime-waza",    deutsch: "Würger" },
};

// n = Name, g = Gruppe, p = "grund" (Grundprogramm) oder "erw" (Erweiterungsprogramm)
const TECH = [
  // Würfe Grundprogramm
  { n: "Seoi-nage", g: "te", p: "grund" },
  { n: "Ippon-seoi-nage", g: "te", p: "grund" },
  { n: "Tai-otoshi", g: "te", p: "grund" },
  { n: "O-goshi", g: "koshi", p: "grund" },
  { n: "Uki-goshi", g: "koshi", p: "grund" },
  { n: "Koshi-guruma", g: "koshi", p: "grund" },
  { n: "Tsurikomi-goshi", g: "koshi", p: "grund" },
  { n: "Sode-tsurikomi-goshi", g: "koshi", p: "grund" },
  { n: "Harai-goshi", g: "koshi", p: "grund" },
  { n: "De-ashi-harai", g: "ashi", p: "grund" },
  { n: "O-soto-gari", g: "ashi", p: "grund" },
  { n: "O-uchi-gari", g: "ashi", p: "grund" },
  { n: "Ko-uchi-gari", g: "ashi", p: "grund" },
  { n: "Ko-soto-gari/-gake", g: "ashi", p: "grund" },
  { n: "Sasae-tsurikomi-ashi", g: "ashi", p: "grund" },
  { n: "Uchi-mata", g: "ashi", p: "grund" },
  // Würfe Erweiterungsprogramm
  { n: "Kata-guruma", g: "te", p: "erw" },
  { n: "Uki-otoshi", g: "te", p: "erw" },
  { n: "Tsuri-goshi", g: "koshi", p: "erw" },
  { n: "Utsuri-goshi", g: "koshi", p: "erw" },
  { n: "Ashi-guruma", g: "ashi", p: "erw" },
  { n: "Okuri-ashi-harai", g: "ashi", p: "erw" },
  { n: "Tomoe-nage", g: "sutemi", p: "erw" },
  { n: "Sumi-gaeshi", g: "sutemi", p: "erw" },
  { n: "Ura-nage", g: "sutemi", p: "erw" },
  { n: "Tani-otoshi", g: "sutemi", p: "erw" },
  { n: "Soto-makikomi", g: "sutemi", p: "erw" },
  { n: "Ko-uchi-makikomi", g: "sutemi", p: "erw" },
  // Boden Grundprogramm
  { n: "Kuzure-kesa-gatame", g: "osaekomi", p: "grund" },
  { n: "Kesa-gatame", g: "osaekomi", p: "grund" },
  { n: "Yoko-shiho-gatame", g: "osaekomi", p: "grund" },
  { n: "Kami-shiho-gatame", g: "osaekomi", p: "grund" },
  { n: "Tate-shiho-gatame", g: "osaekomi", p: "grund" },
  { n: "Juji-gatame", g: "kansetsu", p: "grund" },
  { n: "Ude-garami", g: "kansetsu", p: "grund" },
  { n: "Gyaku-juji-jime", g: "shime", p: "grund" },
  { n: "Okuri-eri-jime", g: "shime", p: "grund" },
  // Boden Erweiterungsprogramm
  { n: "Kata-gatame", g: "osaekomi", p: "erw" },
  { n: "Kuzure-kami-shiho-gatame", g: "osaekomi", p: "erw" },
  { n: "Ushiro-kesa-gatame", g: "osaekomi", p: "erw" },
  { n: "Ura-gatame", g: "osaekomi", p: "erw" },
  { n: "Uki-gatame", g: "osaekomi", p: "erw" },
  { n: "Waki-gatame", g: "kansetsu", p: "erw" },
  { n: "Ude-gatame", g: "kansetsu", p: "erw" },
  { n: "Hiza-gatame", g: "kansetsu", p: "erw" },
  { n: "Sankaku-gatame", g: "kansetsu", p: "erw" },
  { n: "Katate-jime", g: "shime", p: "erw" },
  { n: "Kataha-jime", g: "shime", p: "erw" },
  { n: "Hadaka-jime", g: "shime", p: "erw" },
  { n: "Sode-guruma-jime", g: "shime", p: "erw" },
  { n: "Sankaku-jime", g: "shime", p: "erw" },
  { n: "Tsukkomi-jime", g: "shime", p: "erw" },
];

const WURF_GRUPPEN = ["te", "koshi", "ashi", "sutemi"];
const namen = (filter) => TECH.filter(filter).map(t => t.n);

const POOL = {
  basis: ["Seoi-nage", "Ippon-seoi-nage", "Tai-otoshi", "O-goshi", "Uki-goshi", "O-soto-gari", "De-ashi-harai", "O-uchi-gari"],
  ab5: ["Tsurikomi-goshi", "Sode-tsurikomi-goshi", "Harai-goshi", "Sasae-tsurikomi-ashi", "Ko-uchi-gari", "Uchi-mata"],
  wurfGrund: namen(t => WURF_GRUPPEN.includes(t.g) && t.p === "grund"),
  wurfAlle:  namen(t => WURF_GRUPPEN.includes(t.g)),
  halteweitere: ["Kuzure-kesa-gatame", ...namen(t => t.g === "osaekomi" && t.p === "erw")],
  hebelAlle: namen(t => t.g === "kansetsu"),
  hebelErw:  namen(t => t.g === "kansetsu" && t.p === "erw"),
  wuergerAlle: namen(t => t.g === "shime"),
};

/* Ein Gürtel besteht aus Abschnitten. Jeder Inhalt ist entweder
   - ein Punkt   { id, text }                              → einfach abhaken
   - ein Pool    { id, text, pool: { n, aus, pflicht, minErw, hinweis } }
                 → n Techniken aus „aus" wählen; Pflicht muss dabei sein,
                   minErw = so viele davon aus dem Erweiterungsprogramm. */
const BELTS = [
  {
    id: "k8", kyu: 8, name: "weiß-gelb", farben: ["weiss", "gelb"],
    abschnitte: [
      { titel: "Grundverständnis", inhalt: [
        { id: "werte", text: "Werte und Etikette im Judo kennen und zeigen" },
        { id: "fallen", text: "Sicher fallen" },
        { id: "werfen", text: "Kontrolliert werfen" },
        { id: "boden", text: "Am Boden auf den Rücken bringen und halten" },
        { id: "abklopfen", text: "Abklopfen heißt Stopp" },
      ] },
    ],
  },
  {
    id: "k7", kyu: 7, name: "gelb", farben: ["gelb"],
    abschnitte: [
      { titel: "Fallen", inhalt: [
        { id: "fallen", text: "Fallen aus dem Stand rückwärts, seitwärts und Rolle (eine Seite)" },
        { id: "uke", text: "Als Uke Ausgangssituationen herstellen" },
        { id: "vert-halten", text: "Einfache Verteidigung gegen Haltegriffe" },
      ] },
      { titel: "Würfe", inhalt: [
        { id: "wuerfe", text: "3 Würfe aus dem Basispool", pool: { n: 3, aus: POOL.basis,
          hinweis: "1 Eindrehtechnik Hauptseite, 1 Gegenseite, 1 Fußtechnik" } },
      ] },
      { titel: "Boden", inhalt: [
        { id: "halten", text: "Haltegriffe", pool: { n: 4,
          aus: ["Kesa-gatame", "Tate-shiho-gatame", "Yoko-shiho-gatame", "Kami-shiho-gatame"],
          pflicht: ["Kesa-gatame", "Tate-shiho-gatame", "Yoko-shiho-gatame", "Kami-shiho-gatame"] } },
        { id: "wechsel", text: "2 Haltegriffwechsel" },
        { id: "uebergang", text: "Übergang vom Wurf zum Halten" },
      ] },
      { titel: "Randori", inhalt: [
        { id: "randori", text: "Je 2 Aufgaben-Randori im Stand und am Boden, je 2 Minuten" },
      ] },
    ],
  },
  {
    id: "k6", kyu: 6, name: "gelb-orange", farben: ["gelb", "orange"],
    abschnitte: [
      { titel: "Fallen", inhalt: [
        { id: "fallen", text: "Fallen aus dem Stand beidseitig: rückwärts mit Rolle, seitwärts, Rolle vorwärts" },
      ] },
      { titel: "Würfe", inhalt: [
        { id: "wuerfe", text: "6 Würfe aus dem Basispool", pool: { n: 6, aus: POOL.basis,
          hinweis: "2 Eindrehtechniken Hauptseite, 2 Gegenseite, 2 Fußtechniken" } },
      ] },
      { titel: "Boden", inhalt: [
        { id: "halten", text: "4 weitere Haltegriffe", pool: { n: 4, aus: POOL.halteweitere,
          hinweis: "Varianten sind erlaubt" } },
        { id: "wechsel", text: "3 Haltegriffwechsel" },
        { id: "umdrehen", text: "Umdrehen aus der Bauchlage" },
      ] },
      { titel: "Wettkampf oder Randori", inhalt: [
        { id: "randori", text: "1 offizieller Wettkampf (Judopass) oder je 2 Randori im Stand und am Boden, je 2 Minuten" },
      ] },
    ],
  },
  {
    id: "k5", kyu: 5, name: "orange", farben: ["orange"],
    abschnitte: [
      { titel: "Fallen", inhalt: [
        { id: "fallen", text: "Fallen aus dem Gehen beidseitig" },
        { id: "uke", text: "Ausgangssituationen herstellen" },
        { id: "abwehr", text: "Abwehr gegen Hebel" },
      ] },
      { titel: "Würfe", inhalt: [
        { id: "wuerfe", text: "9 Würfe", pool: { n: 9, aus: [...POOL.basis, ...POOL.ab5],
          hinweis: "3 Eindrehtechniken Hauptseite, 3 Gegenseite, 3 Fußtechniken" } },
      ] },
      { titel: "Boden", inhalt: [
        { id: "bauch", text: "Befreiung: auf den Bauch drehen" },
        { id: "bein", text: "Befreiung: Bein klammern" },
        { id: "zwischen", text: "Befreiung: Gegner zwischen die Beine nehmen" },
        { id: "bruecke", text: "Befreiung: mit Brücke überrollen" },
        { id: "wdh", text: "Wiederholung 7. bis 6. Kyu" },
        { id: "beinklammer", text: "Beinklammer lösen" },
        { id: "bank", text: "Angriff gegen die Bankposition" },
      ] },
      { titel: "Wettkampf oder Randori", inhalt: [
        { id: "randori", text: "2 Wettkämpfe oder Randori, je 2 Minuten" },
      ] },
    ],
  },
  {
    id: "k4", kyu: 4, name: "orange-grün", farben: ["orange", "gruen"],
    abschnitte: [
      { titel: "Fallen", inhalt: [
        { id: "fallen", text: "Fallen aus zügiger Bewegung beidseitig" },
        { id: "uke", text: "Ausgangssituationen herstellen" },
        { id: "abwehr", text: "Abwehr gegen Hebel" },
      ] },
      { titel: "Würfe", inhalt: [
        { id: "wuerfe", text: "12 Würfe aus dynamischen Situationen", pool: { n: 12, aus: POOL.wurfGrund,
          pflicht: ["O-soto-gari", "Harai-goshi", "Uchi-mata"] } },
      ] },
      { titel: "Boden", inhalt: [
        { id: "hebel", text: "3 Hebel", pool: { n: 3, aus: POOL.hebelAlle,
          pflicht: ["Juji-gatame", "Ude-garami"] } },
        { id: "wdh", text: "Wiederholung 7. bis 5. Kyu" },
        { id: "rueckenlage-eigen", text: "Angriff aus der eigenen Rückenlage" },
        { id: "rueckenlage-gegner", text: "Angriff gegen die gegnerische Rückenlage" },
      ] },
      { titel: "Wettkampf oder Randori", inhalt: [
        { id: "randori", text: "2 Wettkämpfe oder Randori, je 2 Minuten" },
      ] },
    ],
  },
  {
    id: "k3", kyu: 3, name: "grün", farben: ["gruen"],
    abschnitte: [
      { titel: "Fallen", inhalt: [
        { id: "frei", text: "Zusätzlich freier Fall" },
        { id: "abwehr", text: "Abwehr gegen Hebel" },
      ] },
      { titel: "Würfe", inhalt: [
        { id: "wuerfe", text: "15 Würfe", pool: { n: 15, aus: POOL.wurfAlle, minErw: 3,
          pflicht: ["Tomoe-nage", "Tani-otoshi"] } },
        { id: "konter", text: "1 Konter" },
        { id: "finte", text: "1 Finte" },
        { id: "kombi", text: "1 Kombination" },
      ] },
      { titel: "Boden", inhalt: [
        { id: "hebel", text: "4 Hebel aus dem Erweiterungsprogramm", pool: { n: 4, aus: POOL.hebelErw,
          pflicht: ["Hiza-gatame", "Sankaku-gatame"] } },
        { id: "wdh", text: "Wiederholung 7. bis 4. Kyu" },
        { id: "position", text: "1 Positionswechsel von Verteidigung zu Angriff" },
      ] },
      { titel: "Wettkampf oder Randori", inhalt: [
        { id: "randori", text: "3 Wettkämpfe oder Randori, je 3 Minuten" },
      ] },
    ],
  },
  {
    id: "k2", kyu: 2, name: "blau", farben: ["blau"],
    abschnitte: [
      { titel: "Fallen", inhalt: [
        { id: "fallen", text: "Alle bisherigen Falltechniken" },
        { id: "abwehr", text: "Abwehr gegen Würger" },
      ] },
      { titel: "Würfe", inhalt: [
        { id: "wuerfe", text: "18 Würfe", pool: { n: 18, aus: POOL.wurfAlle, minErw: 6,
          pflicht: ["Sumi-gaeshi", "Soto-makikomi"] } },
        { id: "konter", text: "1 Konter (DJB-Musterlösung)" },
        { id: "finte", text: "1 Finte (DJB-Musterlösung)" },
        { id: "kombi", text: "1 Kombination (DJB-Musterlösung)" },
        { id: "griff", text: "Grifferarbeitung inkl. Griff lösen mit Wurf in Ai-yotsu und Kenka-yotsu" },
      ] },
      { titel: "Boden", inhalt: [
        { id: "wuerger", text: "3 Würger", pool: { n: 3, aus: POOL.wuergerAlle,
          pflicht: ["Gyaku-juji-jime", "Okuri-eri-jime"], hinweis: "Okuri-eri-jime als Koshi-jime" } },
        { id: "wdh", text: "Wiederholung 7. bis 4. Kyu" },
        { id: "position", text: "2 Positionswechsel" },
      ] },
      { titel: "Wettkampf oder Randori", inhalt: [
        { id: "randori", text: "3 Wettkämpfe oder Randori, je 3 Minuten" },
      ] },
    ],
  },
  {
    id: "k1", kyu: 1, name: "braun", farben: ["braun"],
    abschnitte: [
      { titel: "Fallen", inhalt: [
        { id: "fallen", text: "Alle bisherigen Falltechniken" },
        { id: "abwehr", text: "Abwehr gegen alle Bodentechniken" },
      ] },
      { titel: "Würfe", inhalt: [
        { id: "wuerfe", text: "20 Würfe", pool: { n: 20, aus: POOL.wurfAlle, minErw: 9,
          pflicht: ["Ura-nage", "Ko-uchi-makikomi"] } },
        { id: "konter", text: "2 Konter" },
        { id: "finte", text: "2 Finten" },
        { id: "kombi", text: "2 Kombinationen" },
      ] },
      { titel: "Boden", inhalt: [
        { id: "wuerger", text: "4 Würger", pool: { n: 4, aus: POOL.wuergerAlle,
          pflicht: ["Sode-guruma-jime", "Okuri-eri-jime"], hinweis: "Okuri-eri-jime als Rollwürger" } },
        { id: "wdh", text: "Wiederholung 7. bis 4. Kyu" },
        { id: "uebergang", text: "Übergang Stand–Boden aus Ai-yotsu und Kenka-yotsu" },
        { id: "position", text: "3 Positionswechsel" },
      ] },
      { titel: "Persönlicher Schwerpunkt", inhalt: [
        { id: "schwerpunkt", text: "Etwa 10 Aktionen aus Randori/Wettkampf, Kata, Selbstverteidigung oder Taiso" },
      ] },
      { titel: "Wettkampf oder Randori", inhalt: [
        { id: "randori", text: "3 Wettkämpfe oder Randori, je 3 Minuten" },
      ] },
    ],
  },
];

// Bedeutungen sind Standardübersetzungen, nicht aus dem DJB-Dokument
const VOCAB = [
  ["Tori", "führt die Technik aus"],
  ["Uke", "nimmt die Technik an"],
  ["Ukemi", "Falltechnik"],
  ["Nage-waza", "Wurftechniken"],
  ["Katame-waza", "Bodentechniken"],
  ["Osaekomi-waza", "Haltetechniken"],
  ["Kansetsu-waza", "Hebeltechniken"],
  ["Shime-waza", "Würgetechniken"],
  ["Randori", "freies Üben"],
  ["Shiai", "Wettkampf"],
  ["Kuzushi", "Gleichgewicht brechen"],
  ["Tsukuri", "Wurf vorbereiten/eindrehen"],
  ["Kake", "Wurf ausführen"],
  ["Hajime", "Beginnt!"],
  ["Matte", "Wartet!"],
  ["Sore-made", "Ende des Kampfes"],
  ["Rei", "Gruß"],
  ["Ippon", "voller Punkt"],
  ["Waza-ari", "halbe Wertung"],
  ["Toketa", "Haltegriff gelöst"],
  ["Ai-yotsu", "gleiche Auslage"],
  ["Kenka-yotsu", "gegengleiche Auslage"],
  ["Dojo", "Übungsraum"],
  ["Judogi", "Judoanzug"],
  ["Obi", "Gürtel"],
  ["Migi", "rechts"],
  ["Hidari", "links"],
];

const QUELLE = {
  titel: "Anforderungen für Kyu-Grade im DJB",
  stand: "01.02.2024",
  url: "https://www.judobund.de/fileadmin/user_upload/judobund.de/Downloads/Downloadcenter/Kyu-Graduierungen/Anforderungen_fuer_Kyu-Grade_2024.pdf",
};

if (typeof module !== "undefined") module.exports = { GRUPPEN, TECH, POOL, BELTS, VOCAB, QUELLE };
