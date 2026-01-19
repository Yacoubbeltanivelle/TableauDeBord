# 🖥️ SETUP_LOCAL_WAMP.md — Installation WampServer

> Guide étape par étape pour lancer TableauDeBord en local sous Windows + WampServer

---

## 📋 Prérequis

| Logiciel | Version | Vérifier |
|----------|---------|----------|
| WampServer | 3.3+ | `wampmanager.exe` |
| PHP | 8.2+ | `php -v` |
| Composer | 2.x | `composer -V` |
| Node.js | 20+ | `node -v` |
| Git | 2.x | `git --version` |

---

## ⚡ Installation Rapide (2 terminaux)

### Terminal 1 — Backend Laravel

```bash
cd F:\Carriere\Business2026\TableauDeBord\app

# 1. Installer dépendances PHP
composer install

# 2. Configurer l'environnement
copy .env.example .env
php artisan key:generate

# 3. Base de données (SQLite par défaut)
php artisan migrate --seed

# 4. Lancer le serveur
php artisan serve
# → http://localhost:8000
```

### Terminal 2 — Frontend Vite

```bash
cd F:\Carriere\Business2026\TableauDeBord\app

# 1. Installer dépendances Node
npm install

# 2. Lancer Vite dev server
npm run dev
# → http://localhost:5173 (HMR actif)
```

### 🎉 Accéder à l'application

**URL** : http://localhost:8000

**Compte démo** : `demo@tableaudebord.test` / `password`

---

## 🌐 Option Pro : VirtualHost WampServer

### Étape 1 — Fichier hosts Windows

📁 `C:\Windows\System32\drivers\etc\hosts` (ouvrir en Admin)

```
127.0.0.1    tableaudebord.local
```

### Étape 2 — VirtualHost Apache

📁 `C:\wamp64\bin\apache\apache2.4.xx\conf\extra\httpd-vhosts.conf`

```apache
<VirtualHost *:80>
    ServerName tableaudebord.local
    DocumentRoot "F:/Carriere/Business2026/TableauDeBord/app/public"
    
    <Directory "F:/Carriere/Business2026/TableauDeBord/app/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog "logs/tableaudebord-error.log"
    CustomLog "logs/tableaudebord-access.log" common
</VirtualHost>
```

### Étape 3 — Activer les modules Apache

Dans **WampServer → Apache → Modules**, activer :

- ✅ `rewrite_module` (obligatoire)
- ✅ `headers_module` (CORS)

### Étape 4 — Redémarrer WampServer

Clic droit → Restart All Services

### Étape 5 — Mettre à jour .env

```env
APP_URL=http://tableaudebord.local
```

### 🎉 Accéder via VirtualHost

**URL** : http://tableaudebord.local

> ⚠️ **Vite doit toujours tourner** : `npm run dev` en parallèle !

---

## 🗄️ Base de données MySQL (optionnel)

Par défaut, le projet utilise **SQLite**. Pour MySQL :

### 1. Créer la base dans phpMyAdmin

```sql
CREATE DATABASE tableaudebord CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Modifier .env

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tableaudebord
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Relancer les migrations

```bash
php artisan migrate:fresh --seed
```

---

## 🛠️ Commandes utiles

```bash
# Vider les caches
php artisan optimize:clear

# Rebuild cache config
php artisan config:cache
php artisan route:cache

# Lancer les tests
php artisan test

# Build production
npm run build
```

---

## ✅ Checklist Validation

| Test | Attendu |
|------|---------|
| http://localhost:8000 | Page d'accueil Laravel |
| http://localhost:8000/register | Formulaire inscription |
| `php artisan migrate` | Migrations OK |
| `npm run dev` | Vite HMR actif |
| `npm run build` | Build sans erreur |

---

## ⚠️ Dépannage

| Problème | Solution |
|----------|----------|
| "Class not found" | `composer dump-autoload` |
| "Permission denied storage" | `chmod 775 storage bootstrap/cache` |
| "Vite manifest not found" | Lancer `npm run dev` |
| "SQLSTATE Connection refused" | Vérifier MySQL actif dans Wamp |
| Page blanche | Vérifier `php artisan serve` actif |
