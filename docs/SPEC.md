# 📋 SPEC.md — Spécifications Fonctionnelles V1

> TableauDeBord multi-projets (PARA + GTD)

---

## 🎯 Vision

Créer un tableau de bord personnel unifié permettant de :
- **Capturer** rapidement toutes les idées (Inbox GTD)
- **Organiser** par projets et domaines (PARA)
- **Exécuter** avec focus quotidien (Today)
- **Suivre** l'avancement business

---

## 📦 Modules MVP

### 1. 📅 Today View

**Objectif** : Afficher les tâches prioritaires du jour pour un focus maximal.

**Fonctionnalités** :
- Liste des tâches due aujourd'hui
- Tâches marquées "Today" manuellement
- Progression du jour (% complété)
- Quick actions (compléter, reporter, déléguer)

#### ✅ Definition of Done — Today
- [ ] Affichage des tâches filtrées par date du jour
- [ ] Affichage des tâches avec flag "today"
- [ ] Action "Complete" fonctionnelle
- [ ] Action "Defer to tomorrow" fonctionnelle
- [ ] Barre de progression journalière
- [ ] Design responsive (mobile-first)
- [ ] Tests unitaires coverage > 80%

---

### 2. 📥 Inbox

**Objectif** : Capture rapide sans friction, traitement GTD.

**Fonctionnalités** :
- Ajout rapide (texte libre)
- Traitement : Transformer en tâche, note, ou archiver
- Règle des 2 minutes : Si < 2min, faire maintenant
- Zéro Inbox goal

#### ✅ Definition of Done — Inbox
- [ ] Champ de saisie rapide (< 1 clic pour focus)
- [ ] Conversion Inbox → Task
- [ ] Conversion Inbox → Note
- [ ] Action "Archive" / "Delete"
- [ ] Compteur d'items inbox
- [ ] Onboarding GTD (tooltip 2-min rule)
- [ ] Tests unitaires coverage > 80%

---

### 3. 📊 Kanban Board

**Objectif** : Vue visuelle des tâches par statut.

**Fonctionnalités** :
- Colonnes : To Do | In Progress | Blocked | Done
- Drag & Drop entre colonnes
- Filtres par projet/tag
- WIP limits (optionnel)

#### ✅ Definition of Done — Kanban
- [ ] 4 colonnes par défaut
- [ ] Drag & Drop fonctionnel
- [ ] Persistance du statut après D&D
- [ ] Filtre par projet
- [ ] Filtre par tag
- [ ] Affichage du nombre de cards par colonne
- [ ] Tests unitaires coverage > 80%

---

### 4. 📁 Projects (PARA)

**Objectif** : Organiser les projets selon le framework PARA.

**Fonctionnalités** :
- CRUD Projects
- Catégorisation : Project | Area | Resource | Archive
- Progression par projet (tâches complétées)
- Vue liste et vue cards

#### ✅ Definition of Done — Projects
- [ ] Create project avec nom, description, catégorie PARA
- [ ] Read : Liste des projets avec filtre par catégorie
- [ ] Update : Modifier nom/description/catégorie
- [ ] Delete : Suppression avec confirmation
- [ ] Barre de progression par projet
- [ ] Switch vue liste / vue cards
- [ ] Tests unitaires coverage > 80%

---

### 5. 📝 Notes

**Objectif** : Prise de notes liées aux projets et tâches.

**Fonctionnalités** :
- Éditeur Markdown
- Lien note ↔ projet
- Recherche full-text
- Tags

#### ✅ Definition of Done — Notes
- [ ] Éditeur Markdown avec preview
- [ ] Association note → projet
- [ ] Recherche par titre/contenu
- [ ] Système de tags
- [ ] Liste des notes récentes
- [ ] Tests unitaires coverage > 80%

---

### 6. 🗓️ Calendar

**Objectif** : Vue calendrier des échéances et événements.

**Fonctionnalités** :
- Vue mois/semaine/jour
- Affichage des tâches avec due date
- Création d'événements
- Drag to reschedule

#### ✅ Definition of Done — Calendar
- [ ] Vue mois avec indicateurs
- [ ] Vue semaine détaillée
- [ ] Vue jour
- [ ] Affichage tâches par due date
- [ ] Création événement inline
- [ ] Drag & drop pour reschedule
- [ ] Tests unitaires coverage > 80%

---

### 7. 💼 Business

**Objectif** : Suivi des métriques business et objectifs.

**Fonctionnalités** :
- Dashboard KPIs
- Objectifs avec progression
- Revenus/dépenses (optionnel)
- Graphiques de tendance

#### ✅ Definition of Done — Business
- [ ] Affichage de 3-5 KPIs principaux
- [ ] CRUD objectifs avec target/current
- [ ] Barre de progression par objectif
- [ ] Graphique ligne de tendance (30 jours)
- [ ] Export données (CSV)
- [ ] Tests unitaires coverage > 80%

---

## 🔗 Références

- [DATA_MODEL.md](DATA_MODEL.md) — Modèle de données
- [UI_MAP.md](UI_MAP.md) — Cartographie UI
- [DEPLOY.md](DEPLOY.md) — Déploiement
- [SECURITY.md](SECURITY.md) — Sécurité
