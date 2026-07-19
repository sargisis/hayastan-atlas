-- Migration: add name_hy to eras, add Armenian era names, add missing events

ALTER TABLE eras ADD COLUMN IF NOT EXISTS name_hy TEXT;

UPDATE eras SET name_hy = 'Ուրարտուի Թագավորություն'               WHERE name = 'Kingdom of Urartu';
UPDATE eras SET name_hy = 'Վաղ Հայաստան'                           WHERE name = 'Post-Urartu / Early Armenia';
UPDATE eras SET name_hy = 'Հայաստանի Սատրապություն'                WHERE name = 'Satrapy of Armenia';
UPDATE eras SET name_hy = 'Երվանդունյաց Թագավորություն'            WHERE name = 'Orontid Kingdom';
UPDATE eras SET name_hy = 'Արտաշեսյան Թագավորություն'              WHERE name = 'Artaxiad Kingdom';
UPDATE eras SET name_hy = 'Արշակունյաց Հայաստան'                  WHERE name = 'Arsacid Armenia';
UPDATE eras SET name_hy = 'Հայաստանի Մարզպանություն'               WHERE name = 'Marzpanate of Armenia';
UPDATE eras SET name_hy = 'Արաբական Հայաստան'                      WHERE name = 'Arab-controlled Armenia';
UPDATE eras SET name_hy = 'Բագրատունյաց Թագավորություն'            WHERE name = 'Bagratid Kingdom';
UPDATE eras SET name_hy = 'Մասնատված Թագավորություններ'            WHERE name = 'Fragmented Kingdoms';
UPDATE eras SET name_hy = 'Կիլիկիայի Հայկական Թագավորություն'     WHERE name = 'Armenian Kingdom of Cilicia';
UPDATE eras SET name_hy = 'Օսմանա-Պարսկական Տիրապետություն'       WHERE name = 'Ottoman/Persian Rule';
UPDATE eras SET name_hy = 'Ռուսական Հայաստան'                      WHERE name = 'Russian Armenia';
UPDATE eras SET name_hy = 'Հայաստանի Առաջին Հանրապետություն'      WHERE name = 'First Republic of Armenia';
UPDATE eras SET name_hy = 'Խորհրդային Հայաստան'                    WHERE name = 'Soviet Armenia';
UPDATE eras SET name_hy = 'Հայաստանի Հանրապետություն'              WHERE name = 'Republic of Armenia';

-- Add missing events for eras with no events
-- era 2: Post-Urartu / Early Armenia (-590 to -570)
INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, -585, 'Fall of Urartu, rise of Armenia',
       'After the Median and Scythian destruction of Urartu, Armenian tribes consolidate under Orontid leadership in the Ararat valley.',
       39.90, 44.70
FROM eras WHERE name = 'Post-Urartu / Early Armenia';

INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, -570, 'Orontes becomes satrap',
       'Orontes I (Ervand I) recognized as the first satrap of Armenia under Achaemenid Persia, founding the Orontid line.',
       39.90, 44.70
FROM eras WHERE name = 'Post-Urartu / Early Armenia';

-- era 3: Satrapy of Armenia (-570 to -321)
INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, -480, 'Armenians march with Xerxes',
       'Armenian contingents join Xerxes I''s invasion of Greece, as recorded by Herodotus — evidence of Armenian military strength under Persia.',
       39.90, 44.70
FROM eras WHERE name = 'Satrapy of Armenia';

INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, -401, 'Xenophon passes through Armenia',
       'Greek mercenaries (the Ten Thousand) retreat through Armenian highlands; Xenophon''s Anabasis gives the first detailed outsider account of Armenia.',
       39.90, 44.70
FROM eras WHERE name = 'Satrapy of Armenia';

INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, -331, 'Battle of Gaugamela',
       'Armenian cavalry fights for Darius III against Alexander the Great at Gaugamela. After the Persian defeat, Armenia gradually drifts toward independence.',
       36.34, 43.64
FROM eras WHERE name = 'Satrapy of Armenia';

-- era 4: Orontid Kingdom (-321 to -189)
INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, -317, 'Orontes III restores Orontid rule',
       'After Alexander''s death, Orontes III reestablishes Armenian independence under Orontid dynasty, throwing off Macedonian control.',
       39.90, 44.70
FROM eras WHERE name = 'Orontid Kingdom';

INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, -260, 'Yervandashat founded',
       'Ervand IV (Orontes IV) moves the capital to newly built Yervandashat at the confluence of the Araxes and Akhurian rivers.',
       40.05, 44.00
FROM eras WHERE name = 'Orontid Kingdom';

-- era 7: Marzpanate of Armenia (428-636)
INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, 451, 'Battle of Avarayr',
       'Armenian forces under Vardan Mamikonian fight Sassanid Persia to defend Christianity. Armenians lose militarily but win religiously — Persia abandons forced Zoroastrianism.',
       39.80, 45.10
FROM eras WHERE name = 'Marzpanate of Armenia';

INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, 484, 'Nvarsak Treaty',
       'Persia grants Armenians religious freedom in the Nvarsak Treaty — the result of decades of resistance after Avarayr.',
       40.00, 44.50
FROM eras WHERE name = 'Marzpanate of Armenia';

INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, 572, 'Armenian revolt against Persia',
       'Major Armenian uprising against Sassanid rule; Armenia briefly allied with Byzantine Empire.',
       40.00, 44.50
FROM eras WHERE name = 'Marzpanate of Armenia';

-- era 8: Arab-controlled Armenia (636-885)
INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, 640, 'Arab conquest of Armenia',
       'Arab armies under the Rashidun Caliphate overrun Armenia; Armenians negotiate limited autonomy under Arab rule.',
       40.18, 44.51
FROM eras WHERE name = 'Arab-controlled Armenia';

INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, 703, 'Massacre of Armenian nobles',
       'Arab governor rounds up Armenian nakharars (nobles) in a church and burns it; sparks Armenian revolts.',
       40.18, 44.51
FROM eras WHERE name = 'Arab-controlled Armenia';

INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, 774, 'Armenian revolt of 774',
       'Major Armenian uprising against Abbasid rule; defeated but demonstrates continuing resistance to Arab domination.',
       40.18, 44.51
FROM eras WHERE name = 'Arab-controlled Armenia';

-- era 12: Ottoman/Persian Rule (1375-1828)
INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, 1453, 'Fall of Constantinople',
       'Ottoman conquest of Constantinople; Armenian merchants and craftsmen play a significant role in the new Ottoman capital.',
       41.01, 28.98
FROM eras WHERE name = 'Ottoman/Persian Rule';

INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, 1604, 'Great Deportation from Jugha',
       'Shah Abbas I forcibly deports tens of thousands of Armenians from Jugha (Nakhchivan) to Isfahan; Armenian craftsmen help build New Julfa.',
       39.38, 45.61
FROM eras WHERE name = 'Ottoman/Persian Rule';

INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, 1639, 'Treaty of Zuhab',
       'Ottoman-Safavid treaty divides Armenia: western part (including Van and Erzurum) to Ottomans, eastern part to Persia.',
       34.40, 45.35
FROM eras WHERE name = 'Ottoman/Persian Rule';

INSERT INTO events (era_id, year, title, description, lat, lng)
SELECT id, 1722, 'Armenian-Georgian alliance with Peter the Great',
       'Armenian and Georgian leaders ally with Peter the Great of Russia during his Caspian campaign, hoping for liberation from Persian and Ottoman rule.',
       40.18, 44.51
FROM eras WHERE name = 'Ottoman/Persian Rule';
