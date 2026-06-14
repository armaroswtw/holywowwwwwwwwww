# 🔍 Vérification des fichiers de configuration (PowerShell)

Write-Host "📋 Vérification de la structure du projet..." -ForegroundColor Cyan
Write-Host ""

# Vérifier les fichiers essentiels
$files = @(
  "index.html",
  "script.js",
  "styles.css",
  "netlify.toml",
  ".env",
  ".env.example",
  ".gitignore",
  "README.md",
  "DEPLOYMENT.md",
  "netlify/functions/search.js",
  "netlify/functions/lookup.js",
  "netlify/functions/account.js"
)

$missing_files = @()

foreach ($file in $files) {
  if (Test-Path $file) {
    Write-Host "✅ $file" -ForegroundColor Green
  } else {
    Write-Host "❌ $file - MANQUANT" -ForegroundColor Red
    $missing_files += $file
  }
}

Write-Host ""
if ($missing_files.Count -eq 0) {
  Write-Host "✅ Tous les fichiers sont présents!" -ForegroundColor Green
} else {
  Write-Host "❌ Des fichiers manquent:" -ForegroundColor Red
  foreach ($file in $missing_files) {
    Write-Host "   - $file" -ForegroundColor Red
  }
  exit 1
}

# Vérifier la clé API
Write-Host ""
Write-Host "🔐 Vérification de la clé API..." -ForegroundColor Cyan
$env_content = Get-Content .env -ErrorAction SilentlyContinue
if ($env_content -match "BRIXHUB_API_KEY=brix_") {
  Write-Host "✅ Clé API trouvée dans .env" -ForegroundColor Green
} else {
  Write-Host "❌ Clé API non trouvée ou vide dans .env" -ForegroundColor Red
  exit 1
}

# Vérifier netlify.toml
Write-Host ""
Write-Host "⚙️  Vérification de netlify.toml..." -ForegroundColor Cyan
$toml_content = Get-Content netlify.toml
if ($toml_content -match "netlify/functions") {
  Write-Host "✅ Fonctions Netlify configurées" -ForegroundColor Green
} else {
  Write-Host "❌ Configuration des fonctions incomplète" -ForegroundColor Red
  exit 1
}

# Vérifier les imports
Write-Host ""
Write-Host "📦 Vérification des scripts..." -ForegroundColor Cyan
$js_content = Get-Content script.js
if ($js_content -match "/.netlify/functions/") {
  Write-Host "✅ Appels à Netlify functions trouvés" -ForegroundColor Green
} else {
  Write-Host "❌ Pas d'appels à Netlify functions détectés" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "🎉 Vérification complète: OK!" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Testez localement: netlify dev" -ForegroundColor Yellow
Write-Host "2. Poussez vers Git: git push" -ForegroundColor Yellow
Write-Host "3. Netlify déploiera automatiquement" -ForegroundColor Yellow
Write-Host "4. Vérifiez les variables d'environnement sur Netlify" -ForegroundColor Yellow
Write-Host "5. Profitez! 🚀" -ForegroundColor Yellow
