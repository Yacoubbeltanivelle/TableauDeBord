# 🔐 SECURITY.md — Politique de Sécurité V1

> Bonnes pratiques et mesures de sécurité pour TableauDeBord

---

## 🎯 Principes

1. **Defense in Depth** — Multiples couches de protection
2. **Least Privilege** — Accès minimum nécessaire
3. **Secure by Default** — Sécurisé par défaut

---

## 🔑 Authentification

### JWT Strategy

```
┌─────────┐      ┌─────────┐      ┌─────────┐
│ Client  │─────>│  API    │─────>│   DB    │
│         │<─────│ (JWT)   │<─────│         │
└─────────┘      └─────────┘      └─────────┘
     │                │
     │  Access Token  │
     │  (15 min)      │
     │                │
     │  Refresh Token │
     │  (7 days)      │
     │  HttpOnly      │
```

### Règles

| Règle | Implémentation |
|-------|----------------|
| Mots de passe | Minimum 12 caractères, bcrypt hash (cost 12) |
| Access Token | Expiration 15 minutes, stocké en mémoire |
| Refresh Token | Expiration 7 jours, HttpOnly cookie |
| Rate Limiting | 100 req/min par IP, 5 login attempts/15min |

---

## 🛡️ Autorisation

### RBAC (Role-Based Access Control)

| Role | Permissions |
|------|-------------|
| `user` | CRUD sur ses propres données |
| `admin` | Toutes permissions + gestion users |

### Règles d'accès

```typescript
// Middleware exemple
function requireOwnership(req, res, next) {
  const resource = await getResource(req.params.id);
  if (resource.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
```

---

## 🔒 Protection des Données

### En transit
- **HTTPS obligatoire** (TLS 1.3)
- **HSTS** header activé
- **Certificate pinning** (mobile, optionnel)

### Au repos
- **Chiffrement DB** (PostgreSQL `pgcrypto` pour données sensibles)
- **Backups chiffrés** (AES-256)

### Données sensibles

| Donnée | Traitement |
|--------|------------|
| Mot de passe | Hash bcrypt, jamais stocké en clair |
| Email | Indexé pour lookup, chiffré optionnel |
| Notes perso | Chiffrement E2E optionnel (future) |

---

## 🚫 Fichiers Interdits

> ⚠️ **NE JAMAIS commit dans le repo :**

```
.env
.env.local
.env.production
*.pem
*.key
secrets/
credentials.json
```

### .gitignore minimal

```gitignore
# Secrets
.env*
!.env.example
*.pem
*.key

# Dependencies
node_modules/

# Build
dist/
build/
```

---

## 🛡️ Headers Sécurité

```typescript
// Helmet.js config
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  frameguard: { action: 'deny' },
}));
```

---

## 🧪 Validation Input

### Règles

| Input | Validation |
|-------|------------|
| Email | Format RFC 5322, lowercase |
| Titre tâche | Max 255 chars, sanitize HTML |
| Description | Max 10000 chars, sanitize |
| IDs | UUID v4 format strict |

### Exemple Zod

```typescript
const TaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(10000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().datetime().optional(),
});
```

---

## 📋 Checklist Sécurité

### Avant chaque release

- [ ] Aucun secret dans le code
- [ ] Dépendances à jour (`npm audit`)
- [ ] Input validation sur tous les endpoints
- [ ] Rate limiting configuré
- [ ] CORS restrictif
- [ ] Headers sécurité présents
- [ ] Tests de sécurité passent

### Audit régulier

- [ ] Revue des permissions
- [ ] Rotation des secrets (90 jours)
- [ ] Analyse des logs d'accès
- [ ] Scan vulnérabilités (`npm audit`, Snyk)

---

## 🚨 Incident Response

### En cas de breach

1. **Contenir** — Isoler le système affecté
2. **Identifier** — Déterminer l'étendue
3. **Notifier** — Users concernés sous 72h (RGPD)
4. **Corriger** — Patcher la vulnérabilité
5. **Documenter** — Post-mortem

### Contacts

| Role | Contact |
|------|---------|
| Security Lead | [À définir] |
| Hébergeur | [Support ticket] |

---

## 🔗 Références

- [DEPLOY.md](DEPLOY.md) — Déploiement
- [SPEC.md](SPEC.md) — Spécifications
- [OWASP Top 10](https://owasp.org/Top10/)
