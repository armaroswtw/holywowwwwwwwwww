# 🏗️ Architecture du Projet yhn'lookup

## Vue d'ensemble

```
┌─────────────────┐
│   Navigateur    │  (client)
│   yhn'lookup    │
└────────┬────────┘
         │
         │ fetch("/.netlify/functions/search")
         │
┌────────▼────────────────────┐
│    Netlify (Serveur)        │
│  ┌─────────────────────────┐ │
│  │  Functions Serverless   │ │
│  │ ┌─────────────────────┐ │ │
│  │ │  /search.js         │ │ │
│  │ │  /lookup.js         │ │ │
│  │ │  /account.js        │ │ │
│  │ └─────────────────────┘ │ │
│  │  BRIXHUB_API_KEY (ENV)  │ │
│  └────────┬────────────────┘ │
└───────────┼──────────────────┘
            │
            │ https://brixhub.net/api/v1
            │ (avec clé API, User-Agent)
            │
┌───────────▼──────────────┐
│   API BrixHub            │
│   (Données OSINT)        │
└──────────────────────────┘
```

## Flux de données

### 1. Recherche Multi-Critères

```javascript
// 1️⃣ Utilisateur remplit les champs
nom = "Dupont"
prenom = "Jean"
ville = "Paris"

// 2️⃣ Script.js collecte les données
payload = {
  nom_famille: "Dupont",
  prenom: "Jean",
  ville: "Paris"
}

// 3️⃣ Envoi à Netlify (côté navigateur)
POST /.netlify/functions/search
├─ Sécurisé (clé API non visible)
├─ HTTPS
└─ CORS handled by Netlify

// 4️⃣ Netlify function reçoit la requête
netlify/functions/search.js
├─ Récupère BRIXHUB_API_KEY (variable d'environnement)
├─ Ajoute X-API-Key header
├─ Ajoute User-Agent header
└─ Appelle https://brixhub.net/api/v1/search

// 5️⃣ BrixHub répond avec les résultats
Response
├─ Status: 200
├─ X-RateLimit-Remaining-Day: 875
└─ Body: {data: {results: [...]}}

// 6️⃣ Netlify renvoie au navigateur
Search.js reçoit et passe la réponse au client

// 7️⃣ Script.js affiche les résultats
displayResults(data)
├─ Génère les cards HTML
├─ Montre les statistiques
└─ Affiche le quota restant
```

## Structure des fichiers

```
.
├── 📄 index.html              
│   └─ Interface HTML avec:
│      ├─ Section Hero (accueil)
│      ├─ Formulaire de recherche
│      └─ Zone de résultats
│
├── 📄 script.js               
│   └─ Logique client avec:
│      ├─ Navigation entre vues
│      ├─ Animation de l'oeil (SVG)
│      ├─ Collecte des formulaires
│      ├─ Appels aux functions Netlify
│      └─ Affichage des résultats
│
├── 📄 styles.css              
│   └─ Design avec:
│      ├─ Variables CSS (couleurs)
│      ├─ Animations
│      ├─ Responsive design
│      └─ Styles des résultats
│
├── 🔧 netlify.toml           
│   └─ Configuration Netlify:
│      ├─ Répertoire des functions
│      ├─ Build command
│      └─ Publish directory
│
├── 📁 netlify/functions/
│   ├─ 📄 search.js
│   │   └─ POST /search
│   │      ├─ Collecte le payload
│   │      ├─ Ajoute la clé API (depuis ENV)
│   │      └─ Appelle BrixHub /search
│   │
│   ├─ 📄 lookup.js
│   │   └─ POST /lookup
│   │      ├─ Traite email, phone, iban
│   │      └─ Appelle BrixHub /lookup/{type}/{value}
│   │
│   └─ 📄 account.js
│       └─ GET /me
│          ├─ Récupère infos du compte
│          └─ Quota journalier, etc.
│
├── 📄 .env                    
│   └─ Variables d'environnement (local)
│      └─ BRIXHUB_API_KEY = brix_...
│
├── 📄 .env.example           
│   └─ Template pour Git
│
├── 📄 .gitignore              
│   └─ Ignore les fichiers sensibles
│      ├─ .env
│      ├─ node_modules/
│      └─ .netlify/
│
├── 📄 README.md              
│   └─ Documentation complète
│
└── 📄 DEPLOYMENT.md           
    └─ Guide de déploiement
```

