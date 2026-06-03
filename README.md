# Abricot — Frontend

Interface web de l'application de gestion de projets Abricot, construite avec Next.js 16 et React 19.

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
BACKEND_API_URL=http://localhost:3001
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

## Architecture

### Vue d'ensemble

```
src/
├── app/                   # Next.js App Router
│   ├── (public)/          # Pages accessibles sans authentification
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/       # Pages nécessitant un token JWT valide
│   │   ├── layout.tsx     # Injecte Header, Footer et UserContext
│   │   ├── dashboard/
│   │   ├── projets/
│   │   │   ├── page.tsx          # Liste des projets
│   │   │   └── [slug]/page.tsx   # Détail d'un projet
│   │   └── profil/
│   ├── components/        # Composants réutilisables
│   │   ├── layout/        # Header, Footer
│   │   ├── project/       # ProjectCard
│   │   ├── task/          # TaskCard, TasksList, CommentsSection
│   │   └── modales/       # Modales de création / édition
│   ├── globals.css
│   └── layout.tsx         # Layout racine
├── actions/               # Server Actions (appels API backend)
│   ├── auth.ts            # login, register, logout
│   ├── profile.ts         # getProfileAction
│   ├── projects.ts        # getProjectsAction, getProjectAction, createProjectAction
│   ├── tasks.ts           # getProjectTasksAction
│   └── comments.ts        # getTaskCommentsAction, createCommentAction
├── types/                 # Définitions TypeScript par domaine
│   ├── project.ts         # ProjectUser, TeamMember, Project
│   ├── task.ts            # TaskAssignee, Task
│   ├── comment.ts         # Comment
│   └── index.ts           # Barrel export
├── lib/
│   ├── api.ts             # apiFetch — wrapper HTTP avec injection du token
│   ├── auth.ts            # login / register / logout (gestion des cookies)
│   └── utils.ts           # slugify, getUserInitials, formatDate, formatDateTime
├── context/
│   └── UserContext.tsx    # Contexte React pour l'utilisateur connecté
├── hooks/
│   └── useApi.ts          # Hook générique pour les appels asynchrones
└── middleware.ts          # Protection des routes — redirect si token absent
```

---

### Authentification

Le token JWT est posé en **cookie `HttpOnly`** par le serveur Next.js au moment du login ou du register. Il est transmis automatiquement à l'API backend via `apiFetch`.

```
Navigateur → Next.js (Server Action login)
           → POST /auth/login → Backend
           ← token JWT
           → cookie HttpOnly (7 jours, sameSite: lax)
```

Le **middleware** (`src/middleware.ts`) intercepte toutes les requêtes :
- Pas de token + route protégée → redirect `/login?callbackUrl=…`
- Token présent + route publique (`/login`, `/register`) → redirect `/dashboard`

---

### Séparation des responsabilités

**Types** (`src/types/`)  
Déclarations TypeScript regroupées par domaine. Importés avec `import type { Project } from '@/types'`. Aucun type ne vit dans les fichiers d'actions.

**Actions** (`src/actions/`)  
Fonctions marquées `'use server'`, appelables depuis les Server Components et les Client Components. Chaque fichier ne contient que les actions d'un seul domaine métier.

**Composants**  
- Les composants sans état client (pas de hooks, pas d'événements) sont des Server Components par défaut.
- Les composants avec interactivité portent la directive `'use client'` : `TasksList`, `CommentsSection`, les modales.

---

### URLs et slugs

Les URLs des projets utilisent un **slug** généré depuis le nom du projet (`slugify` dans `utils.ts`) plutôt que l'identifiant base de données.

```
/projets/authentification-jwt   ← slug généré depuis le nom
```

Au chargement de la page détail, la liste des projets est récupérée et le projet est identifié par correspondance de slug. L'`id` issu de cette correspondance sert ensuite aux appels API.

---

### Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `BACKEND_API_URL` | URL de base de l'API backend | `http://localhost:3001` |
