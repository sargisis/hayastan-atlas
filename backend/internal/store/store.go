package store

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"

	"hayastan-atlas/backend/internal/model"
)

type Store struct {
	db *pgxpool.Pool
}

func New(db *pgxpool.Pool) *Store {
	return &Store{db: db}
}

func (s *Store) ListEras(ctx context.Context) ([]model.Era, error) {
	rows, err := s.db.Query(ctx, `
		SELECT id, name, COALESCE(name_hy,''), start_year, end_year, COALESCE(capital,''), color, COALESCE(description,''), COALESCE(description_hy,'')
		FROM eras ORDER BY start_year`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var eras []model.Era
	for rows.Next() {
		var e model.Era
		if err := rows.Scan(&e.ID, &e.Name, &e.NameHY, &e.StartYear, &e.EndYear, &e.Capital, &e.Color, &e.Description, &e.DescriptionHY); err != nil {
			return nil, err
		}
		eras = append(eras, e)
	}
	return eras, rows.Err()
}

func (s *Store) GetTerritory(ctx context.Context, eraID int) (*model.Territory, error) {
	var t model.Territory
	err := s.db.QueryRow(ctx,
		`SELECT id, era_id, geojson, COALESCE(label,'') FROM territories WHERE era_id=$1`, eraID,
	).Scan(&t.ID, &t.EraID, &t.GeoJSON, &t.Label)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

// GetTerritoryForYear returns the territory phase covering a specific year.
// If phases overlap, the narrowest (most specific) wins.
func (s *Store) GetTerritoryForYear(ctx context.Context, year int) (*model.Territory, error) {
	var t model.Territory
	err := s.db.QueryRow(ctx, `
		SELECT id, era_id, geojson, COALESCE(label,'')
		FROM territories
		WHERE start_year <= $1 AND end_year >= $1
		ORDER BY (end_year - start_year) ASC
		LIMIT 1`, year,
	).Scan(&t.ID, &t.EraID, &t.GeoJSON, &t.Label)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

// ListCitiesForYear returns cities existing at the given year,
// marking whichever was the capital at that time.
func (s *Store) ListCitiesForYear(ctx context.Context, year int) ([]model.City, error) {
	rows, err := s.db.Query(ctx, `
		SELECT id, name, COALESCE(name_hy,''), lat, lng,
		       (capital_start IS NOT NULL AND capital_start <= $1 AND capital_end >= $1)
		FROM cities
		WHERE start_year <= $1 AND end_year >= $1
		ORDER BY name`, year)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cities []model.City
	for rows.Next() {
		var c model.City
		if err := rows.Scan(&c.ID, &c.Name, &c.NameHY, &c.Lat, &c.Lng, &c.IsCapital); err != nil {
			return nil, err
		}
		cities = append(cities, c)
	}
	return cities, rows.Err()
}

func (s *Store) ListKings(ctx context.Context) ([]model.King, error) {
	rows, err := s.db.Query(ctx, `
		SELECT k.id, k.dynasty_id, d.name, k.name, COALESCE(k.name_hy,''),
		       k.reign_start, k.reign_end, COALESCE(k.bio,''), COALESCE(k.bio_hy,''), k.portrait_url
		FROM kings k
		JOIN dynasties d ON d.id = k.dynasty_id
		ORDER BY k.reign_start`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var kings []model.King
	for rows.Next() {
		var k model.King
		if err := rows.Scan(&k.ID, &k.DynastyID, &k.DynastyName, &k.Name, &k.NameHY,
			&k.ReignStart, &k.ReignEnd, &k.Bio, &k.BioHY, &k.PortraitURL); err != nil {
			return nil, err
		}
		kings = append(kings, k)
	}
	return kings, rows.Err()
}

func (s *Store) GetKing(ctx context.Context, id int) (*model.King, error) {
	var k model.King
	err := s.db.QueryRow(ctx, `
		SELECT k.id, k.dynasty_id, d.name, k.name, COALESCE(k.name_hy,''),
		       k.reign_start, k.reign_end, COALESCE(k.bio,''), COALESCE(k.bio_hy,''), k.portrait_url
		FROM kings k
		JOIN dynasties d ON d.id = k.dynasty_id
		WHERE k.id=$1`, id,
	).Scan(&k.ID, &k.DynastyID, &k.DynastyName, &k.Name, &k.NameHY,
		&k.ReignStart, &k.ReignEnd, &k.Bio, &k.BioHY, &k.PortraitURL)
	if err != nil {
		return nil, err
	}
	return &k, nil
}

func (s *Store) ListEventsByYear(ctx context.Context, year int) ([]model.Event, error) {
	rows, err := s.db.Query(ctx, `
		SELECT id, era_id, year, title, COALESCE(title_hy,''), COALESCE(description,''), COALESCE(description_hy,''), lat, lng, COALESCE(category,'political')
		FROM events WHERE year <= $1
		ORDER BY year`, year)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []model.Event
	for rows.Next() {
		var e model.Event
		if err := rows.Scan(&e.ID, &e.EraID, &e.Year, &e.Title, &e.TitleHY, &e.Description, &e.DescriptionHY, &e.Lat, &e.Lng, &e.Category); err != nil {
			return nil, err
		}
		events = append(events, e)
	}
	return events, rows.Err()
}

func (s *Store) ListAllEvents(ctx context.Context) ([]model.Event, error) {
	rows, err := s.db.Query(ctx, `
		SELECT id, era_id, year, title, COALESCE(title_hy,''), COALESCE(description,''), COALESCE(description_hy,''), lat, lng, COALESCE(category,'political')
		FROM events ORDER BY year`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []model.Event
	for rows.Next() {
		var e model.Event
		if err := rows.Scan(&e.ID, &e.EraID, &e.Year, &e.Title, &e.TitleHY, &e.Description, &e.DescriptionHY, &e.Lat, &e.Lng, &e.Category); err != nil {
			return nil, err
		}
		events = append(events, e)
	}
	return events, rows.Err()
}

// GetEraForYear returns the era active at a given year.
func (s *Store) GetEraForYear(ctx context.Context, year int) (*model.Era, error) {
	var e model.Era
	err := s.db.QueryRow(ctx, `
		SELECT id, name, COALESCE(name_hy,''), start_year, end_year, COALESCE(capital,''), color, COALESCE(description,''), COALESCE(description_hy,'')
		FROM eras
		WHERE start_year <= $1 AND end_year >= $1
		ORDER BY start_year DESC
		LIMIT 1`, year,
	).Scan(&e.ID, &e.Name, &e.NameHY, &e.StartYear, &e.EndYear, &e.Capital, &e.Color, &e.Description, &e.DescriptionHY)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

// --- User / Auth ---

func (s *Store) UpsertUser(ctx context.Context, u *model.User) error {
	return s.db.QueryRow(ctx, `
		INSERT INTO users (google_id, email, name, avatar_url)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (google_id) DO UPDATE
		  SET email=$2, name=$3, avatar_url=$4
		RETURNING id, created_at`,
		u.GoogleID, u.Email, u.Name, u.AvatarURL,
	).Scan(&u.ID, &u.CreatedAt)
}

func (s *Store) GetUserByID(ctx context.Context, id string) (*model.User, error) {
	var u model.User
	err := s.db.QueryRow(ctx,
		`SELECT id, google_id, email, name, avatar_url, created_at FROM users WHERE id=$1`, id,
	).Scan(&u.ID, &u.GoogleID, &u.Email, &u.Name, &u.AvatarURL, &u.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

// --- Bookmarks ---

func (s *Store) ListBookmarks(ctx context.Context, userID string) ([]model.Bookmark, error) {
	rows, err := s.db.Query(ctx,
		`SELECT id, user_id, year, COALESCE(label,''), COALESCE(note,''), created_at FROM bookmarks WHERE user_id=$1 ORDER BY created_at DESC`,
		userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bs []model.Bookmark
	for rows.Next() {
		var b model.Bookmark
		if err := rows.Scan(&b.ID, &b.UserID, &b.Year, &b.Label, &b.Note, &b.CreatedAt); err != nil {
			return nil, err
		}
		bs = append(bs, b)
	}
	return bs, rows.Err()
}

func (s *Store) CountBookmarks(ctx context.Context, userID string) (int, error) {
	var count int
	err := s.db.QueryRow(ctx, `SELECT COUNT(*) FROM bookmarks WHERE user_id=$1`, userID).Scan(&count)
	return count, err
}

func (s *Store) CreateBookmark(ctx context.Context, b *model.Bookmark) error {
	return s.db.QueryRow(ctx,
		`INSERT INTO bookmarks (user_id, year, label, note) VALUES ($1,$2,$3,$4) RETURNING id, created_at`,
		b.UserID, b.Year, b.Label, b.Note,
	).Scan(&b.ID, &b.CreatedAt)
}

func (s *Store) UpdateBookmarkNote(ctx context.Context, id int, userID string, note string) error {
	_, err := s.db.Exec(ctx,
		`UPDATE bookmarks SET note=$1 WHERE id=$2 AND user_id=$3`, note, id, userID)
	return err
}

func (s *Store) DeleteBookmark(ctx context.Context, id int, userID string) error {
	_, err := s.db.Exec(ctx,
		`DELETE FROM bookmarks WHERE id=$1 AND user_id=$2`, id, userID)
	return err
}
