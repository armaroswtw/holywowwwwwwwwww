# ⚡ Quick Start - yhn'lookup sur Netlify

## 🎯 En 5 minutes

### Step 1: Préparez Git

```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Créez un repo sur GitHub

1. Allez sur [github.com/new](https://github.com/new)
2. Repository name: `yhnlookup`
3. Create repository
4. Copiez les commandes pour pousser:

```bash
git remote add origin https://github.com/VOTRE_USERNAME/yhnlookup.git
git branch -M main
git push -u origin main
```

### Step 3: Déployez sur Netlify

1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez **"New site from Git"**
3. Sélectionnez **GitHub**
4. Autorisez Netlify
5. Sélectionnez le repo **yhnlookup**
6. Cliquez **"Deploy site"**

Netlify commence le déploiement! ⏳

### Step 4: Ajoutez la clé API

Pendant que Netlify déploie:

1. Allez dans le dashboard Netlify
2. Cliquez sur votre site
3. **Site settings** → **Build & deploy** → **Environment**
4. **Edit variables** (ou créez une nouvelle)
5. Ajoutez:
   ```
   BRIXHUB_API_KEY = brix_l_FbKkIDMqLmd0WqWkqeD0Ueqouy6zz2iO5Jv_IQNFazHuLZ
   ```
6. Cliquez **"Save"**

### Step 5: Redéployez

1. Retournez au **Deploys**
2. Cliquez le dernier déploiement
3. Cliquez **"Redeploy"**

✅ **C'est fini!**

---

## 🔗 Votre site est actif!

Netlify vous donne une URL du style:
```
https://xxxxxxxxxxx.netlify.app
```

Ouvrez-la et testez! 🎉

---

## 📋 Fichiers importants

| Fichier | Utilité |
|---------|---------|
| [README.md](README.md) | Documentation complète |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Guide détaillé de déploiement |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Comment ça fonctionne |
| [TESTING.md](TESTING.md) | Tests avant déploiement |

---

## 🧪 Test en local (optionnel)

Si vous voulez tester avant de déployer:

```bash
# 1. Installez Netlify CLI
npm install -g netlify-cli

# 2. Connectez-vous
netlify login

# 3. Lancez le serveur local
netlify dev

# 4. Ouvrez http://localhost:8888
```

---

## ❓ Questions fréquentes

### Combien ça coûte?
Netlify offre:
- **125,000 functions invocations/mois** (gratuit)
- **100 GB bandwidth** (gratuit)
- Votre compte BrixHub détermine le prix

### Où vont mes données?
- Votre navigateur → Netlify → BrixHub
- Rien ne reste sur Netlify (stateless)
- BrixHub stocke selon ses conditions

### Puis-je personnaliser le site?
Oui! Modifiez:
- `styles.css` - Design
- `script.js` - Comportement
- `index.html` - Contenu

### Comment ajouter plus de features?
Créez une nouvelle file dans `netlify/functions/` et appelez-la depuis `script.js`

---

## 🆘 Problèmes?

### Le site ne charge pas
```
1. Vérifiez l'URL (sans typo)
2. Attendez 30-60s (build peut être long)
3. Vérifiez les logs: Site → Deploys → Logs
```

### La recherche ne retourne rien
```
1. Vérifiez votre clé API est définie
2. Vérifiez votre quota: curl vers /.netlify/functions/account
3. Testez avec des critères moins stricts
```

### Erreur CORS ou autre
```
1. Ouvrez F12 → Console
2. Vérifiez le message d'erreur
3. Consultez TESTING.md pour le dépannage
```

---

## 📞 Support

- **API BrixHub**: contact@brixhub.net
- **Netlify**: support@netlify.com
- **Ce projet**: Consultez README.md et ARCHITECTURE.md

---

## ✨ Prochaines étapes

Après déploiement:

1. **Partagez votre site**
   ```
   https://<votre-site>.netlify.app
   ```

2. **Personnalisez-le**
   - Changez les couleurs dans styles.css
   - Ajoutez des champs supplémentaires
   - Intégrez d'autres APIs

3. **Monitoez les quotas**
   - Vérifiez régulièrement votre consommation BrixHub
   - Optimisez vos requêtes si nécessaire

4. **Invitez d'autres développeurs**
   - Pushez le code vers GitHub
   - Ajoutez des collaborateurs
   - Travaillez en équipe

---

**Bienvenue sur yhn'lookup! 🚀**

*Mise à jour: Juin 2026*
