# Movie Watchlist Test Gallery

Screenshots from Postman and the terminal proving each route and test works. The API runs at `http://localhost:3001`.

## 1. Listing all items

`GET /movies` (no token needed) returns **200 OK** with every movie.

![Listing all items](test_gallery_img/list-movies.png)

## 2. Getting one item

`GET /movies/1` returns **200 OK** with the one movie.

![Getting one item](test_gallery_img/list-one-movie.png)

## 3. Creating an item

`POST /movies` with a token and body `{ "title": "Inception", "genre": "Sci-Fi" }` returns **201 Created** with the new movie (`watched` is `false`).

![Creating an item](test_gallery_img/create-movie.png)

**Validation error:** the same request with an empty title, `{ "title": "", "genre": "Sci-Fi" }`, returns **400 Bad Request** with `"title should not be empty"`.

![Creating an item with an empty title](test_gallery_img/create-empty-movie.png)

## 4. Updating an item

`PATCH /movies/1` with a token and body `{ "watched": true }` returns **200 OK** with `watched` now `true`.

![Updating an item](test_gallery_img/update.png)

## 5. Deleting an item

`DELETE /movies/2` with a token returns **200 OK** with `{ "message": "Movie deleted" }`.

![Deleting an item](test_gallery_img/delete.png)

## 6. 404 for a missing item

`GET /movies/99` returns **404 Not Found** with `"Movie with id 99 not found"`.

![404 for a missing item](test_gallery_img/get-error.png)

## 7. 401 without a token, success with one

`POST /movies` with **no token** returns **401 Unauthorized** with `"Missing token"`.

![401 without a token](test_gallery_img/create-without-token.png)

The same request **with** a Bearer token returns **201 Created**.

![Same request with a token](test_gallery_img/create-with-token.png)

## 8. Tests passing

**Unit tests:** `npm run test` runs 1 file and 8 tests, all passing.

![Unit tests passing](test_gallery_img/image-test.png)

**E2E tests:** `npm run test:e2e` runs 1 file and 9 tests, all passing.

![E2E tests passing](test_gallery_img/test-e2e.png)
