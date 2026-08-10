# Déploiement de Golfaro sur le VPS

Cette procédure cible un VPS Linux avec Docker, Docker Compose, Nginx et Certbot déjà installés. L'exemple utilise `golfaro.bouchard-mehdi.fr`, le port frontend `8088` et le port backend `3008`.

## 1. DNS

Créer chez Hostinger un enregistrement :

```text
Type : A
Nom : golfaro
Valeur : <IP_DU_VPS>
```

Attendre que le nom résolve vers le VPS avant de demander le certificat.

## 2. Installation du projet

```bash
cd /home/projects
git clone <URL_DU_DEPOT> golfaro
cd golfaro
git checkout <TAG_OU_COMMIT_A_DEPLOYER>
cp .env.example .env
chmod 600 .env
```

Modifier `.env` et remplacer tous les secrets et domaines d'exemple.

Valider la configuration finale sans démarrer les conteneurs :

```bash
docker compose config --quiet
```

## 3. Premier démarrage

```bash
docker compose build
docker compose up -d db
docker compose run --rm backend alembic upgrade head
docker compose up -d
docker compose ps
docker compose logs --tail=100
```

Vérifier localement depuis le VPS :

```bash
curl --fail http://127.0.0.1:3008/api/v1/health
curl --fail http://127.0.0.1:8088/health
```

## 4. Reverse proxy Nginx

Créer `/etc/nginx/sites-available/golfaro` :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name golfaro.bouchard-mehdi.fr;

    location /api/ {
        proxy_pass http://127.0.0.1:3008;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_redirect off;
    }

    location / {
        proxy_pass http://127.0.0.1:8088;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_redirect off;
    }
}
```

Activer et vérifier la configuration :

```bash
sudo ln -s /etc/nginx/sites-available/golfaro /etc/nginx/sites-enabled/golfaro
sudo nginx -t
sudo systemctl reload nginx
```

## 5. HTTPS

```bash
sudo certbot --nginx -d golfaro.bouchard-mehdi.fr --redirect
sudo certbot renew --dry-run
```

## 6. Mise à jour

Avant une migration, créer une sauvegarde PostgreSQL stockée hors du dépôt et copiée hors du VPS.

```bash
cd /home/projects/golfaro
git fetch --prune
git checkout <NOUVEAU_TAG_OU_COMMIT>
docker compose build
docker compose run --rm backend alembic upgrade head
docker compose up -d
docker compose ps
curl --fail https://golfaro.bouchard-mehdi.fr/api/v1/health
docker compose logs --tail=100
```

Ne pas utiliser `docker compose down --volumes` en production : cette commande supprime le volume PostgreSQL.

## 7. Sauvegarde minimale PostgreSQL

Exemple de sauvegarde manuelle avant déploiement :

```bash
mkdir -p /home/backups/golfaro
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > /home/backups/golfaro/golfaro.dump
```

La sauvegarde doit ensuite être chiffrée, copiée sur un stockage externe et testée avec une restauration.

## 8. Retour arrière

1. Revenir à l'image ou au commit applicatif précédent.
2. Relancer `docker compose up -d --build`.
3. Ne pas exécuter automatiquement de migration descendante.
4. Si la migration n'est pas rétrocompatible, restaurer la sauvegarde réalisée avant le déploiement.
