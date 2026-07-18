package handler

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"os"
	"strconv"

	"github.com/go-chi/chi/v5"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"

	"hayastan-atlas/backend/internal/model"
	"hayastan-atlas/backend/internal/store"
)

type Handler struct {
	store       *store.Store
	oauthConfig *oauth2.Config
	jwtSecret   []byte
}

func New(s *store.Store) *Handler {
	cfg := &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes:       []string{"openid", "email", "profile"},
		Endpoint:     google.Endpoint,
	}
	return &Handler{
		store:       s,
		oauthConfig: cfg,
		jwtSecret:   []byte(os.Getenv("JWT_SECRET")),
	}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeErr(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

// --- Public handlers ---

func (h *Handler) ListEras(w http.ResponseWriter, r *http.Request) {
	eras, err := h.store.ListEras(r.Context())
	if err != nil {
		writeErr(w, 500, "internal error")
		return
	}
	writeJSON(w, 200, eras)
}

func (h *Handler) GetTerritory(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		writeErr(w, 400, "invalid id")
		return
	}
	t, err := h.store.GetTerritory(r.Context(), id)
	if err != nil {
		writeErr(w, 404, "not found")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	_, _ = w.Write(t.GeoJSON)
}

// TerritoryByYear returns the territory phase for ?year=N as {phase, label, fc}.
func (h *Handler) TerritoryByYear(w http.ResponseWriter, r *http.Request) {
	year, err := strconv.Atoi(r.URL.Query().Get("year"))
	if err != nil {
		writeErr(w, 400, "invalid year")
		return
	}
	t, err := h.store.GetTerritoryForYear(r.Context(), year)
	if err != nil {
		writeErr(w, 404, "no territory for year")
		return
	}
	writeJSON(w, 200, map[string]any{
		"phase": t.ID,
		"label": t.Label,
		"fc":    json.RawMessage(t.GeoJSON),
	})
}

// CitiesByYear returns cities existing at ?year=N.
func (h *Handler) CitiesByYear(w http.ResponseWriter, r *http.Request) {
	year, err := strconv.Atoi(r.URL.Query().Get("year"))
	if err != nil {
		writeErr(w, 400, "invalid year")
		return
	}
	cities, err := h.store.ListCitiesForYear(r.Context(), year)
	if err != nil {
		writeErr(w, 500, "internal error")
		return
	}
	writeJSON(w, 200, cities)
}

func (h *Handler) ListKings(w http.ResponseWriter, r *http.Request) {
	kings, err := h.store.ListKings(r.Context())
	if err != nil {
		writeErr(w, 500, "internal error")
		return
	}
	writeJSON(w, 200, kings)
}

func (h *Handler) GetKing(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		writeErr(w, 400, "invalid id")
		return
	}
	k, err := h.store.GetKing(r.Context(), id)
	if err != nil {
		writeErr(w, 404, "not found")
		return
	}
	writeJSON(w, 200, k)
}

func (h *Handler) ListEvents(w http.ResponseWriter, r *http.Request) {
	yearStr := r.URL.Query().Get("year")
	year := 2000
	if yearStr != "" {
		if y, err := strconv.Atoi(yearStr); err == nil {
			year = y
		}
	}
	events, err := h.store.ListEventsByYear(r.Context(), year)
	if err != nil {
		writeErr(w, 500, "internal error")
		return
	}
	writeJSON(w, 200, events)
}

// GetTimeline returns the era active at ?year=N plus events at that year.
func (h *Handler) GetTimeline(w http.ResponseWriter, r *http.Request) {
	year := 0
	if y, err := strconv.Atoi(r.URL.Query().Get("year")); err == nil {
		year = y
	}
	era, err := h.store.GetEraForYear(r.Context(), year)
	if err != nil {
		writeErr(w, 404, "no era found for year")
		return
	}
	events, _ := h.store.ListEventsByYear(r.Context(), year)
	writeJSON(w, 200, map[string]any{
		"era":    era,
		"events": events,
	})
}

// --- Auth handlers ---

const oauthStateCookie = "oauth_state"

