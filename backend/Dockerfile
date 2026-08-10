FROM python:3.13-slim AS builder

ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /build

COPY pyproject.toml ./
COPY app ./app
RUN python -m pip install --prefix=/install .

FROM python:3.13-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN addgroup --system golfaro \
    && adduser --system --ingroup golfaro --home /app golfaro

COPY --from=builder /install /usr/local
COPY --chown=golfaro:golfaro alembic.ini ./
COPY --chown=golfaro:golfaro migrations ./migrations
COPY --chown=golfaro:golfaro app ./app

USER golfaro

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--proxy-headers", "--forwarded-allow-ips", "*"]

