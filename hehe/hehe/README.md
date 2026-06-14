# yhn'lookup - BrixHub API Integration

Une interface de recherche OSINT utilisant l'API BrixHub v1, déployée sur Netlify avec des fonctions serverless.

## 🚀 Déploiement sur Netlify

### Prérequis

1. **Compte Netlify** - Créez un compte gratuit sur [netlify.com](https://netlify.com)
2. **Git et Node.js** - Installez-les sur votre machine
3. **Clé API BrixHub** - Obtenue auprès de BrixHub

### Configuration

#### 1. Variables d'environnement

Votre clé API doit être stockée comme variable d'environnement pour ne jamais être exposée.

**Sur Netlify (Production):**
1. Allez dans votre projet Netlify
2. Cliquez sur **Site settings** → **Build & deploy** → **Environment**
3. Ajoutez une nouvelle variable:
   - **Key**: `BRIXHUB_API_KEY`
   - **Value**: `brix_l_FbKkIDMqLmd0WqWkqeD0Ueqouy6zz2iO5Jv_IQNFazHuLZ`

**En local (développement):**
- Un fichier `.env` est fourni avec votre clé
- Le fichier `.env.example` montre la structure attendue
- ⚠️ **NE COMMIT JAMAIS** le fichier `.env` (il est dans `.gitignore`)

### Déploiement

#### Option 1: via Git (Recommandé)

```bash
# Clonez votre repo (ou utilisez le vôtre)
git clone <your-repo>
cd hehe

# Les fichiers de configuration sont inclus:
# - netlify.toml
# - netlify/functions/

# Poussez vers votre repo Git
git push origin main

# Netlify déploiera automatiquement depuis Git
# (après avoir lié votre repo dans les paramètres Netlify)
```

#### Option 2: Drag & Drop

1. Zippez le dossier du projet
2. Allez sur [netlify.com/drop](https://netlify.com/drop)
3. Déposez le fichier zip
4. Ajoutez les variables d'environnement dans les paramètres du site

#### Option 3: CLI Netlify

```bash
# Installez Netlify CLI
npm install -g netlify-cli

# Connectez-vous
netlify login

# Déployez
netlify deploy --prod
```

## 📁 Structure du Projet

```
.
├── index.html              # Interface principale
├── script.js              # Logique de l'application
├── styles.css             # Styles (inclus les résultats)
├── netlify.toml          # Configuration Netlify
├── netlify/functions/    # Fonctions serverless
│   ├── search.js         # Endpoint POST /search
│   ├── lookup.js         # Endpoint POST /lookup (email, phone, iban)
│   └── account.js        # Endpoint GET /me (infos compte)
├── .env                  # Variables d'environnement (local)
├── .env.example          # Template des variables
└── .gitignore           # Ignore les fichiers sensibles
```

## 🔧 Fonctionnalités

### 1. Recherche Multi-Critères
Envoyez un ou plusieurs critères:
- **Identité**: nom, prénom, date de naissance, etc.
- **Contact**: email, téléphone, IP
- **Adresse**: rue, code postal, ville, département
- **Gaming**: Discord ID, Steam ID, FiveM License
- **Professionnel**: entreprise, profession, fonction

### 2. Reverse Lookups
Trouvez une personne à partir d'un seul identifiant:
- Email
- Téléphone
- IBAN

### 3. Gestion du Quota
Chaque réponse inclut:
- Requêtes restantes aujourd'hui
- Limite journalière
- Temps de réponse

## 📊 Endpointsxterniser

### POST `/.netlify/functions/search`
Recherche avec plusieurs critères.

**Body:**
```json
{
  "nom_famille": "Dupont",
  "prenom": "Jean",
  "email": "jean@gmail.com",
  "ville": "Paris"
}
```

**Réponse:**
```json
{
  "status": 200,
  "data": {
    "results": [...]
  },
  "meta": {
    "total": 42,
    "page": 1,
    "pages": 5,
    "took_ms": 45
  }
}
```

### POST `/.netlify/functions/lookup`
Reverse lookup par email, téléphone ou IBAN.

**Body:**
```json
{
  "type": "email",
  "value": "jean@gmail.com"
}
```

### GET `/.netlify/functions/account`
Infos de votre clé API.

**Réponse:**
```json
{
  "status": 200,
  "data": {
    "plan": "starter",
    "daily_quota": 1000,
    "daily_used": 125,
    "daily_remaining": 875
  }
}
```

## ⚙️ Configuration

### netlify.toml
```toml
[build]
  command = "echo 'Static site ready to deploy'"
  publish = "."

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

Cela configure:
- Le dossier racine comme dossier public
- Les fonctions Node.js dans `netlify/functions/`
- Bundler moderne (esbuild)

## 🔐 Sécurité

✅ **La clé API n'est JAMAIS exposée** - Elle reste côté serveur (Netlify)
✅ **HTTPS obligatoire** - Tous les appels utilisent HTTPS
✅ **User-Agent obligatoire** - Protégé par Cloudflare
✅ **CORS gérés** - Les fonctions Netlify gèrent les en-têtes

## 🐛 Troubleshooting

### "API key not configured"
- Vérifiez que `BRIXHUB_API_KEY` est définie dans les variables d'environnement Netlify
- En local, vérifiez que le fichier `.env` existe

### "Just a moment..." HTML response
- Assure que chaque requête a un User-Agent (géré automatiquement par les fonctions)
- Vérifiez votre clé API

### CORS errors
- Les fonctions Netlify gèrent les CORS
- Vérifiez que vous appelez `/.netlify/functions/search` et non l'API directement

### Pas de résultats
- Vérifiez votre quota (utiliser `/api/v1/me`)
- Essayez avec des critères moins stricts (`flexible: true`)
- Vérifiez l'orthographe des noms/villes

## 📝 Exemples d'Utilisation

### Recherche simple
```javascript
const response = await fetch("/.netlify/functions/search", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nom_famille: "Dupont",
    ville: "Paris"
  })
});
const data = await response.json();
```

### Reverse lookup
```javascript
const response = await fetch("/.netlify/functions/lookup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "email",
    value: "jean@gmail.com"
  })
});
```

## 📚 Documentation de l'API BrixHub

- **Base URL**: `https://brixhub.net/api/v1`
- **Spec OpenAPI**: https://brixhub.net/api/v1/docs
- **Format**: JSON
- **Authentication**: Header `X-API-Key`

## 🎯 Limites de Plan

| Feature | Starter | Premium | Pro | Enterprise |
|---------|---------|---------|-----|------------|
| Requêtes/jour | 1,000 | 5,000 | 10,000 | 100,000 |
| Résultats/requête | 10 | 10 | 10 | 100 |
| Pagination | Page 1 | Illimitée | Illimitée | Illimitée |
| Logs d'utilisation | ❌ | ✅ | ✅ | ✅ |

## 📞 Support

- Email: contact@brixhub.net (ou votre support)
- Discord: [Lien Discord](https://discord.gg/yhnlookup)
- Telegram: [Lien Telegram](@yhnlookup)

## ⚖️ Disclaimer

Cette application interroge les bases de données BrixHub. Respectez les lois applicables et les conditions d'utilisation de BrixHub.

---

**Dernière mise à jour**: Juin 2026
