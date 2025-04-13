#!/bin/sh

mkdir -p alembic/versions

if [ "$AUTO_MIGRATE" = "1" ]; then
    alembic revision --autogenerate -m "auto migration"
fi

alembic upgrade head

exec uvicorn app.main:app --host 0.0.0.0 --port 8001
