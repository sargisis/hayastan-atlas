-- Hayastan Atlas — PostgreSQL schema

CREATE EXTENSION IF NOT EXISTS postgis;

-- Users (created on first Google OAuth login)
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id   TEXT UNIQUE NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dynasties (Artaxiad, Arsacid, Bagratid, …)
CREATE TABLE dynasties (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    name_hy     TEXT,          -- Armenian name
    start_year  INT NOT NULL,  -- negative = BC
    end_year    INT NOT NULL
);

-- Kings / rulers
CREATE TABLE kings (
    id           SERIAL PRIMARY KEY,
    dynasty_id   INT REFERENCES dynasties(id),
    name         TEXT NOT NULL,
    name_hy      TEXT,
    reign_start  INT NOT NULL,
    reign_end    INT,          -- NULL if still reigning / unknown
    bio          TEXT,
    portrait_url TEXT
);

-- Historical eras / states
CREATE TABLE eras (
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL,
    start_year   INT NOT NULL,
    end_year     INT NOT NULL,
    capital      TEXT,
    color        TEXT NOT NULL DEFAULT '#c0392b',  -- map fill color
    description  TEXT
);

-- Territory polygons: one row per era (GeoJSON stored as JSONB for simplicity;
-- swap to PostGIS geometry column if spatial queries are needed)
CREATE TABLE territories (
    id         SERIAL PRIMARY KEY,
    era_id     INT REFERENCES eras(id) ON DELETE CASCADE,
    geojson    JSONB NOT NULL,   -- FeatureCollection
    label      TEXT
);

-- Events pinned to a year and map point
CREATE TABLE events (
    id          SERIAL PRIMARY KEY,
    era_id      INT REFERENCES eras(id),
    year        INT NOT NULL,
    title       TEXT NOT NULL,
    description TEXT,
    lat         DOUBLE PRECISION,
    lng         DOUBLE PRECISION
);

-- Saved bookmarks (auth-only)
CREATE TABLE bookmarks (
    id         SERIAL PRIMARY KEY,
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
    year       INT NOT NULL,
    label      TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_eras_years      ON eras(start_year, end_year);
CREATE INDEX idx_events_year     ON events(year);
CREATE INDEX idx_bookmarks_user  ON bookmarks(user_id);
