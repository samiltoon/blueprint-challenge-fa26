# LibraryConnect Resource Hub

## Welcome to the Fall 2026 Coding Challenge!

To complete the challenge, please fork this repository, create a branch for your changes, and open a pull request against `main` when you're ready to submit your challenge. Please label your pull request with your name, such as `[Your Name] - Short description of your changes`.  

Details below, and good luck!

## Background

LibraryConnect is a public library system that helps patrons discover books and manages the lending process across its branches.

Currently, staff track the catalog and checkouts using spreadsheets, email, and paper forms. This process is inefficient and makes it difficult to:

- Keep catalog information up to date
- Quickly search for relevant books
- Track which patrons checked out which books
- Understand usage and demand across the collection

LibraryConnect has asked Blueprint to design and build a simple internal web application that centralizes catalog information and checkout tracking in one place.

The goal is to create a lightweight tool that staff can use daily to manage the book catalog and record checkouts.

---

## Product Goal

Build a full-stack web application that allows library staff to:

- Manage the book catalog
- Search and filter available books
- Record and view checkouts made to patrons

The application should include:

- React frontend
- FastAPI backend
- PostgreSQL database

---

## Feature — Book Management

### Context

LibraryConnect maintains a catalog of books across its branches. Staff frequently need to add new books, update existing ones, and browse the catalog when assisting patrons.

The system should allow staff to store structured information about each book and view it later.

### Requirements

The system must allow staff to:

- Create a new book
- View a list of all books
- View details of a single book

Each book must include:

| Field | Type |
|---|---|
| Title | string |
| Genre | enum (`Fiction`, `Non-Fiction`, `Children`, `Reference`, `Periodical`, `Other`) |
| Description | text |
| Author | string |
| Publisher email | email |
| Shelf location / call number | string |

---

## Feature — Search and Filtering

### Context

