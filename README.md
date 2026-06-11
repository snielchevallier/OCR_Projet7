# Abricot.co — Frontend

Interface web de l'application de gestion de projets **Abricot.co**, construite avec Next.js 16 (App Router) et React 19.

---

## Prérequis

- **Node.js** >= 20
- **npm** >= 10
- Le **backend** Abricot doit être lancé et accessible (voir dépôt backend)

---

## Installation

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd OCR_Projet7

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
```

Renseigner `.env.local` :

```env
BACKEND_API_URL=http://localhost:8000
```

---

## Lancer l'application

```bash
# Développement (hot reload)
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

```bash
# Build de production
npm run build

# Démarrer en production
npm run start
```

---

## Stack technique

| Technologie | Version | Usage |
|---|---|---|
| Next.js | 16.2 | Framework full-stack, App Router, Server Actions |
| React | 19.2 | UI, Context API |
| TypeScript | 5 | Typage statique strict (`strict: true`) |
| Tailwind CSS | v4 | Styles utilitaires via PostCSS |
| ESLint | v9 | Linting avec config Next.js |

---

## Architecture

### Vue d'ensemble

```
src/
├── app/                       # Next.js App Router
│   ├── (public)/              # Routes sans authentification
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (protected)/           # Routes protégées (JWT obligatoire)
│   │   ├── layout.tsx         # Charge le profil, injecte Header/Footer/UserContext
│   │   ├── dashboard/page.tsx # Vue des tâches assignées à l'utilisateur
│   │   ├── projets/
│   │   │   ├── page.tsx              # Liste de tous les projets
│   │   │   └── [slug]/page.tsx       # Détail d'un projet + tâches
│   │   └── profil/page.tsx    # Gestion du compte utilisateur
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── dashboard/         # DashboardContent, ListeView, KanbanView, KanbanColumn
│   │   ├── project/           # ProjectCard
│   │   ├── task/              # TaskCard, TasksList, TaskOptionsMenu, CommentsSection
│   │   ├── modales/           # Modales projet (new/edit/delete) et tâche (new/edit)
│   │   └── ui/                # Spinner
│   ├── globals.css
│   └── layout.tsx             # Layout racine — fonts + LoadingProvider
├── actions/                   # Server Actions (appels API backend)
│   ├── auth.ts                # loginAction, registerAction, logoutAction
│   ├── profile.ts             # getProfileAction, updateProfileAction, updatePasswordAction
│   ├── projects.ts            # CRUD projets + gestion des contributeurs + recherche utilisateurs
│   ├── tasks.ts               # CRUD tâches
│   ├── comments.ts            # getTaskCommentsAction, createCommentAction
│   └── dashboard.ts           # getAssignedTasksAction
├── types/                     # Définitions TypeScript par domaine
│   ├── project.ts             # ProjectUser, TeamMember, Project
│   ├── task.ts                # TaskAssignee, Task
│   ├── comment.ts             # Comment
│   └── index.ts               # Barrel export
├── lib/
│   ├── api.ts                 # apiFetch — wrapper HTTP avec injection automatique du token
│   ├── auth.ts                # login / register / logout (lecture/écriture cookies)
│   ├── validations.ts         # Regex de validation + fonctions validateLogin, validateRegister, etc.
│   ├── constants.ts           # STATUS_LABEL et STATUS_STYLE (labels et classes CSS par statut)
│   └── utils.ts               # slugify, getUserInitials, formatDate, formatDateTime
├── context/
│   ├── UserContext.tsx        # Utilisateur connecté (id, email, name)
│   └── LoadingContext.tsx     # État de chargement global — contrôle l'affichage du Spinner
├── hooks/
│   ├── useApi.ts              # Hook générique pour appels asynchrones avec état loading/error
│   ├── useOwnership.ts        # Retourne si l'utilisateur courant est propriétaire d'une ressource
│   └── useFocusTrap.tsx       # Piège le focus dans une modale (accessibilité)
└── middleware.ts              # Protection des routes — redirections auth
```

---

### Flux de données

```
Client Component
      │
      ▼
Server Action ('use server')          ← peut être appelée depuis client ou server
      │
      ▼
apiFetch(endpoint, options)           ← lit le token JWT dans les cookies
      │
      ▼
Backend API  (BACKEND_API_URL)
```

Les Server Actions sont le seul point d'entrée vers l'API backend. Aucun appel `fetch` direct ne se fait depuis un composant client.

---

### Authentification

