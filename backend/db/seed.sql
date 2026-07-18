-- Seed data: dynasties, eras, and kings for Armenian history
-- Timeline: 800 BC → 1918 AD

INSERT INTO dynasties (name, name_hy, start_year, end_year) VALUES
    ('Urartian',     'Ուրարտու',      -800, -590),
    ('Orontid',      'Երվանդունի',    -570, -200),
    ('Artaxiad',     'Արտաշեսյան',   -189,    1),
    ('Arsacid',      'Արշակունի',      12,  428),
    ('Bagratid',     'Բագրատունի',   885, 1045),
    ('Rubenid',      'Ռուբինյան',   1080, 1226),
    ('Hethumid',     'Հեթումյան',   1226, 1341);

INSERT INTO eras (name, start_year, end_year, capital, color, description) VALUES
    ('Kingdom of Urartu',          -800,  -590, 'Tushpa',    '#6c3483', 'Powerful Iron Age kingdom centered on Lake Van; predecessor state to Armenia'),
    ('Post-Urartu / Early Armenia',-590,  -570, 'Armavir',   '#9b59b6', 'Collapse of Urartu after Median invasion; early Armenian tribes consolidate'),
    ('Satrapy of Armenia',         -570,  -321, 'Armavir',   '#8e44ad', 'Armenian satrapy under Achaemenid Persia; Orontid governors'),
    ('Orontid Kingdom',            -321,  -189, 'Armavir',   '#2980b9', 'Semi-independent kingdom under Orontid dynasty after Alexander'),
    ('Artaxiad Kingdom',           -189,     1, 'Artaxata',  '#c0392b', 'Height of Armenian power; Tigranes II stretches borders from Caspian to Mediterranean'),
    ('Arsacid Armenia',              12,   428, 'Vagharshapat','#e67e22','Arsacid dynasty; Armenia becomes first Christian nation in 301 AD'),
    ('Marzpanate of Armenia',       428,   636, 'Dvin',      '#7f8c8d', 'Persian-administered province after end of Arsacid kingdom'),
    ('Arab-controlled Armenia',     636,   885, 'Dvin',      '#95a5a6', 'Under Arab Caliphate; Armenians resist but remain under foreign rule'),
    ('Bagratid Kingdom',            885,  1045, 'Ani',       '#27ae60', 'Golden age of medieval Armenia; Ani rivals Constantinople in size'),
    ('Fragmented Kingdoms',        1045,  1198, 'Various',   '#f39c12', 'After Seljuk invasion; Zakarids, Kyurikids and others compete'),
    ('Armenian Kingdom of Cilicia',1198,  1375, 'Sis',       '#16a085', 'Armenian crusader state in Cilicia; major ally of Western powers'),
    ('Ottoman/Persian Rule',       1375,  1828, NULL,        '#7f8c8d', 'Armenia divided between Ottoman and Safavid/Qajar empires'),
    ('Russian Armenia',            1828,  1918, 'Tiflis',    '#2c3e50', 'Eastern Armenia under Russian Empire after Treaty of Turkmenchay'),
    ('First Republic of Armenia',  1918,  1920, 'Yerevan',   '#e74c3c', 'First independent Armenian state in modern history; defeated by Soviet Russia'),
    ('Soviet Armenia',             1920,  1991, 'Yerevan',   '#c0392b', 'Armenian Soviet Socialist Republic; part of the USSR'),
    ('Republic of Armenia',        1991,  2025, 'Yerevan',   '#f39c12', 'Independent Republic of Armenia since dissolution of the USSR');