func (h *Handler) GoogleLogin(w http.ResponseWriter, r *http.Request) {
	b := make([]byte, 16)
	rand.Read(b)
	state := hex.EncodeToString(b)
	http.SetCookie(w, &http.Cookie{
		Name:     oauthStateCookie,
		Value:    state,
		Path:     "/",
		MaxAge:   300,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   os.Getenv("APP_ENV") != "development",
	})
	http.Redirect(w, r, h.oauthConfig.AuthCodeURL(state), http.StatusTemporaryRedirect)
}

func (h *Handler) GoogleCallback(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(oauthStateCookie)
	if err != nil || cookie.Value != r.URL.Query().Get("state") {
		writeErr(w, 400, "invalid oauth state")
		return
	}

	token, err := h.oauthConfig.Exchange(r.Context(), r.URL.Query().Get("code"))
	if err != nil {
		writeErr(w, 500, "token exchange failed")
		return
	}

	userInfo, err := fetchGoogleUser(r.Context(), h.oauthConfig, token)
	if err != nil {
		writeErr(w, 500, "failed to fetch user info")
		return
	}

	sub, ok1 := userInfo["sub"].(string)
	email, ok2 := userInfo["email"].(string)
	name, ok3 := userInfo["name"].(string)
	if !ok1 || sub == "" || !ok2 || !ok3 {
		writeErr(w, 502, "incomplete user info from Google")
		return
	}
	u := &model.User{
		GoogleID: sub,
		Email:    email,
		Name:     name,
	}
	if pic, ok := userInfo["picture"].(string); ok {
		u.AvatarURL = &pic
	}
	if err := h.store.UpsertUser(r.Context(), u); err != nil {
		writeErr(w, 500, "db error")
		return
	}

	jwtToken, err := signJWT(u.ID, h.jwtSecret)
	if err != nil {
		writeErr(w, 500, "jwt error")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session",
		Value:    jwtToken,
		Path:     "/",
		MaxAge:   60 * 60 * 24 * 7, // 7 days
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   os.Getenv("APP_ENV") != "development",
	})
	http.Redirect(w, r, os.Getenv("FRONTEND_URL"), http.StatusTemporaryRedirect)
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:   "session",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	})
	writeJSON(w, 200, map[string]string{"ok": "logged out"})
}

// --- Authenticated handlers ---

func (h *Handler) GetMe(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r.Context())
	u, err := h.store.GetUserByID(r.Context(), userID)
	if err != nil {
		writeErr(w, 404, "user not found")
		return
	}
	writeJSON(w, 200, u)
}

func (h *Handler) ListBookmarks(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r.Context())
	bs, err := h.store.ListBookmarks(r.Context(), userID)
	if err != nil {
		writeErr(w, 500, "internal error")
		return
	}
	writeJSON(w, 200, bs)
}

func (h *Handler) CreateBookmark(w http.ResponseWriter, r *http.Request) {
	var b model.Bookmark
	if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
		writeErr(w, 400, "invalid body")
		return
	}
	b.UserID = userIDFromCtx(r.Context())
	if b.Year < -3000 || b.Year > 2100 {
		writeErr(w, 400, "year out of range")
		return
	}
	if len(b.Label) > 200 {
		writeErr(w, 400, "label too long")
		return
	}
	if err := h.store.CreateBookmark(r.Context(), &b); err != nil {
		writeErr(w, 500, "internal error")
		return
	}
	writeJSON(w, 201, b)
}

func (h *Handler) DeleteBookmark(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		writeErr(w, 400, "invalid id")
		return
	}
	userID := userIDFromCtx(r.Context())
	if err := h.store.DeleteBookmark(r.Context(), id, userID); err != nil {
		writeErr(w, 500, "internal error")
		return
	}
	w.WriteHeader(204)
}

// --- Auth middleware ---

type ctxKey string

const ctxUserID ctxKey = "user_id"

func (h *Handler) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session")
		if err != nil {
			writeErr(w, 401, "unauthorized")
			return
		}
		userID, err := verifyJWT(cookie.Value, h.jwtSecret)
		if err != nil {
			writeErr(w, 401, "invalid session")
			return
		}
		ctx := context.WithValue(r.Context(), ctxUserID, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func userIDFromCtx(ctx context.Context) string {
	v, _ := ctx.Value(ctxUserID).(string)
	return v
}
