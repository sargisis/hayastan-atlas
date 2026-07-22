export interface LocationQuestion {
  id: string;
  year: number;
  question: string;
  question_hy: string;
  hint: string;
  hint_hy: string;
  lat: number;
  lng: number;
  region: string;
  region_hy: string;
}

export const LOCATION_QUESTIONS: LocationQuestion[] = [
  {
    id: "avarayr",
    year: 451,
    question: "Where did the Battle of Avarayr take place?",
    question_hy: "Որտե՞ղ տեղի ունեցավ Ավարայրի ճակատամարտը",
    hint: "A plain in the Artaz region, northwestern Iran",
    hint_hy: "Հարթավայր Արտազ գավառում, Հայաստան",
    lat: 39.15,
    lng: 44.72,
    region: "Artaz (northwestern Iran)",
    region_hy: "Արտազ (Մ. Ատրպ.)",
  },
  {
    id: "tigranocerta",
    year: -69,
    question: "Where was Tigranocerta, the capital built by Tigranes the Great?",
    question_hy: "Որտե՞ղ էր Տիգրանակերտ քաղաքը, Տիգրան Մեծի կառուցած մայրաքաղաքը",
    hint: "Near modern Diyarbakır or Silvan in southeastern Turkey",
    hint_hy: "Ժամ. Դիarbekir / Silvan մոտ, Թ-ում",
    lat: 37.9,
    lng: 41.5,
    region: "Southeastern Turkey (near Silvan)",
    region_hy: "Հ.-Արև. Թ. (Silvan)",
  },
  {
    id: "manzikert",
    year: 1071,
    question: "Where did the Battle of Manzikert take place?",
    question_hy: "Որտե՞ղ տեղի ունեցավ Մանազկերտի ճ.",
    hint: "Near Lake Van in eastern Turkey",
    hint_hy: "Վանա լճի մոտ, Արևլ. Թ.",
    lat: 38.95,
    lng: 42.52,
    region: "Manzikert (near Lake Van, Turkey)",
    region_hy: "Մanazgirt (Վ. Ծ. մ.)",
  },
  {
    id: "sardarapat",
    year: 1918,
    question: "Where was the Battle of Sardarapat fought?",
    question_hy: "Որտե՞ղ է տեղի ունեցել Sardarapatի ճ.",
    hint: "Near Armavir, western Armenia, about 50 km west of Yerevan",
    hint_hy: "Armavir մ., Արև. Հայ., Երևan-ից 50 կm-ov",
    lat: 40.0,
    lng: 43.8,
    region: "Sardarapat (near Armavir, Armenia)",
    region_hy: "Sardarapat (Armavir)",
  },
  {
    id: "artashat",
    year: -180,
    question: "Where was Artashat (Artaxata), Armenia's ancient capital?",
    question_hy: "Որտե՞ղ էր Արտաշատ, Հայ. Հին Մայրաqaghaqh",
    hint: "On the Araxes River, south of modern Yerevan in Armenia",
    hint_hy: "Araks ghetou av., Yerevan-i h.",
    lat: 39.96,
    lng: 44.55,
    region: "Artashat, Armenia (Araxes valley)",
    region_hy: "Արտաşat, Haylaran",
  },
  {
    id: "bagrevand",
    year: 775,
    question: "Where did the Battle of Bagrevand take place?",
    question_hy: "Որտե՞ղ կայացավ Bagrevandի ճ.",
    hint: "Near the Euphrates headwaters in eastern Turkey (Muş province area)",
    hint_hy: "Moush gavar, Arevelk. Turkia",
    lat: 39.6,
    lng: 43.4,
    region: "Bagrevand (eastern Turkey, near Muş)",
    region_hy: "Bagrevand (Muş gavar)",
  },
  {
    id: "van",
    year: -800,
    question: "Where was Tushpa, the capital of the Kingdom of Urartu?",
    question_hy: "Որտե՞ղ էր Tushpa, Urartu Tach-khagan-i maylraqaqh",
    hint: "On the eastern shore of Lake Van, eastern Turkey",
    hint_hy: "Vana tsov. Ar. ent., Haylaran",
    lat: 38.5,
    lng: 43.35,
    region: "Tushpa / Van Fortress (Lake Van)",
    region_hy: "Tushpa / Van berd (Vana lch)",
  },
  {
    id: "cilicia_sis",
    year: 1200,
    question: "Where was Sis, the capital of Armenian Cilicia?",
    question_hy: "Որտե՞ղ էր Sise, Kilikioy Hyastani maylraqaqh",
    hint: "In southern Turkey, now called Kozan, in Adana province",
    hint_hy: "Harav. Turkia, aysorva Kozan, Adana gavarr",
    lat: 37.45,
    lng: 35.82,
    region: "Sis / Kozan (Adana province, Turkey)",
    region_hy: "Sis / Kozan (Adana, Turkia)",
  },
  {
    id: "dvin",
    year: 600,
    question: "Where was Dvin, Armenia's medieval capital and trade hub?",
    question_hy: "Qrteg er Dvine, Hyastani Gajanamedge yev vacharkayin kentron",
    hint: "South of Yerevan in the Ararat valley, Armenia",
    hint_hy: "Yerevanin harav, Araratyan dash, Haylaran",
    lat: 39.93,
    lng: 44.58,
    region: "Dvin (Ararat valley, Armenia)",
    region_hy: "Dvin (Araratyan dasht)",
  },
  {
    id: "ani",
    year: 1000,
    question: "Where was Ani, the magnificent Bagratid capital called 'City of 1001 Churches'?",
    question_hy: "Qrteg er Anin, Bagrataduneac' maylraqaqh, 1001 ekegeciner",
    hint: "On the Turkish-Armenian border near Kars, now ruins in eastern Turkey",
    hint_hy: "Turk-Hay sarhanim, Kars-i mot, aysorva kahakaberd Turkiaum",
    lat: 40.5,
    lng: 43.57,
    region: "Ani (Kars province, Turkey)",
    region_hy: "Ani (Kars gavar, Turkia)",
  },
];

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function locationScore(km: number): number {
  if (km <= 30) return 100;
  if (km <= 80) return 90;
  if (km <= 150) return 75;
  if (km <= 300) return 55;
  if (km <= 500) return 35;
  if (km <= 1000) return 15;
  return 0;
}
