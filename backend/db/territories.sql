-- ============================================================
-- Hayastan Atlas — territory phases by year range
-- Each row covers [start_year, end_year]; the map picks the row
-- matching the selected year (narrowest range wins on overlap).
-- Roles: main = Armenian state, ally = other Armenian polity,
--        neighbor = foreign power. Approximate historical borders.
-- Run: psql -U postgres -d hayastan_atlas -f territories.sql
-- ============================================================

ALTER TABLE territories ADD COLUMN IF NOT EXISTS start_year INT NOT NULL DEFAULT -9999;
ALTER TABLE territories ADD COLUMN IF NOT EXISTS end_year   INT NOT NULL DEFAULT  9999;
CREATE INDEX IF NOT EXISTS idx_territories_years ON territories(start_year, end_year);

TRUNCATE territories RESTART IDENTITY;

-- ============ URARTU ============

-- 800-786 BC: kingdom of Menua — Van basin, Araxes valley reached
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (1, -800, -786, 'Urartu under Menua', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Urartu","color":"#8e5bb5","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[41.2,38.3],[40.8,39.2],[41.5,40.0],[43.0,40.3],[44.5,40.2],[45.3,39.6],[45.5,38.9],[44.9,38.2],[44.0,37.6],[42.8,37.4],[41.8,37.7],[41.2,38.3]]]}},
{"type":"Feature","properties":{"name":"Assyria","color":"#8d6e63","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[39.0,37.8],[41.5,37.2],[43.5,36.9],[45.0,36.6],[46.5,35.8],[47.5,34.2],[45.5,33.2],[42.5,33.8],[40.0,34.8],[38.5,36.3],[39.0,37.8]]]}},
{"type":"Feature","properties":{"name":"Diauehi","color":"#607d8b","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.0,40.3],[41.0,41.2],[42.3,41.4],[42.6,40.6],[41.8,40.0],[40.6,39.8],[40.0,40.3]]]}},
{"type":"Feature","properties":{"name":"Colchis","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[39.8,43.2],[41.9,43.4],[42.9,42.8],[42.5,41.8],[41.1,41.5],[39.9,42.1],[39.8,43.2]]]}},
{"type":"Feature","properties":{"name":"Mannea","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[44.6,37.2],[45.9,36.9],[46.8,35.9],[45.9,35.2],[44.7,35.6],[44.3,36.4],[44.6,37.2]]]}}
]}
$$::jsonb);

-- 785-735 BC: peak under Argishti I and Sarduri II — Erebuni founded, Sevan reached, west to upper Euphrates
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (1, -785, -735, 'Urartu at its peak', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Urartu","color":"#8e5bb5","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[38.7,38.3],[38.9,39.3],[39.8,40.3],[41.0,41.0],[42.5,41.3],[44.0,41.2],[45.5,40.8],[46.3,40.0],[46.0,39.0],[45.6,38.2],[45.2,37.2],[44.3,36.8],[43.0,36.9],[41.5,37.2],[40.0,37.6],[39.0,37.9],[38.7,38.3]]]}},
{"type":"Feature","properties":{"name":"Assyria","color":"#8d6e63","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[39.0,37.8],[41.5,37.1],[43.0,36.8],[44.3,36.7],[46.5,35.8],[47.5,34.2],[45.5,33.2],[42.5,33.8],[40.0,34.8],[38.5,36.3],[39.0,37.8]]]}},
{"type":"Feature","properties":{"name":"Colchis","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[39.8,43.2],[41.9,43.4],[42.9,42.8],[42.5,41.8],[41.1,41.5],[39.9,42.1],[39.8,43.2]]]}},
{"type":"Feature","properties":{"name":"Mannea","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.2,37.1],[45.9,36.9],[46.8,35.9],[45.9,35.2],[44.7,35.6],[44.4,36.6],[45.2,37.1]]]}},
{"type":"Feature","properties":{"name":"Phrygia","color":"#78909c","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[30.5,38.5],[31.0,40.5],[33.5,41.0],[36.0,40.5],[37.5,39.7],[37.0,38.5],[34.5,37.8],[31.5,37.8],[30.5,38.5]]]}}
]}
$$::jsonb);

-- 734-640 BC: after Tiglath-Pileser III and Sargon II — southern and western fringes lost
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (1, -734, -640, 'Urartu after Assyrian blows', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Urartu","color":"#8e5bb5","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[39.5,38.4],[39.8,39.5],[41.0,40.5],[42.8,41.0],[44.5,40.8],[45.8,40.2],[46.0,39.2],[45.3,38.3],[44.6,37.6],[43.2,37.3],[41.8,37.6],[40.3,37.9],[39.5,38.4]]]}},
{"type":"Feature","properties":{"name":"Assyria","color":"#8d6e63","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[38.8,37.9],[41.8,37.4],[44.6,37.4],[46.5,36.5],[47.8,34.5],[46.0,33.0],[43.0,33.5],[40.0,34.8],[38.3,36.3],[38.8,37.9]]]}},
{"type":"Feature","properties":{"name":"Scythians","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[42.5,41.5],[45.0,42.0],[47.5,42.5],[48.5,41.5],[46.5,41.0],[44.5,41.1],[42.5,41.5]]]}},
{"type":"Feature","properties":{"name":"Media","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.5,37.8],[47.5,37.3],[49.5,36.5],[50.5,34.5],[48.5,33.0],[46.2,33.5],[45.0,35.0],[45.2,36.8],[45.5,37.8]]]}}
]}
$$::jsonb);

-- 639-590 BC: decline and fall — Media rising
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (1, -639, -590, 'Fall of Urartu', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Urartu","color":"#8e5bb5","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[41.0,38.2],[41.0,39.3],[41.8,40.2],[43.3,40.5],[44.8,40.2],[45.4,39.4],[44.9,38.4],[44.0,37.8],[42.8,37.6],[41.7,37.8],[41.0,38.2]]]}},
{"type":"Feature","properties":{"name":"Media","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.0,38.8],[47.0,38.3],[49.5,37.0],[50.5,34.5],[48.5,32.5],[45.5,33.0],[43.5,34.5],[44.2,36.5],[45.0,38.8]]]}},
{"type":"Feature","properties":{"name":"Scythians","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[42.5,41.3],[45.0,41.8],[47.5,42.3],[48.5,41.3],[46.5,40.8],[44.5,40.9],[42.5,41.3]]]}},
{"type":"Feature","properties":{"name":"Lydia","color":"#78909c","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[28.0,38.0],[28.5,40.5],[31.5,40.8],[34.5,40.2],[35.5,39.0],[33.5,37.8],[30.0,37.5],[28.0,38.0]]]}}
]}
$$::jsonb);

-- ============ MEDIAN / PERSIAN RULE ============

-- 589-550 BC: under the Median Empire
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (2, -589, -550, 'Median Empire rules the highlands', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Armenia (emerging)","color":"#9b59b6","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[41.0,38.4],[41.2,39.6],[42.3,40.5],[43.8,40.7],[45.0,40.3],[45.5,39.4],[44.9,38.5],[43.8,37.9],[42.4,37.8],[41.4,38.0],[41.0,38.4]]]}},
{"type":"Feature","properties":{"name":"Median Empire","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[38.0,38.5],[39.5,40.0],[42.0,41.2],[45.0,41.4],[47.5,40.8],[49.5,39.5],[51.5,37.0],[51.0,33.5],[47.5,31.5],[43.0,32.5],[39.5,34.5],[37.5,36.5],[38.0,38.5]]]}},
{"type":"Feature","properties":{"name":"Lydia","color":"#78909c","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[28.0,38.0],[28.5,40.5],[31.5,40.8],[34.5,40.2],[35.5,39.0],[33.5,37.8],[30.0,37.5],[28.0,38.0]]]}},
{"type":"Feature","properties":{"name":"Colchis","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[39.8,43.2],[41.9,43.4],[42.9,42.8],[42.5,41.8],[41.1,41.5],[39.9,42.1],[39.8,43.2]]]}}
]}
$$::jsonb);

-- 549-331 BC: satrapy of the Achaemenid Empire
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (3, -549, -331, 'Satrapy of Armenia (Achaemenid)', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Satrapy of Armenia","color":"#8e44ad","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[38.9,38.5],[39.4,39.8],[40.5,40.8],[42.3,41.3],[44.3,41.2],[45.8,40.5],[46.4,39.5],[45.7,38.4],[44.5,37.7],[42.8,37.4],[41.0,37.7],[39.6,38.0],[38.9,38.5]]]}},
{"type":"Feature","properties":{"name":"Achaemenid Empire","color":"#5d4037","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[29.0,36.5],[29.5,39.5],[32.0,41.5],[36.0,41.8],[39.4,41.3],[42.3,41.6],[45.5,41.6],[48.5,41.0],[51.0,39.0],[52.5,35.0],[50.0,31.5],[44.0,31.0],[38.0,32.5],[33.5,34.0],[30.0,35.0],[29.0,36.5]]]}},
{"type":"Feature","properties":{"name":"Colchis","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[39.8,43.2],[41.9,43.4],[42.9,42.8],[42.5,41.8],[41.1,41.5],[39.9,42.1],[39.8,43.2]]]}}
]}
$$::jsonb);

-- 330-190 BC: Orontid kingdom after Alexander
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (4, -330, -190, 'Orontid Armenia', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Kingdom of Armenia","color":"#2980b9","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[39.2,38.6],[39.6,39.9],[40.7,40.9],[42.4,41.3],[44.4,41.2],[45.9,40.5],[46.4,39.5],[45.7,38.4],[44.5,37.8],[42.8,37.5],[41.2,37.8],[39.8,38.1],[39.2,38.6]]]}},
{"type":"Feature","properties":{"name":"Sophene","color":"#3498db","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[38.3,37.9],[38.5,38.9],[39.5,39.0],[40.2,38.4],[39.6,37.7],[38.7,37.6],[38.3,37.9]]]}},
{"type":"Feature","properties":{"name":"Seleucid Empire","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[33.5,36.0],[35.0,37.5],[36.8,38.2],[38.7,37.9],[41.2,37.6],[42.8,37.3],[44.5,37.6],[45.7,38.3],[46.4,39.4],[48.0,39.0],[50.5,37.0],[51.0,33.5],[47.0,31.0],[41.0,32.0],[36.0,33.5],[33.5,36.0]]]}},
{"type":"Feature","properties":{"name":"Pontus","color":"#78909c","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[33.5,40.5],[35.5,41.3],[38.0,41.3],[39.9,41.0],[39.5,40.0],[37.5,39.8],[35.0,39.9],[33.5,40.5]]]}},
{"type":"Feature","properties":{"name":"Iberia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[42.8,41.4],[44.9,41.5],[45.8,42.4],[44.3,43.1],[42.6,42.7],[42.8,41.4]]]}}
]}
$$::jsonb);

-- ============ ARTAXIAD ============

-- 189-96 BC: Artaxias I unites the highlands
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (5, -189, -96, 'Artaxiad Armenia — the rise', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Greater Armenia","color":"#e74c3c","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[39.0,38.6],[39.4,39.9],[40.6,40.9],[42.3,41.3],[44.5,41.3],[46.0,40.6],[46.6,39.6],[46.0,38.5],[44.8,37.8],[43.0,37.4],[41.2,37.7],[39.7,38.1],[39.0,38.6]]]}},
{"type":"Feature","properties":{"name":"Sophene","color":"#e67e22","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[38.3,37.9],[38.5,38.9],[39.5,39.0],[40.2,38.4],[39.6,37.7],[38.7,37.6],[38.3,37.9]]]}},
{"type":"Feature","properties":{"name":"Seleucid Syria","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[35.2,35.2],[35.8,36.8],[37.0,37.6],[38.7,37.8],[39.9,37.0],[38.5,35.0],[36.8,33.8],[35.5,34.0],[35.2,35.2]]]}},
{"type":"Feature","properties":{"name":"Parthia","color":"#4e342e","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[46.6,39.5],[48.5,39.0],[51.0,37.5],[52.0,34.0],[48.5,31.5],[45.0,32.5],[44.0,34.5],[45.0,37.0],[46.0,38.4],[46.6,39.5]]]}},
{"type":"Feature","properties":{"name":"Pontus","color":"#78909c","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[33.5,40.5],[35.5,41.3],[38.0,41.3],[39.9,41.0],[39.5,40.0],[37.5,39.8],[35.0,39.9],[33.5,40.5]]]}},
{"type":"Feature","properties":{"name":"Cappadocia","color":"#90a4ae","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[33.5,38.0],[34.0,39.8],[36.5,39.7],[38.3,39.3],[38.7,38.3],[37.0,37.5],[35.0,37.3],[33.5,38.0]]]}},
{"type":"Feature","properties":{"name":"Iberia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[42.8,41.4],[44.9,41.5],[45.8,42.4],[44.3,43.1],[42.6,42.7],[42.8,41.4]]]}}
]}
$$::jsonb);

-- 95-66 BC: EMPIRE OF TIGRANES THE GREAT — from the Caspian to the Mediterranean
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (5, -95, -66, 'Empire of Tigranes the Great', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Armenian Empire","color":"#c0392b","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[35.4,36.0],[35.9,37.2],[37.3,38.3],[38.8,39.6],[40.3,40.8],[42.3,41.4],[44.7,41.4],[46.3,40.7],[47.5,40.2],[48.6,39.5],[48.4,38.4],[47.0,37.2],[45.5,36.0],[43.5,34.8],[41.0,34.0],[38.5,33.8],[36.5,34.3],[35.4,36.0]]]}},
{"type":"Feature","properties":{"name":"Pontus (ally)","color":"#e67e22","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[33.5,40.5],[35.5,41.4],[38.0,41.4],[40.0,41.1],[39.6,40.1],[37.5,39.9],[35.0,40.0],[33.5,40.5]]]}},
{"type":"Feature","properties":{"name":"Roman Republic","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[29.5,36.4],[30.0,39.5],[32.0,41.3],[33.5,40.5],[35.0,40.0],[35.5,38.5],[35.4,36.0],[32.5,36.0],[29.5,36.4]]]}},
{"type":"Feature","properties":{"name":"Parthia (weakened)","color":"#4e342e","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[48.6,39.4],[50.5,38.5],[52.0,35.5],[49.5,32.0],[45.5,32.5],[44.5,34.0],[47.0,37.1],[48.4,38.3],[48.6,39.4]]]}},
{"type":"Feature","properties":{"name":"Iberia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[42.8,41.5],[44.9,41.6],[45.8,42.5],[44.3,43.1],[42.6,42.7],[42.8,41.5]]]}}
]}
$$::jsonb);

-- 65 BC - 62 AD: after Pompey — back to Greater Armenia, between Rome and Parthia
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (5, -65, 62, 'Armenia between Rome and Parthia', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Greater Armenia","color":"#e74c3c","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[39.0,38.6],[39.4,39.9],[40.6,40.9],[42.3,41.3],[44.5,41.3],[46.0,40.6],[46.6,39.6],[46.0,38.5],[44.8,37.8],[43.0,37.4],[41.2,37.7],[39.7,38.1],[39.0,38.6]]]}},
{"type":"Feature","properties":{"name":"Roman Republic","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[29.5,36.4],[30.0,39.5],[32.0,41.4],[35.5,41.7],[38.5,41.2],[39.4,39.9],[39.0,38.6],[39.7,38.1],[38.9,36.9],[36.9,34.0],[34.8,33.4],[32.0,34.6],[29.5,36.4]]]}},
{"type":"Feature","properties":{"name":"Parthia","color":"#4e342e","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[46.6,39.5],[48.5,39.0],[51.0,37.5],[52.0,34.0],[48.5,31.5],[45.0,32.5],[43.0,34.0],[44.8,37.0],[46.0,38.4],[46.6,39.5]]]}},
{"type":"Feature","properties":{"name":"Media Atropatene","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.0,38.9],[46.4,38.6],[47.2,37.6],[46.5,36.6],[45.2,36.7],[44.6,37.7],[45.0,38.9]]]}},
{"type":"Feature","properties":{"name":"Iberia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[42.8,41.4],[44.9,41.5],[45.8,42.4],[44.3,43.1],[42.6,42.7],[42.8,41.4]]]}}
]}
$$::jsonb);

-- ============ ARSACID ============

-- 63-297 AD: Treaty of Rhandeia — stable Arsacid kingdom
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (6, 63, 297, 'Arsacid Armenia', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Kingdom of Armenia","color":"#e67e22","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[39.0,38.6],[39.4,39.9],[40.6,40.9],[42.3,41.3],[44.5,41.3],[46.0,40.6],[46.6,39.6],[46.0,38.5],[44.8,37.8],[43.0,37.4],[41.2,37.7],[39.7,38.1],[39.0,38.6]]]}},
{"type":"Feature","properties":{"name":"Roman Empire","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[29.5,36.4],[30.0,39.5],[32.0,41.4],[35.5,41.7],[38.5,41.2],[39.4,39.9],[39.0,38.6],[39.7,38.1],[38.9,36.9],[36.9,34.0],[34.8,33.4],[32.0,34.6],[29.5,36.4]]]}},
{"type":"Feature","properties":{"name":"Parthia","color":"#4e342e","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[46.6,39.5],[48.5,39.0],[51.0,37.5],[52.0,34.0],[48.5,31.5],[45.0,32.5],[43.0,34.0],[44.8,37.0],[46.0,38.4],[46.6,39.5]]]}},
{"type":"Feature","properties":{"name":"Iberia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[42.8,41.4],[44.9,41.5],[45.8,42.4],[44.3,43.1],[42.6,42.7],[42.8,41.4]]]}},
{"type":"Feature","properties":{"name":"Caucasian Albania","color":"#607d8b","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.2,41.3],[46.9,41.6],[48.5,41.3],[49.4,40.3],[48.2,39.6],[46.7,39.8],[46.1,40.6],[45.2,41.3]]]}}
]}
$$::jsonb);

-- 298-386 AD: after Nisibis — Christianity adopted 301, alphabet coming
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (6, 298, 386, 'Christian Armenia', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Kingdom of Armenia","color":"#e67e22","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[39.0,38.6],[39.4,39.9],[40.6,40.9],[42.3,41.3],[44.5,41.3],[46.0,40.6],[46.6,39.6],[46.0,38.5],[44.8,37.8],[43.0,37.4],[41.2,37.7],[39.7,38.1],[39.0,38.6]]]}},
{"type":"Feature","properties":{"name":"Roman Empire","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[29.5,36.4],[30.0,39.5],[32.0,41.4],[35.5,41.7],[38.5,41.2],[39.4,39.9],[39.0,38.6],[39.7,38.1],[38.9,36.9],[36.9,34.0],[34.8,33.4],[32.0,34.6],[29.5,36.4]]]}},
{"type":"Feature","properties":{"name":"Sasanian Empire","color":"#4e342e","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[46.6,39.5],[48.5,39.2],[51.5,37.5],[52.0,33.5],[47.5,31.0],[43.0,32.5],[41.5,34.5],[43.5,36.6],[45.0,37.6],[46.0,38.4],[46.6,39.5]]]}},
{"type":"Feature","properties":{"name":"Iberia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[42.8,41.4],[44.9,41.5],[45.8,42.4],[44.3,43.1],[42.6,42.7],[42.8,41.4]]]}}
]}
$$::jsonb);

-- 387-428 AD: partition between Rome and Persia
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (6, 387, 428, 'Partition of Armenia', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Persian Armenia","color":"#e67e22","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[41.9,39.9],[41.8,41.0],[43.0,41.3],[44.8,41.2],[46.0,40.5],[46.6,39.6],[46.0,38.5],[44.8,37.8],[43.0,37.5],[41.5,38.9],[41.9,39.9]]]}},
{"type":"Feature","properties":{"name":"Western Armenia (Roman)","color":"#f39c12","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[38.9,38.5],[39.3,39.8],[40.4,40.7],[41.8,41.0],[41.9,39.9],[41.5,38.9],[40.6,38.0],[39.6,38.1],[38.9,38.5]]]}},
{"type":"Feature","properties":{"name":"Roman Empire","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[29.5,36.4],[30.0,39.5],[32.0,41.4],[35.5,41.7],[38.5,41.2],[39.3,39.8],[38.9,38.5],[39.6,38.1],[38.9,36.9],[36.9,34.0],[34.8,33.4],[32.0,34.6],[29.5,36.4]]]}},
{"type":"Feature","properties":{"name":"Sasanian Empire","color":"#4e342e","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[46.6,39.5],[48.5,39.2],[51.5,37.5],[52.0,33.5],[47.5,31.0],[43.0,32.5],[41.5,34.5],[43.5,36.6],[45.0,37.6],[46.0,38.4],[46.6,39.5]]]}}
]}
$$::jsonb);

-- 429-635 AD: Marzpanate — province of Sasanian Persia; Avarayr 451
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (7, 429, 635, 'Marzpanate of Armenia', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Persian Armenia (Marzpanate)","color":"#a1887f","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[41.9,39.9],[41.8,41.0],[43.0,41.3],[44.8,41.2],[46.0,40.5],[46.6,39.6],[46.0,38.5],[44.8,37.8],[43.0,37.5],[41.5,38.9],[41.9,39.9]]]}},
{"type":"Feature","properties":{"name":"Byzantine Armenia","color":"#8d9db6","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[38.9,38.5],[39.3,39.8],[40.4,40.7],[41.8,41.0],[41.9,39.9],[41.5,38.9],[40.6,38.0],[39.6,38.1],[38.9,38.5]]]}},
{"type":"Feature","properties":{"name":"Byzantine Empire","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[29.5,36.4],[30.0,39.5],[32.0,41.4],[35.5,41.7],[38.5,41.2],[39.3,39.8],[38.9,38.5],[39.6,38.1],[38.9,36.9],[36.9,34.0],[34.8,33.4],[32.0,34.6],[29.5,36.4]]]}},
{"type":"Feature","properties":{"name":"Sasanian Empire","color":"#4e342e","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[46.6,39.5],[48.5,39.2],[51.5,37.5],[52.0,33.5],[47.5,31.0],[43.0,32.5],[41.5,34.5],[43.5,36.6],[45.0,37.6],[46.0,38.4],[46.6,39.5]]]}},
{"type":"Feature","properties":{"name":"Iberia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[42.8,41.4],[44.9,41.5],[45.8,42.4],[44.3,43.1],[42.6,42.7],[42.8,41.4]]]}},
{"type":"Feature","properties":{"name":"Caucasian Albania","color":"#607d8b","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.2,41.3],[46.9,41.6],[48.5,41.3],[49.4,40.3],[48.2,39.6],[46.7,39.8],[46.1,40.6],[45.2,41.3]]]}}
]}
$$::jsonb);

-- 636-884 AD: Arminiya under the Caliphate
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (8, 636, 884, 'Arminiya under the Caliphate', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Arminiya","color":"#95a5a6","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[39.5,38.6],[39.8,39.9],[40.8,40.9],[42.4,41.3],[44.4,41.2],[45.9,40.5],[46.4,39.5],[45.7,38.4],[44.5,37.8],[42.8,37.5],[41.2,37.8],[39.9,38.1],[39.5,38.6]]]}},
{"type":"Feature","properties":{"name":"Abbasid Caliphate","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[35.0,36.8],[38.0,37.6],[41.2,37.7],[42.8,37.4],[45.7,38.3],[47.5,37.0],[50.0,35.0],[48.0,31.0],[42.0,31.5],[37.0,33.0],[34.5,35.0],[35.0,36.8]]]}},
{"type":"Feature","properties":{"name":"Byzantine Empire","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[29.5,36.5],[30.0,39.5],[32.0,41.3],[35.5,41.6],[38.5,41.0],[39.8,39.9],[39.5,38.6],[39.9,38.1],[38.5,37.0],[35.0,36.8],[32.5,36.3],[29.5,36.5]]]}},
{"type":"Feature","properties":{"name":"Khazar Khaganate","color":"#78909c","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[42.0,42.8],[45.0,43.5],[48.0,43.8],[49.5,42.5],[47.0,41.8],[44.0,42.0],[42.0,42.8]]]}}
]}
$$::jsonb);

-- ============ BAGRATID ============

-- 885-907: Ashot I restores the kingdom
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (9, 885, 907, 'Bagratid restoration', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Bagratid Armenia","color":"#27ae60","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[42.6,41.0],[43.8,41.3],[45.0,41.2],[45.9,40.6],[46.3,39.8],[45.6,39.1],[44.5,38.9],[43.4,39.1],[42.7,39.9],[42.6,41.0]]]}},
{"type":"Feature","properties":{"name":"Vaspurakan","color":"#2ecc71","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[42.9,38.0],[42.8,38.9],[43.6,39.2],[44.6,39.0],[45.4,38.5],[44.9,37.9],[43.9,37.7],[42.9,38.0]]]}},
{"type":"Feature","properties":{"name":"Syunik","color":"#1e8449","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[45.6,39.1],[46.3,39.8],[46.9,39.4],[46.5,38.8],[45.9,38.7],[45.6,39.1]]]}},
{"type":"Feature","properties":{"name":"Byzantine Empire","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[30.0,37.0],[30.5,40.0],[32.5,41.8],[36.0,41.9],[39.5,41.3],[41.5,41.2],[42.6,41.0],[42.7,39.9],[41.5,38.9],[40.0,38.2],[38.0,37.5],[35.0,36.8],[31.5,36.2],[30.0,37.0]]]}},
{"type":"Feature","properties":{"name":"Arab Emirates","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[41.5,38.9],[42.7,39.9],[43.4,39.1],[43.6,39.2],[42.8,38.9],[42.9,38.0],[43.9,37.7],[44.9,37.9],[45.4,38.5],[46.5,38.8],[47.8,38.5],[49.0,37.5],[48.0,34.5],[44.0,34.0],[41.5,35.5],[40.5,37.5],[41.5,38.9]]]}},
{"type":"Feature","properties":{"name":"Georgia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.8,41.7],[43.2,41.4],[45.2,41.3],[46.0,42.2],[44.5,43.3],[42.0,43.3],[40.3,42.5],[40.8,41.7]]]}}
]}
$$::jsonb);

-- 908-1020: golden age — Ani, kingdoms of Vaspurakan and Kars
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (9, 908, 1020, 'Bagratid golden age', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Bagratid Armenia","color":"#27ae60","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[42.2,40.9],[43.6,41.4],[45.0,41.3],[46.0,40.6],[46.4,39.8],[45.7,39.1],[44.6,38.9],[43.4,39.0],[42.5,39.6],[42.2,40.9]]]}},
{"type":"Feature","properties":{"name":"Kingdom of Vaspurakan","color":"#2ecc71","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[42.9,38.0],[42.8,38.9],[43.6,39.2],[44.6,39.0],[45.4,38.5],[44.9,37.9],[43.9,37.7],[42.9,38.0]]]}},
{"type":"Feature","properties":{"name":"Kingdom of Kars","color":"#58d68d","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[42.3,40.3],[42.9,40.8],[43.6,40.6],[43.4,40.0],[42.7,39.9],[42.3,40.3]]]}},
{"type":"Feature","properties":{"name":"Syunik","color":"#1e8449","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[45.7,39.1],[46.4,39.8],[46.9,39.4],[46.5,38.8],[45.9,38.7],[45.7,39.1]]]}},
{"type":"Feature","properties":{"name":"Byzantine Empire","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[30.0,37.0],[30.5,40.0],[32.5,41.8],[36.0,41.9],[39.5,41.3],[41.5,41.2],[42.2,40.9],[42.5,39.6],[41.5,38.9],[40.0,38.2],[38.0,37.5],[35.0,36.8],[31.5,36.2],[30.0,37.0]]]}},
{"type":"Feature","properties":{"name":"Emirate of Azerbaijan","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.4,38.5],[46.5,38.8],[47.8,38.5],[49.0,37.5],[48.0,34.5],[44.5,34.5],[42.5,36.0],[43.9,37.7],[44.9,37.9],[45.4,38.5]]]}},
{"type":"Feature","properties":{"name":"Georgia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.8,41.7],[43.2,41.5],[45.2,41.4],[46.0,42.2],[44.5,43.3],[42.0,43.3],[40.3,42.5],[40.8,41.7]]]}}
]}
$$::jsonb);

-- 1021-1045: Byzantium swallows the Armenian kingdoms
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (9, 1021, 1045, 'Byzantine annexations', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Bagratid Armenia (Ani)","color":"#27ae60","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[42.8,40.9],[43.8,41.3],[45.0,41.2],[45.9,40.6],[46.3,39.9],[45.6,39.2],[44.6,39.0],[43.6,39.3],[43.0,40.0],[42.8,40.9]]]}},
{"type":"Feature","properties":{"name":"Syunik","color":"#1e8449","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[45.6,39.2],[46.3,39.9],[46.9,39.4],[46.5,38.8],[45.9,38.7],[45.6,39.2]]]}},
{"type":"Feature","properties":{"name":"Byzantine Empire","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[30.0,37.0],[30.5,40.0],[32.5,41.8],[36.0,41.9],[39.5,41.4],[41.8,41.3],[42.8,40.9],[43.0,40.0],[43.6,39.3],[44.6,39.0],[44.9,37.9],[43.9,37.7],[42.0,37.6],[40.0,38.0],[38.0,37.5],[35.0,36.8],[31.5,36.2],[30.0,37.0]]]}},
{"type":"Feature","properties":{"name":"Seljuk Turks","color":"#8d6e63","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[46.9,39.4],[48.0,39.5],[50.0,38.5],[51.5,36.0],[49.5,33.0],[46.0,33.5],[44.5,35.0],[45.4,38.5],[45.9,38.7],[46.5,38.8],[46.9,39.4]]]}},
{"type":"Feature","properties":{"name":"Georgia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.8,41.7],[43.2,41.5],[45.2,41.4],[46.0,42.2],[44.5,43.3],[42.0,43.3],[40.3,42.5],[40.8,41.7]]]}}
]}
$$::jsonb);

-- 1046-1197: Seljuk era — Syunik and Tashir hold out
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (10, 1046, 1197, 'Seljuk domination', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Kingdom of Syunik","color":"#f39c12","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[45.6,39.2],[46.3,39.7],[46.9,39.3],[46.4,38.8],[45.9,38.8],[45.6,39.2]]]}},
{"type":"Feature","properties":{"name":"Tashir-Dzoraget","color":"#e67e22","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[44.2,41.2],[45.0,41.1],[45.2,40.7],[44.5,40.5],[44.0,40.8],[44.2,41.2]]]}},
{"type":"Feature","properties":{"name":"Seljuk Empire","color":"#8d6e63","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[35.5,37.5],[36.5,39.5],[38.5,40.8],[41.0,41.2],[43.5,41.2],[46.0,40.5],[48.0,39.8],[50.5,38.0],[51.5,34.5],[47.0,31.5],[41.0,32.5],[37.0,34.5],[35.0,36.0],[35.5,37.5]]]}},
{"type":"Feature","properties":{"name":"Byzantine Empire","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[29.5,37.0],[30.0,40.0],[32.0,41.8],[35.0,41.9],[36.5,41.0],[35.5,39.0],[33.5,37.5],[31.0,36.5],[29.5,37.0]]]}},
{"type":"Feature","properties":{"name":"Georgia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.8,41.7],[43.2,41.5],[45.2,41.4],[46.0,42.2],[44.5,43.3],[42.0,43.3],[40.3,42.5],[40.8,41.7]]]}}
]}
$$::jsonb);

-- ============ CILICIA ============

-- 1198-1236: Kingdom of Cilicia + Zakarid Armenia under Georgia
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (11, 1198, 1236, 'Cilicia and Zakarid Armenia', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Kingdom of Cilicia","color":"#16a085","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[32.4,36.3],[33.0,37.0],[34.5,37.6],[36.2,37.9],[36.9,37.2],[36.3,36.3],[34.5,36.0],[33.0,36.0],[32.4,36.3]]]}},
{"type":"Feature","properties":{"name":"Zakarid Armenia","color":"#27ae60","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[43.0,41.2],[44.8,41.2],[45.9,40.6],[46.3,39.9],[45.6,39.1],[44.5,39.0],[43.4,39.2],[43.0,40.2],[43.0,41.2]]]}},
{"type":"Feature","properties":{"name":"Sultanate of Rum","color":"#8d6e63","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[30.5,37.0],[31.5,39.5],[35.0,40.5],[38.5,40.0],[40.5,39.5],[40.0,38.0],[38.0,37.8],[36.2,37.9],[34.5,37.6],[33.0,37.0],[32.4,36.3],[30.5,37.0]]]}},
{"type":"Feature","properties":{"name":"Principality of Antioch","color":"#455a64","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[35.8,35.5],[36.3,36.3],[36.9,37.2],[37.8,36.8],[37.2,35.8],[36.3,35.2],[35.8,35.5]]]}},
{"type":"Feature","properties":{"name":"Kingdom of Georgia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.5,41.6],[43.0,41.2],[45.2,41.4],[46.5,41.8],[45.5,43.0],[42.5,43.4],[40.3,42.5],[40.5,41.6]]]}},
{"type":"Feature","properties":{"name":"Ayyubid Sultanate","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[36.3,35.2],[37.2,35.8],[38.5,36.0],[40.5,35.5],[42.5,34.5],[42.0,32.5],[38.5,32.0],[36.0,33.5],[36.3,35.2]]]}}
]}
$$::jsonb);

-- 1237-1375: Mongol era — Cilicia allies with the Ilkhanate, falls to Mamluks
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (11, 1237, 1375, 'Cilicia between Mongols and Mamluks', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Kingdom of Cilicia","color":"#16a085","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[32.4,36.3],[33.0,37.0],[34.5,37.6],[36.2,37.9],[36.9,37.2],[36.3,36.3],[34.5,36.0],[33.0,36.0],[32.4,36.3]]]}},
{"type":"Feature","properties":{"name":"Ilkhanate (Mongols)","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[37.0,38.5],[38.5,40.5],[41.0,41.3],[44.0,41.4],[46.5,40.8],[49.0,40.0],[51.5,38.0],[52.0,33.5],[48.0,31.5],[43.0,32.5],[39.5,34.5],[37.5,36.5],[37.0,38.5]]]}},
{"type":"Feature","properties":{"name":"Mamluk Sultanate","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[33.0,34.0],[34.5,35.8],[36.3,36.3],[36.9,37.2],[38.0,36.8],[37.5,35.0],[36.0,33.0],[34.0,32.5],[33.0,34.0]]]}},
{"type":"Feature","properties":{"name":"Sultanate of Rum (vassal)","color":"#8d6e63","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[30.5,37.0],[31.5,39.5],[34.5,40.3],[36.8,39.5],[36.5,38.3],[34.5,37.6],[33.0,37.0],[32.4,36.3],[30.5,37.0]]]}},
{"type":"Feature","properties":{"name":"Kingdom of Georgia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.5,41.6],[43.0,41.3],[45.2,41.4],[46.5,41.8],[45.5,43.0],[42.5,43.4],[40.3,42.5],[40.5,41.6]]]}}
]}
$$::jsonb);

-- ============ FOREIGN RULE ============

-- 1376-1513: Turkoman confederations rule the highlands
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (12, 1376, 1513, 'Kara Koyunlu and Ak Koyunlu', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Kara Koyunlu / Ak Koyunlu","color":"#8d6e63","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[38.5,38.0],[40.0,40.5],[43.0,41.3],[46.0,40.5],[48.5,39.5],[49.5,37.0],[46.0,33.5],[41.0,33.5],[38.0,35.5],[38.5,38.0]]]}},
{"type":"Feature","properties":{"name":"Ottoman Empire","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[26.5,38.5],[27.0,41.5],[30.0,42.0],[34.0,42.0],[38.0,41.3],[40.0,40.5],[38.5,38.0],[36.0,36.5],[30.5,36.3],[26.5,38.5]]]}},
{"type":"Feature","properties":{"name":"Kingdom of Georgia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.5,41.6],[43.0,41.3],[45.2,41.4],[46.5,41.8],[45.5,43.0],[42.5,43.4],[40.3,42.5],[40.5,41.6]]]}}
]}
$$::jsonb);

-- 1514-1800: Ottoman-Safavid partition; Armenian melikdoms of Karabakh persist
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (12, 1514, 1800, 'Ottoman and Persian Armenia', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Melikdoms of Karabakh","color":"#f39c12","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[46.3,40.2],[46.9,40.0],[47.2,39.5],[46.6,39.1],[46.1,39.4],[46.3,40.2]]]}},
{"type":"Feature","properties":{"name":"Ottoman Empire (Western Armenia)","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[26.5,38.5],[27.0,41.5],[31.0,42.0],[36.0,41.8],[40.0,41.5],[43.5,41.3],[44.3,40.3],[44.0,39.0],[42.5,37.5],[40.0,36.0],[36.5,36.2],[30.5,36.3],[26.5,38.5]]]}},
{"type":"Feature","properties":{"name":"Safavid / Qajar Persia (Eastern Armenia)","color":"#5d4037","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[44.3,40.3],[45.5,41.2],[47.0,41.5],[49.0,40.5],[51.0,38.0],[51.5,34.0],[47.5,31.5],[43.5,33.0],[41.5,35.0],[42.5,37.5],[44.0,39.0],[44.3,40.3]]]}},
{"type":"Feature","properties":{"name":"Kingdom of Kartli-Kakheti","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[42.5,41.5],[44.5,41.4],[46.0,41.8],[45.5,42.8],[43.5,43.0],[42.0,42.3],[42.5,41.5]]]}}
]}
$$::jsonb);

-- 1801-1827: Russia enters the Caucasus
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (12, 1801, 1827, 'Russia enters the Caucasus', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Melikdoms of Karabakh","color":"#f39c12","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[46.3,40.2],[46.9,40.0],[47.2,39.5],[46.6,39.1],[46.1,39.4],[46.3,40.2]]]}},
{"type":"Feature","properties":{"name":"Russian Empire","color":"#37474f","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.0,41.8],[43.5,41.4],[45.6,41.3],[47.5,41.6],[49.0,42.0],[46.0,43.5],[41.5,43.5],[39.5,42.5],[40.0,41.8]]]}},
{"type":"Feature","properties":{"name":"Ottoman Empire","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[26.5,38.5],[27.0,41.5],[31.0,42.0],[36.0,41.8],[40.0,41.5],[43.5,41.3],[44.3,40.3],[44.0,39.0],[42.5,37.5],[40.0,36.0],[36.5,36.2],[30.5,36.3],[26.5,38.5]]]}},
{"type":"Feature","properties":{"name":"Qajar Persia","color":"#5d4037","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[44.3,40.3],[45.5,41.0],[47.0,41.2],[49.0,40.5],[51.0,38.0],[51.5,34.0],[47.5,31.5],[43.5,33.0],[41.5,35.0],[42.5,37.5],[44.0,39.0],[44.3,40.3]]]}}
]}
$$::jsonb);

-- 1828-1877: Eastern Armenia under Russia (Treaty of Turkmenchay)
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (13, 1828, 1877, 'Russian Eastern Armenia', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Eastern Armenia (Russian)","color":"#5c7fa3","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[43.6,41.2],[44.8,41.3],[45.6,40.9],[46.0,40.2],[45.9,39.4],[44.8,38.9],[44.2,39.4],[43.7,40.1],[43.6,41.2]]]}},
{"type":"Feature","properties":{"name":"Western Armenia (Ottoman)","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[38.0,37.8],[38.5,39.8],[39.8,40.8],[41.5,41.1],[43.0,41.3],[43.6,41.2],[43.7,40.1],[44.2,39.4],[43.5,38.6],[42.0,37.9],[40.0,37.6],[38.0,37.8]]]}},
{"type":"Feature","properties":{"name":"Russian Empire","color":"#37474f","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.5,41.8],[43.6,41.3],[45.6,41.2],[47.5,41.5],[49.3,41.9],[46.0,43.5],[41.5,43.5],[39.8,42.6],[40.5,41.8]]]}},
{"type":"Feature","properties":{"name":"Qajar Persia","color":"#5d4037","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[44.8,38.9],[45.9,39.4],[47.0,39.0],[48.5,38.5],[50.5,36.5],[50.0,33.5],[46.5,32.5],[43.5,34.0],[43.5,38.6],[44.2,39.4],[44.8,38.9]]]}}
]}
$$::jsonb);

-- 1878-1917: Kars joins Russian Armenia (Treaty of Berlin)
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (13, 1878, 1917, 'Russian Armenia with Kars', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Eastern Armenia (Russian)","color":"#5c7fa3","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[42.5,41.1],[44.8,41.3],[45.6,40.9],[46.0,40.2],[45.9,39.4],[44.8,38.9],[44.2,39.4],[43.2,39.9],[42.5,40.3],[42.5,41.1]]]}},
{"type":"Feature","properties":{"name":"Western Armenia (Ottoman)","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[38.0,37.8],[38.5,39.8],[39.8,40.8],[41.5,41.1],[42.5,41.1],[42.5,40.3],[43.2,39.9],[43.5,38.6],[42.0,37.9],[40.0,37.6],[38.0,37.8]]]}},
{"type":"Feature","properties":{"name":"Russian Empire","color":"#37474f","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.5,41.8],[43.6,41.3],[45.6,41.2],[47.5,41.5],[49.3,41.9],[46.0,43.5],[41.5,43.5],[39.8,42.6],[40.5,41.8]]]}},
{"type":"Feature","properties":{"name":"Qajar Persia","color":"#5d4037","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[44.8,38.9],[45.9,39.4],[47.0,39.0],[48.5,38.5],[50.5,36.5],[50.0,33.5],[46.5,32.5],[43.5,34.0],[43.5,38.6],[44.2,39.4],[44.8,38.9]]]}}
]}
$$::jsonb);

-- 1918-1920: First Republic
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (14, 1918, 1920, 'First Republic of Armenia', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Republic of Armenia","color":"#e74c3c","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[43.0,41.1],[44.6,41.2],[45.6,40.9],[45.9,40.0],[45.6,39.2],[44.8,38.9],[44.0,39.3],[43.4,40.2],[43.0,41.1]]]}},
{"type":"Feature","properties":{"name":"Ottoman Empire / Turkey","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[38.0,37.8],[38.5,39.8],[39.8,40.8],[41.5,41.1],[43.0,41.1],[43.4,40.2],[44.0,39.3],[43.5,38.6],[42.0,37.9],[40.0,37.6],[38.0,37.8]]]}},
{"type":"Feature","properties":{"name":"Georgia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.8,41.7],[43.0,41.2],[44.6,41.3],[45.8,41.6],[45.0,42.8],[42.5,43.3],[40.3,42.5],[40.8,41.7]]]}},
{"type":"Feature","properties":{"name":"Azerbaijan","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.6,40.9],[46.5,41.0],[48.5,40.8],[50.0,40.0],[49.0,38.8],[46.5,38.8],[45.6,39.2],[45.9,40.0],[45.6,40.9]]]}},
{"type":"Feature","properties":{"name":"Persia","color":"#5d4037","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[44.0,39.3],[44.8,38.9],[45.6,39.2],[46.5,38.8],[48.0,38.3],[48.5,36.5],[45.5,35.5],[43.5,36.5],[43.5,38.6],[44.0,39.3]]]}}
]}
$$::jsonb);

-- 1921-1990: Soviet Armenia
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (15, 1921, 1990, 'Armenian SSR', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Armenian SSR","color":"#c0392b","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[43.45,41.25],[44.0,41.19],[44.6,41.2],[45.0,41.3],[45.6,40.9],[45.4,40.65],[45.95,40.6],[46.5,40.55],[46.6,39.6],[46.4,38.9],[46.15,38.85],[45.9,39.55],[45.0,39.75],[44.8,39.7],[44.3,40.0],[43.65,40.1],[43.45,40.55],[43.45,41.25]]]}},
{"type":"Feature","properties":{"name":"Nagorno-Karabakh AO","color":"#e67e22","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[46.5,40.15],[47.0,40.0],[47.2,39.7],[46.9,39.4],[46.5,39.5],[46.4,39.9],[46.5,40.15]]]}},
{"type":"Feature","properties":{"name":"Georgian SSR","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.0,41.6],[43.45,41.25],[44.6,41.2],[45.8,41.3],[46.5,41.9],[44.5,43.2],[41.5,43.2],[40.0,42.3],[40.0,41.6]]]}},
{"type":"Feature","properties":{"name":"Azerbaijan SSR","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.0,41.3],[46.5,41.5],[48.5,41.0],[50.0,40.0],[49.0,38.8],[46.4,38.9],[46.6,39.6],[46.5,40.55],[45.95,40.6],[45.4,40.65],[45.6,40.9],[45.0,41.3]]]}},
{"type":"Feature","properties":{"name":"Turkey","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[38.5,38.0],[39.5,40.0],[41.5,41.2],[43.45,41.25],[43.45,40.55],[43.65,40.1],[44.3,40.0],[44.0,39.3],[42.5,38.5],[40.5,37.8],[38.5,38.0]]]}},
{"type":"Feature","properties":{"name":"Iran","color":"#5d4037","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[44.0,39.3],[44.8,39.65],[45.9,39.5],[46.15,38.85],[48.0,38.5],[48.5,37.0],[45.5,36.5],[43.0,37.5],[44.0,39.3]]]}}
]}
$$::jsonb);

-- 1991-1993: independence and the First Karabakh War
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (16, 1991, 1993, 'Independence restored', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Republic of Armenia","color":"#f39c12","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[43.45,41.25],[44.0,41.19],[44.6,41.2],[45.0,41.3],[45.6,40.9],[45.4,40.65],[45.95,40.6],[46.5,40.55],[46.6,39.6],[46.4,38.9],[46.15,38.85],[45.9,39.55],[45.0,39.75],[44.8,39.7],[44.3,40.0],[43.65,40.1],[43.45,40.55],[43.45,41.25]]]}},
{"type":"Feature","properties":{"name":"Nagorno-Karabakh (war)","color":"#e74c3c","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[46.5,40.15],[47.0,40.0],[47.2,39.7],[46.9,39.4],[46.5,39.5],[46.4,39.9],[46.5,40.15]]]}},
{"type":"Feature","properties":{"name":"Georgia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.0,41.6],[43.45,41.25],[44.6,41.2],[45.8,41.3],[46.5,41.9],[44.5,43.2],[41.5,43.2],[40.0,42.3],[40.0,41.6]]]}},
{"type":"Feature","properties":{"name":"Azerbaijan","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.0,41.3],[46.5,41.5],[48.5,41.0],[50.0,40.0],[49.0,38.8],[46.4,38.9],[46.6,39.6],[46.5,40.55],[45.95,40.6],[45.4,40.65],[45.6,40.9],[45.0,41.3]]]}},
{"type":"Feature","properties":{"name":"Turkey","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[38.5,38.0],[39.5,40.0],[41.5,41.2],[43.45,41.25],[43.45,40.55],[43.65,40.1],[44.3,40.0],[44.0,39.3],[42.5,38.5],[40.5,37.8],[38.5,38.0]]]}},
{"type":"Feature","properties":{"name":"Iran","color":"#5d4037","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[44.0,39.3],[44.8,39.65],[45.9,39.5],[46.15,38.85],[48.0,38.5],[48.5,37.0],[45.5,36.5],[43.0,37.5],[44.0,39.3]]]}}
]}
$$::jsonb);

-- 1994-2019: ceasefire — Artsakh de facto
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (16, 1994, 2019, 'Republic of Armenia and Artsakh', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Republic of Armenia","color":"#f39c12","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[43.45,41.25],[44.0,41.19],[44.6,41.2],[45.0,41.3],[45.6,40.9],[45.4,40.65],[45.95,40.6],[46.5,40.55],[46.6,39.6],[46.4,38.9],[46.15,38.85],[45.9,39.55],[45.0,39.75],[44.8,39.7],[44.3,40.0],[43.65,40.1],[43.45,40.55],[43.45,41.25]]]}},
{"type":"Feature","properties":{"name":"Artsakh (de facto)","color":"#e67e22","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[46.0,40.2],[46.7,40.05],[47.1,39.8],[46.9,39.3],[46.5,38.9],[46.0,39.1],[45.8,39.6],[46.0,40.2]]]}},
{"type":"Feature","properties":{"name":"Georgia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.0,41.6],[43.45,41.25],[44.6,41.2],[45.8,41.3],[46.5,41.9],[44.5,43.2],[41.5,43.2],[40.0,42.3],[40.0,41.6]]]}},
{"type":"Feature","properties":{"name":"Azerbaijan","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.0,41.3],[46.5,41.5],[48.5,41.0],[50.0,40.0],[49.0,38.8],[46.9,39.3],[47.1,39.8],[46.7,40.05],[46.5,40.55],[45.95,40.6],[45.4,40.65],[45.6,40.9],[45.0,41.3]]]}},
{"type":"Feature","properties":{"name":"Turkey","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[38.5,38.0],[39.5,40.0],[41.5,41.2],[43.45,41.25],[43.45,40.55],[43.65,40.1],[44.3,40.0],[44.0,39.3],[42.5,38.5],[40.5,37.8],[38.5,38.0]]]}},
{"type":"Feature","properties":{"name":"Iran","color":"#5d4037","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[44.0,39.3],[44.8,39.65],[45.9,39.5],[46.15,38.85],[48.0,38.5],[48.5,37.0],[45.5,36.5],[43.0,37.5],[44.0,39.3]]]}}
]}
$$::jsonb);

-- 2020-2022: after the 44-day war
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (16, 2020, 2022, 'After the Second Karabakh War', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Republic of Armenia","color":"#f39c12","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[43.45,41.25],[44.0,41.19],[44.6,41.2],[45.0,41.3],[45.6,40.9],[45.4,40.65],[45.95,40.6],[46.5,40.55],[46.6,39.6],[46.4,38.9],[46.15,38.85],[45.9,39.55],[45.0,39.75],[44.8,39.7],[44.3,40.0],[43.65,40.1],[43.45,40.55],[43.45,41.25]]]}},
{"type":"Feature","properties":{"name":"Artsakh (reduced)","color":"#e67e22","role":"ally"},"geometry":{"type":"Polygon","coordinates":[[[46.4,40.1],[46.9,39.9],[47.0,39.6],[46.6,39.4],[46.3,39.7],[46.4,40.1]]]}},
{"type":"Feature","properties":{"name":"Georgia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.0,41.6],[43.45,41.25],[44.6,41.2],[45.8,41.3],[46.5,41.9],[44.5,43.2],[41.5,43.2],[40.0,42.3],[40.0,41.6]]]}},
{"type":"Feature","properties":{"name":"Azerbaijan","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.0,41.3],[46.5,41.5],[48.5,41.0],[50.0,40.0],[49.0,38.8],[46.4,38.9],[46.6,39.6],[46.5,40.55],[45.95,40.6],[45.4,40.65],[45.6,40.9],[45.0,41.3]]]}},
{"type":"Feature","properties":{"name":"Turkey","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[38.5,38.0],[39.5,40.0],[41.5,41.2],[43.45,41.25],[43.45,40.55],[43.65,40.1],[44.3,40.0],[44.0,39.3],[42.5,38.5],[40.5,37.8],[38.5,38.0]]]}},
{"type":"Feature","properties":{"name":"Iran","color":"#5d4037","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[44.0,39.3],[44.8,39.65],[45.9,39.5],[46.15,38.85],[48.0,38.5],[48.5,37.0],[45.5,36.5],[43.0,37.5],[44.0,39.3]]]}}
]}
$$::jsonb);

-- 2023-2025: present day
INSERT INTO territories (era_id, start_year, end_year, label, geojson) VALUES (16, 2023, 2025, 'Republic of Armenia today', $$
{"type":"FeatureCollection","features":[
{"type":"Feature","properties":{"name":"Republic of Armenia","color":"#f39c12","role":"main"},"geometry":{"type":"Polygon","coordinates":[[[43.45,41.25],[44.0,41.19],[44.6,41.2],[45.0,41.3],[45.6,40.9],[45.4,40.65],[45.95,40.6],[46.5,40.55],[46.6,39.6],[46.4,38.9],[46.15,38.85],[45.9,39.55],[45.0,39.75],[44.8,39.7],[44.3,40.0],[43.65,40.1],[43.45,40.55],[43.45,41.25]]]}},
{"type":"Feature","properties":{"name":"Georgia","color":"#546e7a","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[40.0,41.6],[43.45,41.25],[44.6,41.2],[45.8,41.3],[46.5,41.9],[44.5,43.2],[41.5,43.2],[40.0,42.3],[40.0,41.6]]]}},
{"type":"Feature","properties":{"name":"Azerbaijan","color":"#6d4c41","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[45.0,41.3],[46.5,41.5],[48.5,41.0],[50.0,40.0],[49.0,38.8],[46.4,38.9],[46.6,39.6],[46.5,40.55],[45.95,40.6],[45.4,40.65],[45.6,40.9],[45.0,41.3]]]}},
{"type":"Feature","properties":{"name":"Turkey","color":"#795548","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[38.5,38.0],[39.5,40.0],[41.5,41.2],[43.45,41.25],[43.45,40.55],[43.65,40.1],[44.3,40.0],[44.0,39.3],[42.5,38.5],[40.5,37.8],[38.5,38.0]]]}},
{"type":"Feature","properties":{"name":"Iran","color":"#5d4037","role":"neighbor"},"geometry":{"type":"Polygon","coordinates":[[[44.0,39.3],[44.8,39.65],[45.9,39.5],[46.15,38.85],[48.0,38.5],[48.5,37.0],[45.5,36.5],[43.0,37.5],[44.0,39.3]]]}}
]}
$$::jsonb);
