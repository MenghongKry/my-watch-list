# Movie Watchlist API

**Theme:** a personal movie watchlist. It is a NestJS + PostgreSQL backend that keeps track of movies I want to watch: add a movie, see the whole list, look up one movie, mark it as watched, and remove it. Anyone can read the list, but adding, changing and deleting movies need a JWT (register at `/auth/register`, then log in at `/auth/login` to get a token).

## Data fields (`Movie` entity, table `movies`)

| Field     | Type    | Rules |
|-----------|---------|-------|
| `id`      | number  | Auto-generated primary key |
| `title`   | string  | Required, cannot be empty |
| `genre`   | string  | Required, cannot be empty |
| `watched` | boolean | The true/false status. Defaults to `false` |

## Routes

The assignment calls the resource `/items`. For this theme it is named `/movies`; the five routes are the same.

| Action                 | Method | URL              | Token needed? |
|------------------------|--------|------------------|---------------|
| List all movies        | GET    | `/movies`        | No  |
| Get one movie          | GET    | `/movies/:id`    | No  |
| Add a movie            | POST   | `/movies`        | Yes |
| Update a movie         | PATCH  | `/movies/:id`    | Yes |
| Delete a movie         | DELETE | `/movies/:id`    | Yes |
| Register a user        | POST   | `/auth/register` | No  |
| Log in (returns token) | POST   | `/auth/login`    | No  |

A missing movie returns **404**, an empty or missing `title`/`genre` returns **400**, and a write without a valid token returns **401**.

Bonus: every request is timed by a logging interceptor (`POST /movies 201 - 8ms`), and a `movie.created` event fires when a movie is added.

## Run it

```bash
npm install
cp .env.example .env              # fill in your DB password and JWT_SECRET
cp .env .env.test                 # then change DB_NAME to watchlist_test
npm run migration:run             # creates the movies and users tables
npm run start:dev                 # http://localhost:3001

npm run test                      # unit tests
npm run migration:run:test        # once, to create the tables in watchlist_test
npm run test:e2e                  # e2e tests (empties and uses watchlist_test)

docker compose up --build         # API + Postgres in Docker, http://localhost:3001
```