When working with patrons, staff often need to quickly find relevant books (for example: children's books or reference material). Searching manually through spreadsheets is slow and error-prone.

The system should support quick discovery of books through search and genre filtering.

### Requirements

The system must allow staff to:

- Search books by title
- Filter books by genre

Search and filters should apply to the book list view.

---

## Feature — Checkout Tracking

### Context

When a patron borrows a book, staff record a checkout. Tracking checkouts helps LibraryConnect understand which books are most popular and ensures follow-up on overdue returns.

Currently, checkouts are tracked in notes or emails and are difficult to track historically.

The system should allow staff to record checkouts linked to specific books.

### Requirements

The system must allow staff to:

- Create a checkout for a book
- View checkouts associated with a book

Each checkout must include:

| Field | Type |
|---|---|
| Patron name | string |
| Book | foreign key → Book |
| Date | date |
| Notes | text |

---

## Frontend Requirements

### Context

LibraryConnect staff are not technical users. The interface should be simple, clear, and easy to navigate so staff can quickly access catalog information and record checkouts during patron interactions.

### Requirements

The frontend must include:

- Book list page
- Book creation form
- Book detail page
- Checkout creation form

The frontend must:

- Communicate with the FastAPI backend via API calls
- Display data from the database
- Submit forms to create books and checkouts

---

## Backend Requirements

### Context

The backend will serve as the system of record for books and checkouts. It must expose a clean API that the frontend can use and ensure data validation and persistence.

### Requirements

The backend must:

- Provide REST API endpoints for books and checkouts
- Validate request data
- Store and retrieve data from PostgreSQL

### Expected Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/books` | Create a new book |
| `GET` | `/books` | List all books (supports search & genre filter) |
| `GET` | `/books/{id}` | Get details of a single book |
| `POST` | `/checkouts` | Create a checkout |
| `GET` | `/books/{id}/checkouts` | List checkouts for a book |

---

## Starter Implementation Included

This repository now includes a starter full-stack implementation with:

- `frontend/` React + Vite UI for book list/search/filter, book creation, book detail, and checkout creation
- `backend/` FastAPI REST API with PostgreSQL persistence for books and checkouts
- `docker-compose.yml` PostgreSQL + backend + frontend services

### Run with Docker

From the repository root:

```bash
docker compose up --build
```

Then open:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Smoke Tests with curl

After `docker compose up --build` is running in another terminal:

```bash
./scripts/smoke-test.sh
```

What it verifies:

- `GET http://localhost:8000/` returns a backend health payload
- `GET http://localhost:8000/docs` is reachable
- `GET http://localhost:5173` serves HTML from the frontend

### Backend Tests (pytest)

From the repository root, install backend test dependencies:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

```bash
python3 -m pip install -r requirements.txt
```

Run all backend tests:

```bash
cd ..
python3 -m pytest -q backend/tests
```

### Frontend Tests (Jest)

From the repository root, install frontend dependencies:

```bash
cd frontend
npm ci
```

Run all frontend tests:

```bash
npm test -- --runInBand
```

### Automated pass/fail grading

GitHub Actions runs **Challenge tests** automatically whenever you push changes
or update your pull request. Grading is skipped while executable starter TODOs
remain. Once you implement them, your next push runs the backend tests on
Python 3.12 and frontend tests on Node.js 22. TODO comments alone do not prevent
grading, and the automated tests do not require running servers or Docker.

Check **Grade** on your latest commit:

- **PASS**: both Backend tests and Frontend tests passed.
- **NOT GRADED / skipped**: starter TODOs remain. This is not a pass,
  even if GitHub displays the overall workflow as green.
- **FAIL**: a test or setup step failed. Open the failed job's log, fix the
  reported issue, and push your changes to run the checks again.

Keep the supplied tests and workflow unchanged. The frontend tests rely on the
provided API exports, component props, section headings, labels, and catalog
rows, so preserve those interfaces as you complete the challenge. You can use
client-side or API filtering and update local state or refetch after creation.

### Stop Services

```bash
docker compose down
```

---

## Implementation notes

- All five required endpoints persist data through SQLAlchemy. The API creates
  tables on startup and uses the PostgreSQL connection supplied by Docker Compose.
- The interface loads the catalog once and filters it locally by title and genre.
  The API also supports `GET /books?q=...&genre=...` for other clients.
- Creating a book updates the catalog immediately. Selecting a book loads its
  details and checkout history. The checkout selector always contains the full
  catalog, even when the visible book list is filtered.
- Forms show validation errors and save confirmations, and disable submission
  while a save is in progress. Failed submissions retain the entered fields.
- Book IDs that do not exist return 404. Invalid request fields return 422.
  Empty searches return an empty list, not an error. Text searches are
  case-insensitive, and SQL wildcard characters are treated literally.
- Checkouts are historical records. Returns, due dates, copy availability,
  authentication, and editing/deletion are outside this challenge's scope.

### Review checklist

1. Start the app with `docker compose up --build` and open http://localhost:5173.
2. Create two books with different genres. Confirm all fields in each detail view.
3. Search by part of a title, combine it with a genre, and test a search with no matches.
4. Select a book and record a checkout. Confirm the patron, date, and notes appear
   only in that book's history. Record another checkout without losing the first.
5. Refresh the browser and confirm the saved books and history are still present.
6. Try an invalid publisher email and an empty title; confirm the submission is rejected.
7. Check the latest GitHub Actions **Grade** result after pushing. Skipped is not PASS.

### Development without Docker

With PostgreSQL running and an empty `libraryconnect` database created, install
`backend/requirements.txt`, set `DATABASE_URL` to your PostgreSQL connection URL,
and run `python -m uvicorn backend.app:app --reload --port 8000` from the root.
In a second terminal, run `npm ci` and `npm run dev` inside `frontend/`.
The supplied SQLite fallback is convenient for unit tests, but the required app
should run with PostgreSQL. Keep local credentials out of commits.

### Implementation-session verification

- Supplied backend tests: 12 passed.
- Supplied frontend tests: 20 passed.
- TypeScript compilation and ESLint passed.
- Production frontend bundle built successfully. The Codex Windows sandbox
  required Vite's `--configLoader native` option because esbuild could not scan
  an ancestor directory; the project's normal build command is unchanged.
- Additional checks ran against PostgreSQL 16: saved records, combined filters,
  literal wildcard searches, invalid fields, missing books, checkout history,
  and persistence across application lifespans.
- Browser verification created a book and checkout and confirmed both after reload.
- Docker Compose itself has not been run in this environment (Docker is not installed).
