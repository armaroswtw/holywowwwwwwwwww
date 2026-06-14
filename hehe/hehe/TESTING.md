# 🧪 Guide de Test - yhn'lookup

## Test Local avec Netlify Dev

### 1️⃣ Installation des prérequis

```bash
# Installez Node.js depuis https://nodejs.org/

# Installez Netlify CLI
npm install -g netlify-cli

# Connectez-vous à Netlify
netlify login
```

### 2️⃣ Lancez le serveur local

```bash
# Depuis la racine du projet
netlify dev

# Vous devriez voir:
# ⠋ Preparing functions...
# ⠇ Starting Netlify Dev server...
# ✔ Server ready: http://localhost:8888
```

### 3️⃣ Ouvrez votre navigateur

```
http://localhost:8888
```

---

## Tests à effectuer

### Test 1: Chargement de la page

```
✅ Vérifiez:
- La page se charge sans erreur
- L'oeil SVG anime correctement
- Les boutons sont cliquables
- La navigation fonctionne
```

### Test 2: Navigation

```
1. Cliquez sur "Recherche" dans la nav
   ✅ Vous devriez voir le formulaire

2. Cliquez sur "Accueil"
   ✅ Vous devriez revenir à la page d'accueil

3. Cliquez sur "Lancer une recherche"
   ✅ Vous devriez aller à la page de recherche
```

### Test 3: Formulaire de recherche

```
1. Remplissez les champs:
   - Nom: "Dupont"
   - Ville: "Paris"

2. Vérifiez le compteur:
   ✅ Il devrait afficher "2 criteres"

3. Cliquez "Effacer"
   ✅ Les champs et le compteur devraient se réinitialiser

4. Remplissez à nouveau et vérifiez que le compteur s'incrémente
```

### Test 4: Appel à l'API (La vraie test!)

```
1. Remplissez au moins un critère
   Ex: Ville = "Paris"

2. Cliquez "Rechercher"

3. Observez la console (F12 → Console)
   ✅ Pas d'erreur JavaScript
   ✅ L'appel à /.netlify/functions/search s'effectue

4. Vérifiez l'onglet Network (F12 → Network)
   ✅ Une requête POST vers /.netlify/functions/search
   ✅ Status 200 (succès)
   ✅ Response contient JSON valide

5. Vérifiez les résultats
   ✅ Une ou plusieurs cartes de résultats s'affichent
   ✅ Chaque carte montre:
      - Nom et prénom
      - Score de confiance (%)
      - Email
      - Téléphone
      - Adresse
      - Ville
      - Sources
   ✅ Les statistiques affichent le nombre total
```

### Test 5: Gestion des erreurs

```
Cas 1: Pas de critère
1. Cliquez "Rechercher" sans remplir de champ
✅ Message: "Ajoute au moins un critere..."

Cas 2: Erreur API (si vous utilisez un quota dépassé)
1. Si BrixHub retourne une erreur
✅ Message d'erreur s'affiche: "Erreur: ..."

Cas 3: Réseau hors ligne
1. Arrêtez l'internet
2. Cliquez "Rechercher"
✅ Message d'erreur réseau s'affiche
```

---

## Inspection des Logs

### 1. Console du Navigateur (F12)

```javascript
// Pour voir les logs de debug:
F12 → Console

// Vous devriez voir:
✅ Pas d'erreurs rouges
✅ Les appels à /.netlify/functions/search se font
✅ Les réponses JSON s'affichent
```

### 2. Logs de Netlify Dev

```bash
# Dans le terminal où netlify dev tourne:
✅ Logs des functions exécutées
✅ Variables d'environnement chargées
✅ Erreurs côté serveur (s'il y en a)
```

### 3. Vérifier les Headers

```javascript
// Ouvrez la console et lancez une recherche:
F12 → Network → [requête search] → Headers

Vous devriez voir:
✅ Response Headers:
   - X-RateLimit-Limit-Day: 1000
   - X-RateLimit-Remaining-Day: 999 (moins 1)
   - X-RateLimit-Limit-Min: 10
```

