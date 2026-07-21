package model

import "time"

type Era struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	NameHY      string `json:"name_hy"`
	StartYear   int    `json:"start_year"`
	EndYear     int    `json:"end_year"`
	Capital     string `json:"capital"`
	Color       string `json:"color"`
	Description   string `json:"description"`
	DescriptionHY string `json:"description_hy"`
}

type Territory struct {
	ID      int    `json:"id"`
	EraID   int    `json:"era_id"`
	GeoJSON []byte `json:"geojson"` // raw JSON
	Label   string `json:"label"`
}

type Dynasty struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	NameHY    string `json:"name_hy"`
	StartYear int    `json:"start_year"`
	EndYear   int    `json:"end_year"`
}

type King struct {
	ID          int     `json:"id"`
	DynastyID   int     `json:"dynasty_id"`
	DynastyName string  `json:"dynasty_name,omitempty"`
	Name        string  `json:"name"`
	NameHY      string  `json:"name_hy"`
	ReignStart  int     `json:"reign_start"`
	ReignEnd    *int    `json:"reign_end"`
	Bio         string  `json:"bio"`
	BioHY       string  `json:"bio_hy"`
	PortraitURL *string `json:"portrait_url"`
}

type Event struct {
	ID            int      `json:"id"`
	EraID         *int     `json:"era_id"`
	Year          int      `json:"year"`
	Title         string   `json:"title"`
	TitleHY       string   `json:"title_hy"`
	Description   string   `json:"description"`
	DescriptionHY string   `json:"description_hy"`
	Lat           *float64 `json:"lat"`
	Lng           *float64 `json:"lng"`
}

type City struct {
	ID        int     `json:"id"`
	Name      string  `json:"name"`
	NameHY    string  `json:"name_hy"`
	Lat       float64 `json:"lat"`
	Lng       float64 `json:"lng"`
	IsCapital bool    `json:"is_capital"`
}

type User struct {
	ID        string    `json:"id"`
	GoogleID  string    `json:"-"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	AvatarURL *string   `json:"avatar_url"`
	CreatedAt time.Time `json:"created_at"`
}

type Bookmark struct {
	ID        int       `json:"id"`
	UserID    string    `json:"-"`
	Year      int       `json:"year"`
	Label     string    `json:"label"`
	Note      string    `json:"note"`
	CreatedAt time.Time `json:"created_at"`
}