INSERT INTO kings (dynasty_id, name, name_hy, reign_start, reign_end, bio) VALUES
    -- Urartian kings
    (1, 'Sarduri I',      'Սարդուրի Ա',    -834, -828, 'Founded the city of Tushpa (Van); first great king of Urartu'),
    (1, 'Ishpuini',       'Իշպուինի',      -828, -810, 'Expanded Urartian territory into modern Armenia and Iran'),
    (1, 'Menua',          'Մենուա',         -810, -786, 'Built the Menua Canal near Van, still in use today; major military campaigns'),
    (1, 'Argishti I',     'Արգիշտի Ա',     -786, -764, 'Greatest Urartian king; founded Erebuni fortress (modern Yerevan) in 782 BC'),
    (1, 'Sarduri II',     'Սարդուրի Բ',    -764, -735, 'Urartu at peak power; rival to Assyria under Tiglath-Pileser III'),
    (1, 'Rusa I',         'Ռուսա Ա',       -735, -714, 'Defeated by Sargon II of Assyria; committed suicide after defeat'),
    (1, 'Argishti II',    'Արգիշտի Բ',     -714, -685, 'Rebuilt kingdom after Assyrian raids'),
    (1, 'Rusa II',        'Ռուսա Բ',       -685, -645, 'Last great builder of Urartu; constructed Teishebaini fortress'),
    (1, 'Sarduri IV',     'Սարդուրի Դ',    -645, -590, 'Last known king; Urartu falls to Median and Scythian invasion'),
    -- Orontid
    (2, 'Orontes I',      'Երվանդ Ա',      -570, -560, 'First known Orontid satrap of Armenia under Achaemenid Persia'),
    (2, 'Orontes III',    'Երվանդ Գ',      -317, -260, 'Restored Orontid rule after Alexander; founded dynasty of independent Armenia'),
    (2, 'Orontes IV',     'Երվանդ Դ',      -260, -228, 'Moved capital to Yervandashat; last Orontid king'),
    -- Artaxiad
    (3, 'Artaxias I',     'Արտաշես Ա',     -189, -160, 'Founded the Artaxiad dynasty and city of Artaxata on advice of Hannibal'),
    (3, 'Tigranes I',     'Տիգրան Ա',      -123,  -96, 'Gave hostages to Parthia; father of Tigranes the Great'),
    (3, 'Tigranes II',    'Տիգրան Բ',       -95,  -55, 'The Great — largest Armenian empire ever; controlled Syria, Mesopotamia, Pontus'),
    (3, 'Artavasdes II',  'Արտավազդ Բ',     -55,  -34, 'King during Roman-Parthian wars; poet and playwright; captured by Mark Antony'),
    (3, 'Tigranes III',   'Տիգրան Գ',       -20,   -8, 'Roman client king; stabilized kingdom under Roman influence'),
    (3, 'Tigranes IV',    'Տիգրան Դ',        -8,    5, 'Last Artaxiad ruler; kingdom contested by Rome and Parthia'),
    -- Arsacid
    (4, 'Tiridates I',    'Տրդատ Ա',         52,   88, 'Founder of Armenian Arsacid line; famously crowned by Nero in Rome'),
    (4, 'Tiridates III',  'Տրդատ Գ',        287,  330, 'Converted Armenia to Christianity in 301 AD — first Christian nation in history'),
    (4, 'Khosrov III',    'Խոսրով Գ',       330,  338, 'Built the city of Dvin as new capital'),
    (4, 'Pap',            'Փափ',             368,  374, 'Strong military king; kept both Rome and Persia at bay'),
    (4, 'Khosrov IV',     'Խոսրով Դ',       384,  389, 'Last king before Arsacid kingdom was partitioned between Rome and Persia'),
    -- Bagratid
    (5, 'Ashot I',        'Աշոտ Ա',         885,  890, 'Founded Bagratid kingdom; recognized by both Caliph and Byzantine Emperor'),
    (5, 'Ashot II',       'Աշոտ Բ',         914,  928, 'Called "the Iron"; decisively defeated Arab forces'),
    (5, 'Abas I',         'Աբաս Ա',         928,  953, 'Moved capital to Kars; rebuilt country after Arab raids'),
    (5, 'Ashot III',      'Աշոտ Գ',         953,  977, 'Called "the Merciful"; moved capital to Ani'),
    (5, 'Gagik I',        'Գագիկ Ա',        990, 1020, 'Peak of Bagratid power; Ani became one of the great cities of the world'),
    (5, 'Gagik II',       'Գագիկ Բ',       1042, 1045, 'Last Bagratid king; surrendered Ani to Byzantium under pressure'),
    -- Rubenid / Cilicia
    (6, 'Ruben I',        'Ռուբեն Ա',      1080, 1095, 'Founded the Rubenid dynasty in the Taurus Mountains after fall of Ani'),
    (6, 'Thoros I',       'Թորոս Ա',       1100, 1129, 'Expanded Cilician Armenian territory; allied with Crusaders'),
    (6, 'Leon I',         'Լևոն Ա',        1187, 1219, 'First King of Armenian Cilicia; received royal crown from Holy Roman Emperor in 1198'),
    (7, 'Hethum I',       'Հեթում Ա',      1226, 1270, 'Hethumid founder; allied with Mongols against common Muslim enemies'),
    (7, 'Leon III',       'Լևոն Գ',        1301, 1307, 'Fought Mamluks; kingdom in decline'),
    (7, 'Leon V',         'Լևոն Ե',        1374, 1375, 'Last king of Armenian Cilicia; kingdom fell to Mamluks in 1375');

