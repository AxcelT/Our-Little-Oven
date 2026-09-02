# Our Little Oven

A small, warm place on the internet where we keep our loaves.

Some are still just recipes — things we said we'd do someday and wrote down before we
forgot. Some are proofing, sitting on the counter with a date attached. One might be in
the oven right now. And the rest have cooled, and live on the rack where we can go back
and look at them whenever we want.

It's a memory box that smells like bread.

## Rules of the kitchen

- Nothing gets thrown out.
- Every loaf is worth keeping, even the ones that came out a little flat.
- Two bakers. That's the whole staff.

## Layout

```
backend/
  app/            FastAPI app, config, models
  alembic/        migrations
docker-compose.yml  postgres + minio for local dev
frontend/
  index.html      login page
  dashboard.html  the rack (placeholder)
  css/style.css   styles
  js/sprites.js   pixel-art sprites (oven, bread, bakers)
  js/login.js     login form logic
docs/             notes (the real docs live in the GitHub Wiki)
```

Open `frontend/index.html` in a browser. No build step.

Backend:

```bash
docker compose up -d
pip install -r backend/requirements.txt
cd backend && alembic upgrade head && uvicorn app.main:app --reload
```

## Status

Preheating. 🥖
