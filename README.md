# Personal Bookshelf

A small web app for tracking a personal reading list. Built with FastAPI + SQLModel on the backend and React + Vite on the frontend.

## How to run

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books` | Get all books, optional `?status=` filter |
| POST | `/books` | Add a new book |
| PATCH | `/books/{id}` | Update reading status |
| DELETE | `/books/{id}` | Remove a book |

## Technical decisions

**FastAPI + SQLModel**

I went with FastAPI mainly because of the built-in Pydantic validation and the auto-generated `/docs`, useful for testing endpoints without setting up a separate client. SQLModel made sense on top of that because one class handles both the DB model and the schema, so I'm not writing the same fields twice like you'd have to with plain SQLAlchemy.

**SQLite**

This is a single-user local app, so SQLite is the obvious call because of no setup, no running process, just a file. If this were going public with multiple users, I'd chosoe PostgreSQL, a proper connection pool, and realistically some caching layer like Redis for frequently read data. And Redis brings its own set of problems like cache invalidation, stale reads, cache-aside vs write-through strategy, potential deadlocks if multiple users are updating the same book state. For this scope it would be overkill, but it's worth knowing where the limits are.

**React + Vite**

I originally started with HTMX, which is a solid choice when the server returns HTML fragments. The issue was that our backend returns JSON, which meant fighting against the grain of how HTMX(I also didn't have much exp in HTMX, wanted to experiment with it :/) is designed to work. Switching to React made more sense (more experience), the component model maps naturally to a JSON API, and I have more experience with it so the implementation is cleaner. Vite keeps the dev setup minimal(and also React on itself is deprecated).

**REST conventions**

I followed standard REST structure  nouns in URLs, HTTP verbs for actions. 
One thing I had to look up was PUT vs PATCH went with PATCH since we're only 
updating a single field (status), not replacing the whole resource. Error codes 
I had to reference as well, but the logic behind them (404 when resource doesn't 
exist, 422 when validation fails) made sense once I looked it up.

**Input validation**

Two layers: `Field(min_length=1)` on `BookCreate` rejects empty strings at the API level, not just in the browser. `BookStatusUpdate` uses `Literal` to lock down the three valid status values. if the input is invalid returns a `422` automatically without any manual checking in the handler.

## What I'd do with more time

**Duplicate detection** : right now it's exact match on title + author. Case-insensitive matching would be a quick win.

**Notes field** : the model has it, the UI doesn't. I'd add an expandable section per book to actually expose it(Even though notes were not required in the assignement, I just thought that it'd be a great fit to have it in our model).

**Sorting** : currently insertion order only. Sorting by title, author or status would be straightforward to add via a `?sort_by=` query param.

**Persistent filter state** : the active filter resets on refresh. Either `localStorage` or putting the state in the URL (`?status=reading`) would fix that.

**Tests** : the backend has none. I'd add `pytest` with an in-memory SQLite database so the tests don't touch the real db.

*Note*  
Initial architecture sketch is attached (starting_point.png), roughly 2,5 hours of implementation total.