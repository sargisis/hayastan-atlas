package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"hayastan-atlas/backend/internal/handler"
	"hayastan-atlas/backend/internal/store"
)

func main() {
	_ = godotenv.Load()

	if os.Getenv("JWT_SECRET") == "" {
		log.Fatal("JWT_SECRET must be set")
	}

	pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("cannot connect to database: %v", err)
	}
	defer pool.Close()

	s := store.New(pool)
	h := handler.New(s)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{os.Getenv("FRONTEND_URL")},
		AllowedMethods: []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	// Public
	r.Get("/api/eras", h.ListEras)
	r.Get("/api/eras/{id}/territory", h.GetTerritory)
	r.Get("/api/territory", h.TerritoryByYear) // ?year=N
	r.Get("/api/cities", h.CitiesByYear)       // ?year=N
	r.Get("/api/kings", h.ListKings)
	r.Get("/api/kings/{id}", h.GetKing)
	r.Get("/api/events", h.ListEvents) // ?year=500
	r.Get("/api/timeline", h.GetTimeline)

	// Auth
	r.Get("/auth/google", h.GoogleLogin)
	r.Get("/auth/google/callback", h.GoogleCallback)
	r.Post("/auth/logout", h.Logout)

	// Authenticated
	r.Group(func(r chi.Router) {
		r.Use(h.RequireAuth)
		r.Get("/api/me", h.GetMe)
		r.Get("/api/bookmarks", h.ListBookmarks)
		r.Post("/api/bookmarks", h.CreateBookmark)
		r.Delete("/api/bookmarks/{id}", h.DeleteBookmark)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("server listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
