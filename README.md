# Golfaro

Golfaro est un SaaS multi-tenant de gestion des opérations quotidiennes d'un club de golf. Le premier objectif produit couvre les employés, les clients, les parcours, les départs et les réservations.

Ce dépôt contient uniquement les fondations techniques. Les modules métier seront ajoutés progressivement par tranches verticales testées.

## Stack

- Frontend : Next.js, React, TypeScript et Tailwind CSS
- Backend : FastAPI, Pydantic, SQLAlchemy 2 et Alembic
- Base de données : PostgreSQL 16
- Exécution : Docker Compose
- Production : VPS Linux, Nginx et Certbot

## Structure

```text
Golfaro/
├── backend/
│   ├── app/
│   │   ├── api/          # Assemblage des routes versionnées
│   │   ├── core/         # Configuration et accès à la base
│   │   └── modules/      # Domaines métier indépendants
│   ├── migrations/       # Migrations Alembic
│   └── tests/
├── frontend/
│   ├── public/
│   └── src/
│       ├── app/          # Routes Next.js App Router
│       ├── components/   # Composants partagés
│       ├── features/     # Fonctionnalités métier
│       ├── lib/          # Configuration et utilitaires
│       ├── services/     # Accès à l'API
│       └── types/        # Types partagés côté frontend
├── docker-compose.yml
├── .env.example
└── deploy.md
```

## Démarrage avec Docker

Prérequis : Docker Engine et Docker Compose.

```bash
cp .env.example .env
docker compose config
docker compose up -d --build
docker compose ps
```

Adapte les secrets et les URLs du fichier `.env` avant tout déploiement. En local, les services sont disponibles sur :

- frontend : `http://127.0.0.1:8088`
- API : `http://127.0.0.1:3008/api/v1/health`
- documentation API : `http://127.0.0.1:3008/api/docs`

Les ports PostgreSQL ne sont jamais publiés sur l'hôte.

## Développement sans Docker

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

Sous PowerShell, active l'environnement avec `.venv\Scripts\Activate.ps1`.

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

Le frontend de développement écoute sur `http://localhost:3000`. L'API écoute sur `http://localhost:8000`.

## Qualité et tests

```bash
cd backend
ruff check .
pytest

cd ../frontend
npm run lint
npm run typecheck
npm run build
```

## Migrations

Créer une migration après l'ajout ou la modification de modèles :

```bash
docker compose run --rm backend alembic revision --autogenerate -m "description"
```

Appliquer les migrations :

```bash
docker compose run --rm backend alembic upgrade head
```

La procédure VPS complète se trouve dans [deploy.md](deploy.md).

