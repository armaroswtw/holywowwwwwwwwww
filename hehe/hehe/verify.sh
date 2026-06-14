#!/bin/bash

# 🔍 Vérification des fichiers de configuration

echo "📋 Vérification de la structure du projet..."
echo ""

# Vérifier les fichiers essentiels
files=(
  "index.html"
  "script.js"
  "styles.css"
  "netlify.toml"
  ".env"
  ".env.example"
  ".gitignore"
  "README.md"
  "DEPLOYMENT.md"
  "netlify/functions/search.js"
  "netlify/functions/lookup.js"
  "netlify/functions/account.js"
)

missing_files=()

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - MANQUANT"
    missing_files+=("$file")
  fi
done

echo ""
if [ ${#missing_files[@]} -eq 0 ]; then
  echo "✅ Tous les fichiers sont présents!"
else
  echo "❌ Des fichiers manquent:"
  for file in "${missing_files[@]}"; do
    echo "   - $file"
  done
  exit 1
fi

# Vérifier la clé API
echo ""
echo "🔐 Vérification de la clé API..."
if grep -q "BRIXHUB_API_KEY=brix_" .env; then
  echo "✅ Clé API trouvée dans .env"
else
  echo "❌ Clé API non trouvée ou vide dans .env"
  exit 1
fi

# Vérifier netlify.toml
echo ""
echo "⚙️  Vérification de netlify.toml..."
if grep -q "netlify/functions" netlify.toml; then
  echo "✅ Fonctions Netlify configurées"
else
  echo "❌ Configuration des fonctions incomplète"
  exit 1
fi

# Vérifier les imports
echo ""
echo "📦 Vérification des scripts..."
if grep -q "/.netlify/functions/" script.js; then
  echo "✅ Appels à Netlify functions trouvés"
else
  echo "❌ Pas d'appels à Netlify functions détectés"
  exit 1
fi

echo ""
echo "🎉 Vérification complète: OK!"
echo ""
echo "Prochaines étapes:"
echo "1. Testez localement: netlify dev"
echo "2. Poussez vers Git: git push"
echo "3. Netlify déploiera automatiquement"
echo "4. Vérifiez les variables d'environnement sur Netlify"
echo "5. Profitez! 🚀"