---

## Tests Avancés

### Test: Vérifier la clé API

```bash
# Dans le terminal, testez directement:
curl -H "X-API-Key: brix_l_FbKkIDMqLmd0WqWkqeD0Ueqouy6zz2iO5Jv_IQNFazHuLZ" \
     -H "User-Agent: test/1.0" \
     "https://brixhub.net/api/v1/me"

✅ Devrait retourner vos infos de compte
```

### Test: Vérifier la function directement

```bash
# Testez la function directement:
curl -X POST http://localhost:8888/.netlify/functions/search \
     -H "Content-Type: application/json" \
     -d '{"nom_famille": "Dupont", "ville": "Paris"}'

✅ Devrait retourner les résultats JSON
```

---

## Checklist avant déploiement

- [ ] Page se charge sans erreur
- [ ] Navigation fonctionne
- [ ] Formulaire collecte les données correctement
- [ ] Compteur de critères s'incrémente
- [ ] Recherche retourne des résultats
- [ ] Les résultats s'affichent correctement
- [ ] Les erreurs s'affichent si pas de critère
- [ ] Quota restant s'affiche après recherche
- [ ] Pas d'erreurs dans la console
- [ ] Variables d'environnement chargées (netlify dev)
- [ ] X-RateLimit headers présents
- [ ] Responsive design OK (testez sur mobile)

---

## Dépannage

### Erreur: "API key not configured"
```bash
1. Vérifiez que .env existe et contient BRIXHUB_API_KEY
2. Redémarrez netlify dev
3. Vérifiez: echo $BRIXHUB_API_KEY
```

### Erreur: "Function not found"
```bash
1. Vérifiez que netlify/functions/ existe
2. Vérifiez que les .js files existent
3. Vérifiez netlify.toml
4. Redémarrez netlify dev
```

### Erreur: CORS
```bash
# Ce ne devrait pas arriver (géré par Netlify)
# Mais si c'est le cas:
1. Vérifiez que vous appelez /.netlify/functions/ (pas l'API BrixHub directement)
2. Vérifiez les headers de réponse dans Network tab
```

### Erreur: Pas de résultats
```bash
1. Vérifiez votre critère (exact match par défaut)
2. Essayez avec flexible: true (ou cochez si option existe)
3. Testez avec des critères connus
4. Vérifiez votre quota (/.netlify/functions/account)
```

---

## Performance

### Métriques à surveiller

```
Performance ideale:
- Page load: < 2s
- Recherche: < 1s (dépend de BrixHub)
- Affichage des résultats: < 100ms
- Réaction aux clicks: < 100ms
```

### Check Performance (F12)

```
F12 → Performance → Enregistrer → Cliquez "Rechercher" → Stop

Vous devriez voir:
✅ Pas de janks (drops d'images)
✅ Animations fluides
✅ Pas de blocage du thread principal
```

---

## Données de test suggérées

### Exemples de recherche

```
# Recherche très générique (risque de beaucoup de résultats)
Ville: "Paris"

# Recherche moyenne
Nom: "Dupont"
Prenom: "Jean"
Ville: "Paris"

# Recherche très spécifique
Email: "jean.dupont@example.com"

# Recherche par ID
Discord ID: "123456789"
```

### Résultats attendus

```
✅ Vous devriez voir des profils avec:
   - Noms et prénoms
   - Scores de confiance (0-100%)
   - Sources multiples
   - Coordonnées (si disponibles)
```

---

## Après les tests

Si tout fonctionne:

```bash
1. Commitez vos changements
   git add .
   git commit -m "Ready for Netlify deployment"

2. Poussez vers GitHub
   git push origin main

3. Netlify déploiera automatiquement
   Allez vérifier sur https://app.netlify.com

4. Testez en production
   Ouvrez https://<votre-site>.netlify.app
```

---

**Bon testing! 🧪**
