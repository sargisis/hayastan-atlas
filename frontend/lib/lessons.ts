export interface LessonStep {
  year: number;
  title: string;
  title_hy: string;
  body: string;
  body_hy: string;
}

export interface Lesson {
  id: string;
  title: string;
  title_hy: string;
  subtitle: string;
  subtitle_hy: string;
  icon: string;
  color: string;
  steps: LessonStep[];
}

export const LESSONS: Lesson[] = [
  {
    id: "urartu",
    title: "The Kingdom of Urartu",
    title_hy: "Ուրարտուի Թagavorum",
    subtitle: "The first great Armenian state, 860–590 BC",
    subtitle_hy: "Առաջին հայկական մեծ պետությունը",
    icon: "🏔️",
    color: "#8e5bb5",
    steps: [
      {
        year: -860,
        title: "Birth of Urartu",
        title_hy: "Ուրարտուի ծնունд",
        body: "Around 860 BC, the tribes of the Armenian highlands unite under King Arame, forming the kingdom of Urartu — the first major state of the Armenian plateau, centered around Lake Van.",
        body_hy: "Մ.թ.ա. 860-ին հայկական բարձրավանդակի ցեղերը միավորվում են Արամ արքայի ղekavar_uts_yamb ՝ կազমelova Ուրartu թagavorutíyune",
      },
      {
        year: -782,
        title: "Argishti I — Empire Builder",
        title_hy: "Արգiштi Ա — Կaysobnyak",
        body: "Under Argishti I, Urartu reaches its greatest extent — stretching from the Caucasus to northern Syria. He defeats Assyria and founds the city of Erebuni (modern Yerevan) in 782 BC.",
        body_hy: "Արargishti A-ի ufots Ուrartun hisanel e ama mets shtapanqe. Na haghtenum e Asori kaiserututyune ev hsnuel e Erebuni qalaqe (arayhn Yerevan) mth.a. 782-in.",
      },
      {
        year: -714,
        title: "Assyrian Pressure",
        title_hy: "Асori uxgharumner",
        body: "Assyrian king Sargon II launches a devastating campaign into Urartu, sacking the sacred city of Musasir. Despite heavy losses, Urartu survives and continues for another century.",
        body_hy: "Ason thagavor Sarghon В-n arahoum e karavichakayin artakhum Uraruyi vra, koghopatum e Musasir.",
      },
      {
        year: -640,
        title: "Scythian Invasions",
        title_hy: "Skytefneri artakhumner",
        body: "Waves of Scythian nomads from the north weaken Urartu significantly. The kingdom fragments but the Armenian people preserve their culture and identity on the plateau.",
        body_hy: "Hyusisits skythefneri arahoum nerbagrum e Uraruyi vra. Thyagavorutyune xakhvum e, bayts hay zhoghovordy pakhpanum e mshakuyte.",
      },
      {
        year: -590,
        title: "Fall and Transformation",
        title_hy: "Ankume ev Vardzakerpum",
        body: "Urartu falls to the Medes around 590 BC, but its legacy lives on. The Armenian people absorb Urartian culture, language elements, and state traditions — forming the foundation of all future Armenian kingdoms.",
        body_hy: "Uraruyn angnume Midaknerin mth.a. 590-i karum, bayts nra zharaghapumnere shhajum en. Hay zhoghovordy kalandum e uraruyan mshakuyt.",
      },
    ],
  },
  {
    id: "tigranes",
    title: "Tigranes the Great",
    title_hy: "Տիgran Mets",
    subtitle: "Armenia's golden age of conquest, 95–55 BC",
    subtitle_hy: "Հayastani oryakan dorin kalandum",
    icon: "⚔️",
    color: "#e74c3c",
    steps: [
      {
        year: -95,
        title: "Tigranes Takes the Throne",
        title_hy: "Tigran bathagahire gahoum e",
        body: "Tigranes II ascends to the Armenian throne in 95 BC after 20 years as a hostage of the Parthians. He immediately begins expanding the kingdom, reclaiming lands lost under his predecessors.",
        body_hy: "Tigran B-n bathoum e hayots gahine mth.a. 95-in, 20 tarva parskastan pahoven heto. Nա anter sksnum e eshpanhel thyagorautyunne.",
      },
      {
        year: -83,
        title: "King of Kings",
        title_hy: "Thyagavorats Thyagavor",
        body: "By 83 BC, Tigranes has conquered Mesopotamia, Syria, Phoenicia, Cilicia, and parts of Cappadocia. Greek cities hail him as 'King of Kings'. Armenia becomes the strongest power in the Middle East.",
        body_hy: "Mth.a. 83-ik Tigran nvamel e Mesopotamia, Siria, Foniqia, Qiliqia. Huyner kin anvanum en 'Thyagorots Thyagovor'.",
      },
      {
        year: -77,
        title: "Tigranocerta — A New Capital",
        title_hy: "Tigranakert — Nor Maghaqaghak",
        body: "Tigranes founds a magnificent new capital, Tigranocerta, in 77 BC. He populates it with thousands of Greeks, Syrians, and Cilicians brought from conquered lands. It becomes a center of Hellenistic culture.",
        body_hy: "Tigran hastat e vehashan nor maghaqaghak - Tigranakert mth.a. 77-in. Noren kazmakerpum e hazer hogieneri haschiv.",
      },
      {
        year: -69,
        title: "Battle of Tigranocerta",
        title_hy: "Tigranakert chtakamar",
        body: "Roman general Lucullus defeats Tigranes at Tigranocerta in 69 BC. Despite Tigranes' vast army, Roman discipline prevails. The empire begins to shrink, but Armenia remains independent.",
        body_hy: "Mth.a. 69-in Hayrik chtakamarne nvin Tigrani vra Tigranakert-um. Romayin khisnarrume geritsanum e. Kaiserututyune sksnum e nvazel.",
      },
      {
        year: -66,
        title: "Peace with Rome",
        title_hy: "Khorhurd Romei het",
        body: "After negotiations with Pompey in 66 BC, Tigranes surrenders his western conquests but keeps Greater Armenia. He lives to 85 and rules for 40 more years — a remarkable ending for one of history's greatest conquerors.",
        body_hy: "Mth.a. 66-in Pompeosi het paragayits heto Tigran hyusis katordum e arevelyan nvacharqnere, bayts patahum e Mets Hayasytane.",
      },
    ],
  },
  {
    id: "avarayr",
    title: "The Holy Defeat — Battle of Avarayr",
    title_hy: "Surb Patkerumna — Avarayri Chtakamar",
    subtitle: "Armenia's fight for Christianity, 451 AD",
    subtitle_hy: "Hayastani portze Qristonutyan hamar",
    icon: "✝️",
    color: "#a78bfa",
    steps: [
      {
        year: 301,
        title: "Armenia Adopts Christianity",
        title_hy: "Hayastand Qristonutyan e Endunum",
        body: "In 301 AD, Armenia becomes the first nation in history to adopt Christianity as its state religion, under King Tiridates III and St. Gregory the Illuminator. This shapes Armenian identity for the next 1700 years.",
        body_hy: "301 th-in Hayastane darum e ashkharhi aradjin petutchyune, arum e Qristonutyune pazekon kariutch. Arkayin Trdat Gam en Surb Grigor Lusavorichin harev.",
      },
      {
        year: 387,
        title: "Armenia Divided",
        title_hy: "Hayastani Barkhnum",
        body: "The Roman and Persian Empires divide Armenia between themselves in 387 AD. The western part goes to Rome, the larger eastern portion to Persia. Armenian nobles (nakharars) retain significant power in both parts.",
        body_hy: "387 th-in Romakan ev Parskastan Kapasroutchyunnere barakhnum en Hayastane: arevelyan masn anyalum e Parskastandin, arevelyan masne Romein.",
      },
      {
        year: 449,
        title: "Persia Demands Zoroastrianism",
        title_hy: "Parskastand Petel e Zoroastrakan Kargyun",
        body: "Sassanid Persian king Yazdegerd II orders Armenians to abandon Christianity and adopt Zoroastrianism. The Armenian nobility, led by Vardan Mamikonian, refuse — preparing for war.",
        body_hy: "Sassanyan Parsk arqa Yazdegerd B-n hramayum e hayere gyan e Qristonutyunits ev yndunele Zoroastranism. Vartanank Mamikonyanner gaghtanakan e.",
      },
      {
        year: 451,
        title: "Battle of Avarayr — The Holy Defeat",
        title_hy: "Avarayri Chtakamar — Surb Pankhum",
        body: "On June 2, 451 AD, Vardan Mamikonian leads 66,000 Armenian warriors against 200,000 Persian soldiers. Armenians lose the battle and Vardan is killed, but Persia is so weakened that they grant Armenia religious freedom 30 years later.",
        body_hy: "451 th. Hoonisin 2-in Vardan Mamikonyane hoverekem e 66,000 hay zinvorneri het 200,000 parsk zinvorneri deme. Vartanank korysum e chtakamare, bayts Parskastand 30 tarit heto gtchum e karonakan azatutyun.",
      },
      {
        year: 484,
        title: "The Nvarsak Treaty",
        title_hy: "Nvarsaki Patchaghamanke",
        body: "In 484 AD, Persia signs the Nvarsak Treaty, granting Armenians full religious freedom. Avarayr is thus considered a 'holy defeat' — Armenians lost the battle but won the war for their Christian identity.",
        body_hy: "484 th-in Parskastand trachagrum e Nvarsaki Patchaghamank-e, talov Hayeri kayelin kron azatutyun. Avarayrin anvanvum e 'surb paknumk'.",
      },
    ],
  },
  {
    id: "bagratid",
    title: "The Bagratid Golden Age",
    title_hy: "Bagratuninerets Votchkeghin Dorin",
    subtitle: "Armenia's last great medieval kingdom, 885–1064 AD",
    subtitle_hy: "Hayastani verchin mets mijnadaryan thyagavorutyun",
    icon: "👑",
    color: "#27ae60",
    steps: [
      {
        year: 862,
        title: "Ashot the Great Rises",
        title_hy: "Askhot Mets-i Baysman",
        body: "Ashot Bagratuni, head of the Bagratid dynasty, gradually unifies the Armenian princes under his leadership. He expertly navigates between the Arab Caliphate, Byzantium, and local rivals to build power.",
        body_hy: "Askhot Bagratuni, kanapatarman Bagratuniner, kamanakalar miavoernum e hay ishkhanner. Navan stekhtsum e tarachkayin arabjakan, bizandiakan ev teghain maratakerner shijch.",
      },
      {
        year: 885,
        title: "Armenia Independent Again",
        title_hy: "Hayastand Noren Ankakha",
        body: "In 885 AD, both the Abbasid Caliph and the Byzantine Emperor recognize Ashot I as King of Armenia — the first independent Armenian king in 500 years. The Bagratid kingdom begins its golden age.",
        body_hy: "885 th-in Abbasid Khalifan ev Bizandiakan Kaypare chtanachar en Askhot A-e Hayots Thagavor. Patmuthyan mej 500 tarop aradjin ankakh hay thagavore.",
      },
      {
        year: 961,
        title: "Ani — The Magnificent Capital",
        title_hy: "Ani — Yeraneli Mayrakhaqaqh",
        body: "King Abas moves the capital to Ani in 961. The city grows to over 100,000 people, becoming one of the largest cities in the world. Its massive walls, churches, and palaces rival Constantinople and Baghdad.",
        body_hy: "961 th-in Abas Thagavore Haytarakhagutte tegalit e Any. Qaghaqe mets anoom e 100,000 bnakin, darum e erkil mets qaghaqneris mej mnats. Nra paytsaravank bishkhann, hayrvardnery, palatnere motenalum en Konstantnupolsin.",
      },
      {
        year: 1001,
        title: "The Kingdom at Its Peak",
        title_hy: "Thyagavorutyan Galardavandake",
        body: "Under Gagik I (989-1020), Armenia reaches its greatest Bagratid extent. The capital Ani is a bustling metropolis. Armenian merchants trade from Constantinople to India. Art, literature, and architecture flourish.",
        body_hy: "Gagik A-i (989-1020) orok Hayastane haysnaum e Bagratuni thyagavorutyani makelavorutyan artsinchov. Mayraqaghaq Anin louyuts metropol e.",
      },
      {
        year: 1064,
        title: "Fall of Ani",
        title_hy: "Anyi Ankume",
        body: "Seljuk Turkish Sultan Alp Arslan captures Ani in 1064 after a brutal siege, massacring much of the population. This marks the end of the Bagratid golden age. Armenians begin their great diaspora across the world.",
        body_hy: "1064 th-in Seljukyan Turk Sherthan Alp Arslan berdajirum e Anin mardamunuthiunneren skambelov. Sknvum e Bagratuninerets votchkegin shijchan vorjun.",
      },
    ],
  },
  {
    id: "independence",
    title: "Road to Modern Armenia",
    title_hy: "Chanaparhe depy Ardzhanagits Hayastan",
    subtitle: "From genocide to independence, 1915–1991",
    subtitle_hy: "Ceghaspanutiunits menchev ankakhutciun",
    icon: "🇦🇲",
    color: "#D90012",
    steps: [
      {
        year: 1915,
        title: "The Armenian Genocide",
        title_hy: "Hay Ceghaspan",
        body: "Beginning in April 1915, the Ottoman Empire systematically deports and massacres the Armenian population. Over 1.5 million Armenians perish. The survivors scatter across the world, creating the Armenian diaspora.",
        body_hy: "1915 th. April-in Osmanlyk Kaissarutiwne systemayor kazmakerpum e hay bnakanutyan arturanshkhum ev hartsamunery. Aveli quann 1.5 million hay angyanum e. Veraprodzhnere taratsum en amskar, stekhtsum en Spyurqe.",
      },
      {
        year: 1918,
        title: "Battle of Sardarapat",
        title_hy: "Sardarapati Chtakamar",
        body: "In May 1918, with Ottoman forces advancing, Armenians make their last stand at Sardarapat. The Armenian people — soldiers, farmers, women, and priests — all fight together and achieve a miraculous victory, saving the nation from complete annihilation.",
        body_hy: "1918 th. May-in, Osmanlyk ushermern artakhumnits arinorov, Hayere kharnem en Sardarapatom. Hay zhoghovurde — zinvornery, galatchinere, kaghakannere — bolor kanchankharirum en ev hasts enen harchakayin shtap.",
      },
      {
        year: 1920,
        title: "First Armenian Republic",
        title_hy: "Aradjin Hay Hanrapetutiun",
        body: "The First Republic of Armenia is declared in 1918, but faces immediate crises — war with Turkey and Azerbaijan, famine, and disease. In late 1920, Soviet forces enter Armenia. The republic lasts only 28 months.",
        body_hy: "1918 th-in hraparakvel e Hay Hanrapetutyan aradjin hanrapetutyunne. Bayts koghopatum e anghal chorumnerum — Turqiay ev Azerbaijani het chart, sakafman ev hnarneri het.",
      },
      {
        year: 1936,
        title: "Soviet Armenia",
        title_hy: "Sovetakan Hayastan",
        body: "As the Armenian Soviet Socialist Republic, Armenia experiences significant industrialization, education, and cultural development — but under strict Soviet control. Yerevan grows from a small town to a major city of over a million.",
        body_hy: "Hay SSR-um, Hayastane pathanyum e nshanakal arevodayutyun, krtutchiun ev mshakutaayin zarutchiun — bayts Sovetakan xusht varcholutyunn hncharavorutchiamb.",
      },
      {
        year: 1991,
        title: "Independence — September 21, 1991",
        title_hy: "Ankakhutciun — Septemher 21, 1991",
        body: "On September 21, 1991, Armenia declares independence from the Soviet Union in a referendum. After 70 years of Soviet rule and 600 years without a fully independent state, the Armenian people reclaim their sovereignty.",
        body_hy: "1991 th. Septemheri 21-in Hayastane miabararen hraparakum e ankakhutchiun HSSH-its. 70 tari sovetakan varcholutyunits ev 600 tarit zavak ankakh petakanutyunic heto hay zhoghovurde noren iravunq apelov e.",
      },
    ],
  },
];
