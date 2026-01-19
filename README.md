# 📊 TableauDeBord

> OS de solopreneur multi-projets — PARA + GTD

[![CI](https://github.com/Yacoubbeltanivelle/TableauDeBord/actions/workflows/ci.yml/badge.svg)](https://github.com/Yacoubbeltanivelle/TableauDeBord/actions/workflows/ci.yml)

---

## ⚡ Quickstart Local (Windows + Wamp)

### Prérequis
- PHP 8.2+, Composer, Node.js 20+

### Installation

```bash
# Cloner
git clone https://github.com/Yacoubbeltanivelle/TableauDeBord.git
cd TableauDeBord/app

# Backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed

# Frontend
npm install
```

### Lancement (2 terminaux)

```bash
# Terminal 1 - Laravel
php artisan serve

# Terminal 2 - Vite
npm run dev
```

**URL** : http://localhost:8000  
**Démo** : `demo@tableaudebord.test` / `password`

---

## 📁 Structure

```
TableauDeBord/
├── app/                 # Laravel + React (Vite)
│   ├── app/Models/      # Eloquent
│   ├── resources/js/    # React + shadcn/ui
│   └── public/          # Document Root
└── docs/                # Spécifications
    ├── SPEC.md
    ├── DATA_MODEL.md
    ├── UI_MAP.md
    ├── DEPLOY.md
    └── SECURITY.md
```

---

## 📖 Documentation

| Guide | Description |
|-------|-------------|
| [SETUP_LOCAL_WAMP.md](SETUP_LOCAL_WAMP.md) | Installation locale WampServer |
| [docs/SPEC.md](docs/SPEC.md) | Spécifications modules |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Schéma base de données |
| [app/DEPLOY.md](app/DEPLOY.md) | Déploiement cPanel |

---

## 🛠️ Commandes

```bash
# Tests
php artisan test

# Lint PHP
./vendor/bin/pint

# Build production
npm run build
```

---

## 📋 Modules MVP

- **Today** — Tâches du jour (GTD)
- **Inbox** — Capture rapide
- **Tasks Board** — Kanban
- **Projects** — PARA (Projects/Areas/Resources/Archives)
- **Notes** — Markdown
- **Calendar** — Vue mois
- **Business** — KPIs et objectifs