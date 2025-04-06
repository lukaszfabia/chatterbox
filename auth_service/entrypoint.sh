#!/bin/sh
alembic revision --autogenerate -m "migration: user"
alembic upgrade head

exec uvicorn app.main:app --host 0.0.0.0 --port 8001