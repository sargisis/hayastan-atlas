export interface WorldEvent {
  civ: string;
  civ_hy: string;
  color: string;
  icon: string;
  fromYear: number;
  toYear: number;
  events: { year: number; text: string; text_hy: string }[];
}

export const WORLD_CIVILIZATIONS: WorldEvent[] = [
  {
    civ: "Roman / Byzantine Empire",
    civ_hy: "Հռոմ / Բյուզ.",
    color: "#e74c3c",
    icon: "🦅",
    fromYear: -753,
    toYear: 1453,
    events: [
      { year: -753, text: "Rome founded", text_hy: "Հռոմ հիմն." },
      { year: -264, text: "First Punic War begins", text_hy: "Առաջ. Punic պատ." },
      { year: -44, text: "Julius Caesar assassinated", text_hy: "Հուլ. Կեսარի սպ." },
      { year: 27, text: "Roman Empire begins (Augustus)", text_hy: "Հռոմ. կայս. ( Avgust.)" },
      { year: 117, text: "Empire at peak under Trajan", text_hy: "Կայս. գ. Траяни" },
      { year: 284, text: "Diocletian splits empire", text_hy: "Dioclet. բաժ. կայս." },
      { year: 330, text: "Constantinople founded", text_hy: "Կ-պոլ հիմն." },
      { year: 395, text: "Empire permanently divided", text_hy: "Կայս. վերջ. բաժ." },
      { year: 476, text: "Fall of Western Rome", text_hy: "Արևմ. Հռ. անկ." },
      { year: 527, text: "Justinian I begins reign", text_hy: "Հուստինյ. Ա" },
      { year: 1054, text: "Great Schism (East/West Church)", text_hy: "Մ. Sch." },
      { year: 1204, text: "Constantinople sacked by Crusaders", text_hy: "Կ-պոլ կողոպ." },
      { year: 1453, text: "Constantinople falls to Ottomans", text_hy: "Կ-պոլ ընկ. թ-ին" },
    ],
  },
  {
    civ: "Persian / Parthian / Sassanid",
    civ_hy: "Պարսկ. / Արշ. / Սասան.",
    color: "#9b59b6",
    icon: "🦁",
    fromYear: -550,
    toYear: 651,
    events: [
      { year: -550, text: "Cyrus founds Achaemenid Empire", text_hy: "Կյուրոս հիմ. Akhemenid." },
      { year: -490, text: "Battle of Marathon vs Greece", text_hy: "Maraton. cht." },
      { year: -330, text: "Alexander destroys Persia", text_hy: "Ал. ոչ. Պ." },
      { year: -247, text: "Parthian Empire rises", text_hy: "Արշ. կայս. բ." },
      { year: 224, text: "Sassanid Empire replaces Parthia", text_hy: "Սasanid կ. e." },
      { year: 260, text: "Sassanids capture Roman Emperor Valerian", text_hy: "Valerian bnd." },
      { year: 531, text: "Khosrow I — Sassanid golden age", text_hy: "Xosrov A" },
      { year: 651, text: "Arab conquest ends Sassanid Empire", text_hy: "Արաբ. Սasanid" },
    ],
  },
  {
    civ: "Arab Caliphate",
    civ_hy: "Արաբ. Խալ.",
    color: "#27ae60",
    icon: "☪️",
    fromYear: 632,
    toYear: 1258,
    events: [
      { year: 632, text: "Muhammad dies; Caliphate begins", text_hy: "Մ. վ.; Խ. սկ." },
      { year: 636, text: "Arabs defeat Byzantium at Yarmouk", text_hy: "Yarmouk cht." },
      { year: 661, text: "Umayyad Caliphate founded", text_hy: "Umayad հ." },
      { year: 750, text: "Abbasid Caliphate replaces Umayyads", text_hy: "Abbasid հ." },
      { year: 762, text: "Baghdad founded as capital", text_hy: "Baghd. հ." },
      { year: 1258, text: "Mongols sack Baghdad", text_hy: "Մ. Baghd." },
    ],
  },
  {
    civ: "Mongol Empire",
    civ_hy: "Մոնղ. Կայս.",
    color: "#e67e22",
    icon: "🐴",
    fromYear: 1206,
    toYear: 1368,
    events: [
      { year: 1206, text: "Genghis Khan unites Mongolia", text_hy: "Чingiz Xan" },
      { year: 1219, text: "Mongols invade Central Asia", text_hy: "Կ. Ас. արш." },
      { year: 1241, text: "Mongols reach Poland & Hungary", text_hy: "Polysha, Vengria" },
      { year: 1258, text: "Mongols destroy Baghdad", text_hy: "Baghd. ав." },
      { year: 1260, text: "Mongols stopped at Ain Jalut", text_hy: "Ain Jalut" },
      { year: 1368, text: "Mongol Yuan dynasty falls", text_hy: "Yuan ан." },
    ],
  },
  {
    civ: "Ottoman Empire",
    civ_hy: "Osmanlyk Kays.",
    color: "#c0392b",
    icon: "🌙",
    fromYear: 1299,
    toYear: 1922,
    events: [
      { year: 1299, text: "Osman I founds Ottoman state", text_hy: "Osman A հ." },
      { year: 1453, text: "Conquest of Constantinople", text_hy: "Կ-պոլ" },
      { year: 1520, text: "Suleiman the Magnificent", text_hy: "Suleiman Мets" },
      { year: 1571, text: "Battle of Lepanto — naval defeat", text_hy: "Lepanto" },
      { year: 1683, text: "Siege of Vienna — turning point", text_hy: "Vienna" },
      { year: 1915, text: "Armenian Genocide", text_hy: "Hay Ceghas." },
      { year: 1922, text: "Ottoman Empire dissolved", text_hy: "Osmanlyk ан." },
    ],
  },
  {
    civ: "Chinese Dynasties",
    civ_hy: "Չին. Արք.",
    color: "#F2A800",
    icon: "🐉",
    fromYear: -221,
    toYear: 1912,
    events: [
      { year: -221, text: "Qin unifies China", text_hy: "Qin մ." },
      { year: -206, text: "Han Dynasty begins", text_hy: "Han հ." },
      { year: 618, text: "Tang Dynasty — golden age", text_hy: "Tang" },
      { year: 1271, text: "Kublai Khan founds Yuan", text_hy: "Yuan" },
      { year: 1368, text: "Ming Dynasty", text_hy: "Ming" },
      { year: 1644, text: "Qing Dynasty", text_hy: "Qing" },
    ],
  },
];

export function getWorldContextForYear(year: number): { civ: string; civ_hy: string; color: string; icon: string; event: string; event_hy: string }[] {
  const result: { civ: string; civ_hy: string; color: string; icon: string; event: string; event_hy: string }[] = [];

  for (const wc of WORLD_CIVILIZATIONS) {
    if (year < wc.fromYear || year > wc.toYear) continue;

    // Find the most recent event at or before this year
    let best: { year: number; text: string; text_hy: string } | null = null;
    for (const ev of wc.events) {
      if (ev.year <= year) best = ev;
      else break;
    }
    if (!best) continue;

    result.push({
      civ: wc.civ,
      civ_hy: wc.civ_hy,
      color: wc.color,
      icon: wc.icon,
      event: best.text,
      event_hy: best.text_hy,
    });
  }

  return result;
}