INSERT INTO events (era_id, year, title, description, lat, lng) VALUES
    -- Urartu
    (1, -782, 'Erebuni fortress founded', 'Argishti I founds Erebuni (modern Yerevan) as a military stronghold', 40.15, 44.57),
    (1, -800, 'Tushpa established as capital', 'Sarduri I builds the capital city of Tushpa on the shores of Lake Van', 38.50, 43.37),
    (1, -735, 'Urartu at peak power', 'Under Sarduri II, Urartu controls territory from modern Iran to central Anatolia', 38.50, 43.37),
    (1, -714, 'Sargon II raids Urartu', 'Assyrian king Sargon II defeats Rusa I and sacks the sacred city of Musasir', 37.20, 44.30),
    (1, -590, 'Fall of Urartu', 'Medes and Scythians destroy the Urartian kingdom; Armenians emerge as dominant group', 38.50, 43.37),
    -- Artaxiad
    (5, -189, 'Artaxata founded', 'Artaxias I founds Artaxata on the Araxes river, reportedly with help from Hannibal', 39.95, 44.55),
    (5,  -83, 'Tigranes II at peak', 'Armenia stretches from Caspian Sea to Mediterranean under Tigranes the Great', 38.96, 41.27),
    (5,  -69, 'Battle of Tigranocerta', 'Roman general Lucullus defeats Tigranes II; beginning of Roman dominance in the region', 37.85, 42.03),
    -- Arsacid
    (6,  301, 'Armenia adopts Christianity', 'Tiridates III declares Christianity the state religion — first nation in history to do so', 40.15, 44.52),
    (6,  405, 'Armenian alphabet created', 'Mesrop Mashtots invents the Armenian alphabet; cultural golden age begins', 40.18, 44.51),
    (6,  428, 'End of Arsacid kingdom', 'Persia abolishes the Armenian monarchy and installs a marzpan (governor)', 40.00, 44.50),
    -- Bagratid
    (9,  885, 'Bagratid Kingdom founded', 'Ashot I recognized as King by Caliph and Byzantine Emperor; Armenia independent again', 40.50, 43.47),
    (9, 1001, 'Cathedral of Ani completed', 'The great Cathedral of Ani consecrated; city population over 100,000', 40.51, 43.57),
    (10,1064, 'Seljuk capture of Ani', 'Alp Arslan sacks Ani; end of Bagratid golden age', 40.51, 43.57),
    -- Cilicia
    (11,1198, 'Kingdom of Cilicia proclaimed', 'Leon I crowned King of Armenian Cilicia by Holy Roman Emperor Henry VI', 37.35, 35.32),
    (11,1375, 'Fall of Cilician Armenia', 'Mamluk Sultanate conquers Sis; end of last Armenian kingdom for over 500 years', 37.26, 35.92),
    -- Modern
    (13,1828, 'Treaty of Turkmenchay', 'Russia gains Eastern Armenia from Qajar Persia; Armenians get some protections', 39.17, 47.87),
    (13,1915, 'Armenian Genocide begins', 'Ottoman government begins systematic deportation and massacre of Armenians', 39.92, 32.85),
    (13,1918, 'First Republic declared', 'First Republic of Armenia declared on May 28, 1918 after Russian Revolution', 40.18, 44.51),
    (14,1920, 'Soviet takeover', 'Red Army invades; Armenia becomes the Armenian SSR within the Soviet Union', 40.18, 44.51),
    (15,1988, 'Spitak earthquake', 'Devastating earthquake kills ~25,000 people in northern Armenia', 40.83, 44.26),
    (15,1988, 'Karabakh movement begins', 'Mass protests in Yerevan demand unification of Nagorno-Karabakh with Armenia', 40.18, 44.51),
    (16,1991, 'Independence restored', 'Armenia declares independence from the USSR on September 21, 1991', 40.18, 44.51),
    (16,1994, 'First Karabakh War ceasefire', 'Ceasefire ends First Nagorno-Karabakh War; Armenia controls Karabakh and surrounding areas', 39.82, 46.76),
    (16,2018, 'Velvet Revolution', 'Peaceful mass protests led by Nikol Pashinyan force resignation of Serzh Sargsyan', 40.18, 44.51),
    (16,2020, 'Second Karabakh War', '44-day war ends with Armenian defeat; Azerbaijan recaptures most of Karabakh', 39.82, 46.76),
    (16,2023, 'Fall of Karabakh', 'Azerbaijan takes full control of Nagorno-Karabakh; ~100,000 Armenians flee to Armenia', 39.82, 46.76);
