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

Tests: `pytest` from `backend/`.

## Docs

Everything else lives in the [wiki](https://github.com/AxcelT/Our-Little-Oven/wiki).
