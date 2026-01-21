# 🛠️ Guide de Développement TableauDeBord

## Démarrage Rapide

```bash
cd app
npm install
composer install
composer run dev:win
```

Ouvrir : **http://127.0.0.1:8000**

> ⚠️ **Important** : Utilisez toujours `127.0.0.1:8000` (pas `localhost`) pour éviter les erreurs 419.

---

## Scripts Base de Données

| Commande              | Action                            | Données       |
| --------------------- | --------------------------------- | ------------- |
| `composer db:migrate` | Applique les nouvelles migrations | ✅ Conservées |
| `composer db:seed`    | Ajoute des données de démo        | ✅ Conservées |
| `composer db:reset`   | ⚠️ **SUPPRIME TOUT** et recrée    | ❌ Perdues    |

### Quand utiliser quoi ?

```bash
# Première installation ou après git pull avec nouvelles migrations
composer db:migrate

# Ajouter des données de test (sans perdre les existantes)
composer db:seed

# Reset complet (DÉVELOPPEMENT SEULEMENT !)
composer db:reset
```

---

## ⚠️ Éviter les Erreurs 419 (Page Expired)

L'erreur 419 survient quand le token CSRF est invalide. Causes fréquentes :

### 1. Mismatch d'URL

Le cookie de session est lié à l'URL. Si `APP_URL` ne correspond pas :

```env
# ❌ Mauvais (manque le port)
APP_URL=http://localhost

# ✅ Correct
APP_URL=http://127.0.0.1:8000
```

### 2. Session expirée

Après un `db:reset`, la table `sessions` est vidée. **Rafraîchissez la page** (F5).

### 3. Onglet ouvert longtemps

Les tokens expirent après 2h d'inactivité. Rafraîchissez.

---

## Compte Démo

Après `composer db:seed` ou `composer db:reset` :

- **Email** : `demo@tableaudebord.test`
- **Mot de passe** : `password`

---

## Structure du Projet

```
TableauDeBord/
├── app/                  # Projet Laravel (racine Laravel)
│   ├── app/              # Code PHP (Controllers, Models)
│   ├── resources/js/     # Pages React/Inertia
│   ├── database/         # Migrations et Seeders
│   └── .env              # Configuration locale
├── docs/                 # Documentation
└── README.md
```

---

## Tests

```bash
cd app
php artisan test
```

### Tests disponibles

- Accès pages authentifiées
- Isolation des données entre utilisateurs
- Pages légales (Terms, Privacy)
- Seeding fonctionne

---

## FAQ

### Les données ont disparu !

Quelqu'un a exécuté `migrate:fresh` ou `db:reset`. Relancez :

```bash
composer db:seed
```

### Erreur 419 sur login/register

1. Vérifiez que `APP_URL=http://127.0.0.1:8000` dans `.env`
2. Videz les cookies du navigateur
3. Rafraîchissez la page

### Le serveur ne démarre pas

```bash
php artisan config:clear
php artisan cache:clear
composer run dev:win
```