Le token JWT est posé en **cookie `HttpOnly`** par le serveur Next.js au moment du login ou du register. Il est transmis automatiquement à l'API backend à chaque appel `apiFetch`.

```
Navigateur → Next.js (Server Action loginAction)
           → POST /auth/login → Backend
           ← token JWT
           → set-cookie: token=...; HttpOnly; SameSite=lax; Max-Age=7j
```

#### Middleware (`src/middleware.ts`)

Intercepte toutes les requêtes entrantes (hors assets statiques) :

| Situation | Action |
|---|---|
| Route protégée, pas de token | Redirect `/login?callbackUrl=<url>` |
| Route publique (`/login`, `/register`) avec token | Redirect `/dashboard` |
| Autres cas | Laisse passer |

---

### Authentification — Validation des données

Les validations sont centralisées dans `src/lib/validations.ts` et exécutées **côté client avant** l'envoi à la Server Action, et **côté serveur** dans l'action elle-même.

```typescript
// Mot de passe : min 8 caractères, 1 maj, 1 min, 1 chiffre, 1 caractère spécial
PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
```

Fonctions disponibles :
- `validateLogin(email, password)` — retourne un message d'erreur ou `null`
- `validateRegister(lastname, firstname, email, password)` — idem
- `validateProject(name, description)` — idem
- `validateTask(title, description, dueDate)` — idem

---

### Statuts des tâches

Les statuts sont typés et centralisés dans `src/lib/constants.ts` pour garantir la cohérence des labels et des styles CSS à travers toute l'application.

| Clé | Label affiché | Couleur |
|---|---|---|
| `TODO` | À faire | Orange |
| `IN_PROGRESS` | En cours | Bleu |
| `DONE` | Terminé | Vert |

```typescript
// Exemple d'utilisation dans un composant
import { STATUS_LABEL, STATUS_STYLE } from '@/lib/constants'

<span className={STATUS_STYLE[task.status]}>
  {STATUS_LABEL[task.status]}
</span>
```

---

### Gestion des projets

Chaque projet possède :
- Un **propriétaire** (`ownerId`) et des **membres** (`TeamMember[]`)
- Un compteur de tâches (`_count.tasks`) pour la barre de progression
- Un **slug** généré à partir du nom (voir section URLs)

#### Contributeurs

Le propriétaire peut **ajouter** un contributeur par email (`addContributorAction`) ou le **retirer** (`removeContributorAction`). Une recherche d'utilisateurs existants est disponible via `searchUsersAction`.

---

### Dashboard

La page `/dashboard` affiche les **tâches assignées à l'utilisateur connecté**, issues de tous ses projets.

Deux vues sont disponibles et switchables :

- **Vue liste** (`DashboardListView`) — affichage linéaire des tâches
- **Vue Kanban** (`DashboardKanbanView`) — colonnes par statut (À faire | En cours | Terminé)

---

### URLs et slugs

Les URLs des projets utilisent un **slug** généré depuis le nom plutôt que l'identifiant base de données :

```
/projets/authentification-jwt   ← slugify("Authentification JWT")
```

Au chargement de la page détail, tous les projets sont récupérés et le bon projet est identifié par correspondance de slug. L'`id` issu de cette correspondance sert aux appels API suivants.

---

### Séparation des responsabilités

**Types** (`src/types/`)  
Déclarations TypeScript regroupées par domaine. Importés via le barrel `@/types`. Aucun type n'est défini inline dans les actions ou les composants.

**Actions** (`src/actions/`)  
Fonctions `'use server'` appelables depuis Server Components et Client Components. Un fichier = un domaine métier. Elles ne font que préparer et transmettre les données — aucune logique de rendu.

**Composants**  
- Pas de `'use client'` par défaut → Server Component
- `'use client'` uniquement si interactivité nécessaire : `TasksList`, `CommentsSection`, les modales, `Header`

**Hooks custom**
- `useApi` — encapsule `loading`, `error` et `data` pour tout appel asynchrone
- `useOwnership` — vérifie si l'utilisateur courant est propriétaire d'une ressource (contrôle d'affichage des actions d'édition/suppression)
- `useFocusTrap` — confine le focus clavier dans une modale ouverte (accessibilité WCAG)

---

### Accessibilité (WCAG)

Le projet intègre plusieurs points d'accessibilité :
- `role` et `aria-*` sur les boutons, spinners et jauges de progression
- `alt` descriptifs sur les images fonctionnelles, supprimés sur les images décoratives
- Piège de focus dans les modales via `useFocusTrap`

---

## Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `BACKEND_API_URL` | URL de base de l'API backend | `http://localhost:8000` |