## Flux d'authentification

```
🚨 IMPORTANT: La clé API n'est JAMAIS dans le navigateur!

Avant (❌ INSECURE):
Navigateur (Frontend) → BrixHub
  ├─ Clé API visible en JavaScript
  ├─ CORS bloqué (Cloudflare)
  └─ Clé exposée aux attaquants

Après (✅ SECURE):
Navigateur → Netlify Function → BrixHub
  ├─ Clé API stockée en tant que variable d'environnement
  ├─ Navires uniquement entre Netlify et BrixHub
  ├─ Navigateur → Netlify: pas de clé
  └─ CORS et HTTPS gérés par Netlify
```

## Variables d'Environnement

### En local (pour développement)
```bash
# .env
BRIXHUB_API_KEY=brix_l_FbKkIDMqLmd0WqWkqeD0Ueqouy6zz2iO5Jv_IQNFazHuLZ

# Utilisée par netlify dev
```

### Sur Netlify (production)
```
Paramètres → Build & deploy → Environment
BRIXHUB_API_KEY = brix_l_FbKkIDMqLmd0WqWkqeD0Ueqouy6zz2iO5Jv_IQNFazHuLZ
```

## Endpoints Netlify

| Endpoint | Méthode | Fonction | Usage |
|----------|---------|---------|-------|
| `/.netlify/functions/search` | POST | search.js | Recherche multi-critères |
| `/.netlify/functions/lookup` | POST | lookup.js | Reverse lookup (email/phone/iban) |
| `/.netlify/functions/account` | GET | account.js | Infos du compte (quota) |

## Gestion des erreurs

```javascript
// Cas d'erreur géré par les functions:

1. API Key non configurée
   → Status: 500
   → Message: "API key not configured"

2. Paramètres invalides
   → Status: 400
   → Message: "Invalid parameters"

3. Quota dépassé
   → Status: 429
   → Message: "Quota exceeded"

4. Erreur serveur BrixHub
   → Status: 500+
   → Forward la réponse BrixHub

// Le navigateur affiche une notification à l'utilisateur
searchFeedback.textContent = `Erreur: ${error.message}`
```

## Rate Limiting

BrixHub limite les requêtes par:
- **Jour**: Selon le plan (1K à 100K)
- **Minute**: Selon le plan (10 à 100)

Les headers de réponse incluent:
```
X-RateLimit-Limit-Day: 1000
X-RateLimit-Remaining-Day: 875
X-RateLimit-Limit-Min: 10
```

Script.js affiche le quota restant:
```javascript
const remaining = response.headers.get("X-RateLimit-Remaining-Day");
searchFeedback.textContent = `Requetes restantes: ${remaining}`;
```

## Déploiement

```mermaid
Git Repository
       ↓
   (git push)
       ↓
Netlify (automatique)
  ├─ Clone du repo
  ├─ Build (static files)
  ├─ Deploy functions
  ├─ Injecte variables d'environnement
  └─ ✅ Site actif
```

## Technologies utilisées

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js (Netlify Functions)
- **Hébergement**: Netlify (serverless)
- **API**: BrixHub v1 (HTTPS)
- **Sécurité**: Environnement variables, HTTPS, CORS

## Avantages de cette architecture

✅ **Sécurisé**: Clé API jamais exposée  
✅ **Scalable**: Fonctions serverless auto-scalées  
✅ **Gratuit**: Netlify offre 125k requêtes/mois  
✅ **Rapide**: Functions exécutées près de l'utilisateur  
✅ **Facile**: Pas de serveur à maintenir  
✅ **Flexible**: Facilement extensible avec d'autres functions  

---

**Architecture mise à jour**: Juin 2026
