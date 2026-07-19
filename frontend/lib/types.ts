export interface Era {
  id: number;
  name: string;
  name_hy: string;
  start_year: number;
  end_year: number;
  capital: string;
  color: string;
  description: string;
}

export interface King {
  id: number;
  dynasty_id: number;
  dynasty_name: string;
  name: string;
  name_hy: string;
  reign_start: number;
  reign_end: number | null;
  bio: string;
  portrait_url: string | null;
}

export interface Event {
  id: number;
  era_id: number | null;
  year: number;
  title: string;
  description: string;
  lat: number | null;
  lng: number | null;
}

export interface TimelineResponse {
  era: Era;
  events: Event[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
}

export interface Bookmark {
  id: number;
  user_id: string;
  year: number;
  label: string;
  created_at: string;
}
