# Our Little Oven

A small, warm place on the internet where we keep our loaves.

Some are still just recipes — things we said we'd do someday and wrote down before we
forgot. Some are proofing, sitting on the counter with a date attached. One might be in
the oven right now. And the rest have cooled, and live on the rack where we can go back
and look at them whenever we want.

It's a memory box that smells like bread.

## Run it

Needs Docker and Python 3.12.

```bash
docker compose up -d postgres
pip install -r backend/requirements.txt
cd backend
alembic upgrade head
uvicorn app.main:app --reload
```

Then open http://localhost:8000.

There's no sign-up. Make an account from `backend/` (it asks for the password):

```bash
python -m app.cli add-user axcel --role admin
```

Tests: `pytest` from `backend/`. They need Postgres running and use their own
`oven_test` database.

## Docs

Everything else lives in the [wiki](https://github.com/AxcelT/Our-Little-Oven/wiki).
