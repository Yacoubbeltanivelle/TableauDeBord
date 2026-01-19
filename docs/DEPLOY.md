# 🚀 DEPLOY.md — Guide de Déploiement V1

> Environnements et procédures pour TableauDeBord

---

## 🛠️ Stack Technique Proposée

### Frontend
| Technologie | Justification |
|-------------|---------------|
| **React 18+** | Composants, hooks, écosystème mature |
| **TypeScript** | Typage fort, moins de bugs |
| **Vite** | Build rapide, HMR |
| **TanStack Query** | Cache, data fetching |
| **Zustand** | State management léger |
| **Tailwind CSS** | Styling utility-first |

### Backend
| Technologie | Justification |
|-------------|---------------|
| **Node.js + Express** ou **Hono** | API REST rapide |
| **PostgreSQL** | Base relationnelle robuste |
| **Prisma** | ORM TypeScript-first |
| **JWT** | Authentification stateless |

### Alternatives à considérer
| Option A | Option B |
|----------|----------|
| **Supabase** (BaaS) | **Self-hosted** (VPS) |
| Setup rapide, auth intégrée | Contrôle total, coût fixe |
| Limites du free tier | Maintenance requise |

> ⚠️ **Décision requise** : Choix between Supabase vs Self-hosted avant implémentation.

---

## 🌍 Environnements

| Env | URL | Base de données | Usage |
|-----|-----|-----------------|-------|
| **Local** | `localhost:5173` | SQLite ou Docker PG | Développement |
| **Staging** | `staging.tableaudebord.app` | PostgreSQL (clone) | Tests, review |
| **Production** | `tableaudebord.app` | PostgreSQL | Utilisateurs |

---

## 📦 Structure du Projet

```
TableauDeBord/
├── docs/                    # Documentation
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants UI
│   │   ├── pages/           # Pages routes
│   │   ├── hooks/           # Hooks custom
│   │   ├── stores/          # Zustand stores
│   │   ├── api/             # Clients API
│   │   └── types/           # TypeScript types
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Logique métier
│   │   ├── middleware/      # Auth, validation
│   │   ├── models/          # Prisma models
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🔧 Setup Local

### Prérequis
- Node.js 20+
- npm ou pnpm
- Docker (pour PostgreSQL local)

### Installation

```bash
# Clone
git clone <repo-url>
cd TableauDeBord

# Backend
cd backend
npm install
cp .env.example .env      # Configurer DB_URL
npx prisma migrate dev    # Migrations
npm run dev               # Port 3000

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev               # Port 5173
```

---

## 🚢 Procédure de Déploiement

### Checklist Pré-déploiement

- [ ] Tests passent (`npm test`)
- [ ] Build sans erreur (`npm run build`)
- [ ] Migrations vérifiées
- [ ] Variables d'env documentées
- [ ] Changelog mis à jour

### Staging

```bash
# 1. Créer branche
git checkout -b release/v0.1.0

# 2. Build et test
npm run build
npm run test:e2e

# 3. Deploy staging
git push origin release/v0.1.0
# → CI/CD déploie automatiquement sur staging

# 4. Smoke tests sur staging
# 5. PR vers main si OK
```

### Production

```bash
# 1. Merge PR vers main
git checkout main
git pull

# 2. Tag version
git tag v0.1.0
git push --tags
# → CI/CD déploie automatiquement en prod

# 3. Vérifier monitoring
# 4. Rollback si nécessaire
git revert HEAD
git push
```

---

## 🐳 Docker

### docker-compose.yml (local)

```yaml
version: '3.8'
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: tableau
      POSTGRES_PASSWORD: localdevonly
      POSTGRES_DB: tableaudebord
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## 📊 Monitoring (Production)

| Outil | Usage |
|-------|-------|
| **Sentry** | Error tracking |
| **Uptime Robot** | Disponibilité |
| **Analytics** | Usage patterns |

---

## 🔗 Références

- [SPEC.md](SPEC.md) — Spécifications
- [SECURITY.md](SECURITY.md) — Sécurité
