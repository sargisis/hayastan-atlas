-- Cities of Armenian history (appear/disappear with the timeline)
-- and campaign arrows added to key territory phases.
-- Run: psql -U postgres -d hayastan_atlas -f cities_arrows.sql

CREATE TABLE IF NOT EXISTS cities (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    name_hy       TEXT,
    lat           DOUBLE PRECISION NOT NULL,
    lng           DOUBLE PRECISION NOT NULL,
    start_year    INT NOT NULL,
    end_year      INT NOT NULL,
    capital_start INT,   -- years during which the city was a capital
    capital_end   INT
);

TRUNCATE cities RESTART IDENTITY;

INSERT INTO cities (name, name_hy, lat, lng, start_year, end_year, capital_start, capital_end) VALUES
    ('Tushpa (Van)',   'Տոսպ (Վան)',    38.49, 43.38,  -832, 2025,  -832,  -590),
    ('Erebuni (Yerevan)','Էրեբունի (Երևան)',40.18, 44.51, -782, 2025,  1918,  2025),
    ('Armavir',        'Արմավիր',        40.15, 44.04,  -776,  400,  -331,  -210),
    ('Yervandashat',   'Երվանդաշատ',    40.05, 43.90,  -210,  360,  -210,  -176),
    ('Artashat',       'Արտաշատ',        39.95, 44.55,  -176,  450,  -176,    77),
    ('Tigranakert',    'Տիգրանակերտ',   37.90, 41.00,   -77,  400,   -77,   -69),
    ('Vagharshapat',   'Վաղարշապատ',    40.16, 44.29,   117, 2025,   120,   330),
    ('Dvin',           'Դվին',           40.00, 44.58,   335, 1236,   336,   885),
    ('Kars',           'Կարս',           40.60, 43.09,   928, 2025,   928,   961),
    ('Ani',            'Անի',            40.51, 43.57,   961, 1319,   961,  1045),
    ('Anazarbus',      'Անավարզա',      37.26, 35.90,  1100, 1400,  1100,  1198),
    ('Sis',            'Սիս',            37.45, 35.81,  1100, 2025,  1198,  1375),
    ('Gyumri',         'Գյումրի',        40.79, 43.85,  1837, 2025,  NULL,  NULL),
    ('Stepanakert',    'Ստեփանակերտ',  39.82, 46.75,  1923, 2025,  1991,  2023);

-- ============ CAMPAIGN ARROWS ============
-- Appended as extra features (role=arrow / arrowhead) to existing phases.

-- Urartu peak: campaigns of Argishti I north to the Ararat plain and west
UPDATE territories SET geojson = jsonb_set(geojson, '{features}', (geojson->'features') || $$[
{"type":"Feature","properties":{"name":"Campaigns of Argishti I","color":"#ffd54f","role":"arrow"},"geometry":{"type":"LineString","coordinates":[[43.0,38.5],[44.0,39.5],[44.5,40.1]]}},
{"type":"Feature","properties":{"role":"arrowhead","color":"#ffd54f","rotate":-55},"geometry":{"type":"Point","coordinates":[44.5,40.1]}},
{"type":"Feature","properties":{"name":"","color":"#ffd54f","role":"arrow"},"geometry":{"type":"LineString","coordinates":[[42.5,38.4],[40.8,38.7],[39.4,38.9]]}},
{"type":"Feature","properties":{"role":"arrowhead","color":"#ffd54f","rotate":180},"geometry":{"type":"Point","coordinates":[39.4,38.9]}}
]$$::jsonb) WHERE start_year = -785;

-- Median invasion destroys Urartu
UPDATE territories SET geojson = jsonb_set(geojson, '{features}', (geojson->'features') || $$[
{"type":"Feature","properties":{"name":"Median invasion","color":"#ff8a65","role":"arrow"},"geometry":{"type":"LineString","coordinates":[[47.0,36.0],[45.5,37.5],[44.2,38.2]]}},
{"type":"Feature","properties":{"role":"arrowhead","color":"#ff8a65","rotate":-152},"geometry":{"type":"Point","coordinates":[44.2,38.2]}}
]$$::jsonb) WHERE start_year = -639;

-- Empire of Tigranes: campaigns to Syria and the east
UPDATE territories SET geojson = jsonb_set(geojson, '{features}', (geojson->'features') || $$[
{"type":"Feature","properties":{"name":"Campaigns of Tigranes II","color":"#ffd54f","role":"arrow"},"geometry":{"type":"LineString","coordinates":[[44.0,39.0],[41.5,36.8],[38.2,35.2]]}},
{"type":"Feature","properties":{"role":"arrowhead","color":"#ffd54f","rotate":155},"geometry":{"type":"Point","coordinates":[38.2,35.2]}},
{"type":"Feature","properties":{"name":"","color":"#ffd54f","role":"arrow"},"geometry":{"type":"LineString","coordinates":[[44.5,39.2],[46.3,38.3],[47.6,37.6]]}},
{"type":"Feature","properties":{"role":"arrowhead","color":"#ffd54f","rotate":25},"geometry":{"type":"Point","coordinates":[47.6,37.6]}}
]$$::jsonb) WHERE start_year = -95;

-- Seljuk invasions toward Ani
UPDATE territories SET geojson = jsonb_set(geojson, '{features}', (geojson->'features') || $$[
{"type":"Feature","properties":{"name":"Seljuk invasions","color":"#ff8a65","role":"arrow"},"geometry":{"type":"LineString","coordinates":[[48.5,38.5],[46.2,39.8],[43.9,40.4]]}},
{"type":"Feature","properties":{"role":"arrowhead","color":"#ff8a65","rotate":-168},"geometry":{"type":"Point","coordinates":[43.9,40.4]}}
]$$::jsonb) WHERE start_year = 1046;

-- Mamluk assaults on Cilicia
UPDATE territories SET geojson = jsonb_set(geojson, '{features}', (geojson->'features') || $$[
{"type":"Feature","properties":{"name":"Mamluk assaults","color":"#ff8a65","role":"arrow"},"geometry":{"type":"LineString","coordinates":[[36.5,34.0],[35.9,35.4],[35.2,36.3]]}},
{"type":"Feature","properties":{"role":"arrowhead","color":"#ff8a65","rotate":-129},"geometry":{"type":"Point","coordinates":[35.2,36.3]}}
]$$::jsonb) WHERE start_year = 1237;
