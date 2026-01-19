# 🚀 DEPLOY.md — Déploiement cPanel Git

> Guide de déploiement Laravel + React sur hébergement cPanel via Git

---

## 📋 Prérequis

- cPanel avec **Git Version Control** activé
- PHP 8.2+ / Node.js 20+ (pour build local)
- Accès SSH recommandé

---

## 🔧 Architecture de déploiement

```
/home/user/
├── repositories/
│   └── tableaudebord.git/    ← Dépôt bare (cPanel)
│
└── public_html/
    └── app.domaine.com/     ← Dossier web public
        ├── public/          ← Document Root
        └── ...              ← Code Laravel
```

---

## ⚙️ Configuration cPanel

### 1. Créer le dépôt

1. cPanel → **Git Version Control** → Create
2. **Clone URL** : `git@github.com:user/tableaudebord.git`
3. **Repository Path** : `/home/user/repositories/tableaudebord`
4. **Deploy Branch** : `main`

### 2. Configurer le Document Root

1. cPanel → **Domains** ou **Subdomains**
2. Document Root : `/home/user/public_html/app.domaine.com/public`

> ⚠️ **Important** : Le Document Root pointe vers `/public`, pas la racine du projet !

---

## 📤 Workflow Push/Pull

### Option A : Pull Deployment (recommandé)

```bash
# Sur machine locale
git push origin main

# cPanel tire automatiquement via .cpanel.yml
# OU manuellement : cPanel → Git Version Control → Pull
```

### Option B : Push Deployment (SSH)

```bash
# Ajouter remote cPanel
git remote add cpanel ssh://user@domaine.com/home/user/repositories/tableaudebord.git

# Déployer
git push cpanel main
```

---

## 📦 Gestion des Assets (Vite)

### ⚠️ BUILD LOCAL OBLIGATOIRE

cPanel **n'exécute pas** `npm run build`. Deux options :

#### Option 1 : Commit des assets buildés

```bash
# Localement AVANT push
npm run build

# Ajouter les assets au git (temporairement)
git add -f public/build/
git commit -m "build: production assets"
git push origin main

# Après déploiement, retirer du tracking
git rm -r --cached public/build/
```

#### Option 2 : Build via CI (GitHub Actions)

Utiliser la CI pour builder et déployer via FTP/SSH :

```yaml
# Ajouter à .github/workflows/ci.yml
deploy:
  needs: [test, build]
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: npm ci && npm run build
    - uses: SamKirkland/FTP-Deploy-Action@v4
      with:
        server: ftp.domaine.com
        username: ${{ secrets.FTP_USER }}
        password: ${{ secrets.FTP_PASS }}
        local-dir: ./public/build/
        server-dir: /public_html/app/public/build/
```

---

## 🔐 Gestion de .env

### ❌ JAMAIS dans Git

```bash
# .gitignore (déjà présent)
.env
.env.backup
.env.production
```

### ✅ Créer manuellement sur serveur

```bash
# Via SSH ou File Manager cPanel
cp .env.example .env

# Éditer avec les valeurs production
nano .env
```

### Variables critiques

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://app.domaine.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=user_tableaudebord
DB_USERNAME=user_dbuser
DB_PASSWORD=MotDePasseSecurisé

# Générer une nouvelle clé !
# php artisan key:generate
```

---

## ⚡ .cpanel.yml

Le fichier `.cpanel.yml` à la racine déclenche des actions post-pull :

```yaml
# Voir fichier .cpanel.yml dans le projet
```

### Actions supportées

| Action | Description |
|--------|-------------|
| `cp` | Copier fichiers |
| `rm` | Supprimer fichiers |
| `mkdir` | Créer dossier |
| `/usr/local/bin/php` | Exécuter PHP |

### Limites

- ❌ Pas de `npm` / `node`
- ❌ Pas de wildcards (`*`) sécurisées
- ❌ Timeout ~300 secondes

---

## ⚠️ Risques et Précautions

### 🚨 Ne JAMAIS exposer

| Élément | Risque | Solution |
|---------|--------|----------|
| `.git/` | Fuite code source | Document Root = `/public` |
| `.env` | Fuite credentials | Jamais versionné |
| `storage/` | Logs sensibles | Hors Document Root |
| `vendor/` | Code tiers | Hors Document Root |

### Vérification post-déploiement

```bash
# Ces URLs doivent retourner 403/404
curl https://app.domaine.com/.git/config
curl https://app.domaine.com/.env
curl https://app.domaine.com/storage/logs/laravel.log
```

### Permissions recommandées

```bash
# Via SSH
chmod -R 755 .
chmod -R 775 storage bootstrap/cache
chown -R user:user .
```

---

## 📋 Checklist Déploiement

```
[ ] .env créé avec APP_DEBUG=false
[ ] php artisan key:generate
[ ] php artisan migrate --force
[ ] php artisan config:cache
[ ] php artisan route:cache
[ ] php artisan view:cache
[ ] Assets Vite buildés et uploadés
[ ] Document Root = /public
[ ] .git non accessible publiquement
[ ] HTTPS activé
```

---

## 🔄 Commandes post-déploiement

```bash
# Via SSH ou dans .cpanel.yml
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
```
