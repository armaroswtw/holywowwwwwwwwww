# 🚀 Guide de Déploiement Rapide sur Netlify

## 5 étapes simples pour déployer

### 1️⃣ Préparez votre repo Git

```bash
# Initialisez Git si ce n'est pas déjà fait
git init

# Ajoutez tous les fichiers
git add .

# Committez
git commit -m "Initial commit: yhn'lookup with BrixHub API"

# Créez un repo sur GitHub/GitLab/Bitbucket
# Puis pushez
git remote add origin <votre-repo-url>
git push -u origin main
```

### 2️⃣ Connectez Netlify à votre repo

1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez sur **"New site from Git"**
3. Sélectionnez votre provider (GitHub, GitLab, Bitbucket)
4. Authorisez Netlify
5. Sélectionnez votre repo `hehe`
6. Cliquez **"Deploy site"**

### 3️⃣ Ajoutez la variable d'environnement

1. Une fois déployé, allez dans **Site settings**
2. Allez dans **Build & deploy** → **Environment**
3. Cliquez **"Edit variables"**
4. Ajoutez:
   ```
   Key: BRIXHUB_API_KEY
   Value: brix_l_FbKkIDMqLmd0WqWkqeD0Ueqouy6zz2iO5Jv_IQNFazHuLZ
   ```
5. Sauvegardez

### 4️⃣ Redéployez

1. Retournez dans votre dashboard Netlify
2. Allez dans **Deploys**
3. Cliquez sur le dernier déploiement
4. Cliquez **"Redeploy"**

### 5️⃣ C'est prêt! 🎉

Votre site est maintenant actif sur Netlify avec:
- ✅ Interface yhn'lookup complète
- ✅ Fonctions serverless pour l'API BrixHub
- ✅ Recherche multi-critères
- ✅ Gestion des quotas
- ✅ HTTPS sécurisé

---

## Alternative: Déploiement avec CLI

```bash
# Installez Netlify CLI
npm install -g netlify-cli

# Connectez-vous
netlify login

# Liez votre site
netlify init

# Déployez
netlify deploy --prod
```

---

## Alternative: Drag & Drop (Plus rapide!)

1. Zippez votre dossier `hehe/`
2. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop)
3. Déposez le fichier zip
4. Allez dans **Site settings** → **Environment**
5. Ajoutez la clé API
6. Attendez le redéploiement

---

## Vérification

Après déploiement, testez:

1. Ouvrez votre site Netlify
2. Allez à **Recherche**
3. Entrez un critère (ex: "Paris" dans Ville)
4. Cliquez **Rechercher**
5. Vous devriez voir les résultats!

---

## 🔗 URLs Utiles

- **Dashboard Netlify**: https://app.netlify.com
- **Console Netlify** (logs): Site settings → Deploys → Logs
- **Docs API BrixHub**: https://brixhub.net/api/v1/docs
- **Health Check**: https://<votre-site>.netlify.app/.netlify/functions/account

---

## ⚠️ Important

- **NE COMMITEZ JAMAIS** le fichier `.env` (il est dans `.gitignore`)
- La clé API doit être définie dans Netlify (pas dans le code)
- Vérifiez les logs si quelque chose ne fonctionne pas

```
Logs Netlify:
Site settings → Deployments → [Dernier déploiement] → Logs
```

---

## 🆘 Si ça ne fonctionne pas

### Vérifiez:
1. La variable d'environnement est définie ✅
2. Vous avez cliqué "Redeploy" après ajouter la clé ✅
3. Votre clé API est valide ✅
4. Les logs ne montrent pas d'erreur ✅

### Cherchez les erreurs:
- Ouvrez les **Developer Tools** (F12)
- Allez dans **Console** et **Network**
- Vérifiez les appels à `/.netlify/functions/search`

---

**Bon déploiement! 🚀**
