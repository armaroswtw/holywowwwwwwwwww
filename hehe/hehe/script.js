const navLinks = document.querySelectorAll(".main-nav a");
const launchBtn = document.getElementById("launchBtn");
const shell = document.querySelector(".shell");
const viewFx = document.querySelector(".view-fx");
const irisTransition = document.querySelector(".iris-transition");
const eyeWrap = document.querySelector(".eye-wrap");
const discordBtn = document.getElementById("discordBtn");
const telegramBtn = document.getElementById("telegramBtn");
const feedback = document.getElementById("feedback");
const homeView = document.getElementById("homeView");
const searchView = document.getElementById("searchView");
const searchRunBtn = document.getElementById("searchRunBtn");
const searchClearBtn = document.getElementById("searchClearBtn");
const searchFeedback = document.getElementById("searchFeedback");
const criteriaCount = document.getElementById("criteriaCount");
const searchInputs = Array.from(document.querySelectorAll(".search-grid input"));
const categoryBlocks = document.querySelectorAll(".category-block");
const eyeIris = document.getElementById("eyeIris");
const eyePupil = document.getElementById("eyePupil");
const eyeShine = document.getElementById("eyeShine");
const eyeShineSub = document.getElementById("eyeShineSub");
const eyeScanner = document.getElementById("eyeScanner");

const API_BASE_URL = String((window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || "").replace(/\/$/, "");

function getApiUrl(path) {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${path}`;
  }
  return `/.netlify/functions${path}`;
}

const eyeBase = {
  irisX: 180,
  irisY: 64,
  pupilR: 8.3,
  shineX: 173,
  shineY: 57,
  shineSubX: 186,
  shineSubY: 69,
  scannerRx: 52
};
const eyeState = { targetX: 0, targetY: 0, x: 0, y: 0 };
const viewMap = {
  home: homeView,
  search: searchView
};

let currentView = "home";
const eyeTuning = {
  rangeX: 14,
  rangeY: 10,
  glowX: 2.8,
  glowY: 2.2,
  tiltX: 0.95,
  tiltY: 1.2,
  followSpeed: 0.26
};

function isHomeVisible() {
  return !homeView.classList.contains("is-hidden");
}

function onHeroMove(event) {
  if (!isHomeVisible()) {
    return;
  }

  const rect = homeView.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height * 0.36;
  const nx = (event.clientX - cx) / (rect.width * 0.5);
  const ny = (event.clientY - cy) / (rect.height * 0.5);

  eyeState.targetX = Math.max(-1, Math.min(1, nx)) * eyeTuning.rangeX;
  eyeState.targetY = Math.max(-1, Math.min(1, ny)) * eyeTuning.rangeY;

  homeView.style.setProperty("--mx", `${eyeState.targetX * eyeTuning.glowX}px`);
  homeView.style.setProperty("--my", `${eyeState.targetY * eyeTuning.glowY}px`);
  homeView.style.setProperty("--erx", `${-eyeState.targetY * eyeTuning.tiltX}deg`);
  homeView.style.setProperty("--ery", `${eyeState.targetX * eyeTuning.tiltY}deg`);
}

function resetHeroEye() {
  eyeState.targetX = 0;
  eyeState.targetY = 0;
  homeView.style.setProperty("--mx", "0px");
  homeView.style.setProperty("--my", "0px");
  homeView.style.setProperty("--erx", "0deg");
  homeView.style.setProperty("--ery", "0deg");
}

function animateEye() {
  eyeState.x += (eyeState.targetX - eyeState.x) * eyeTuning.followSpeed;
  eyeState.y += (eyeState.targetY - eyeState.y) * eyeTuning.followSpeed;
  const magnitude = Math.min(1, Math.hypot(eyeState.x, eyeState.y) / 14);

  eyeIris.setAttribute("cx", String(eyeBase.irisX + eyeState.x));
  eyeIris.setAttribute("cy", String(eyeBase.irisY + eyeState.y));

  eyePupil.setAttribute("cx", String(eyeBase.irisX + eyeState.x * 1.3));
  eyePupil.setAttribute("cy", String(eyeBase.irisY + eyeState.y * 1.3));
  eyePupil.setAttribute("r", String(eyeBase.pupilR + magnitude * 1.8));

  eyeShine.setAttribute("cx", String(eyeBase.shineX + eyeState.x * 1.1));
  eyeShine.setAttribute("cy", String(eyeBase.shineY + eyeState.y * 1.1));
  eyeShineSub.setAttribute("cx", String(eyeBase.shineSubX + eyeState.x * 0.85));
  eyeShineSub.setAttribute("cy", String(eyeBase.shineSubY + eyeState.y * 0.85));

  eyeScanner.setAttribute("rx", String(eyeBase.scannerRx + magnitude * 7));

  requestAnimationFrame(animateEye);
}

homeView.addEventListener("mousemove", onHeroMove);
homeView.addEventListener("mouseleave", resetHeroEye);
animateEye();

categoryBlocks.forEach((block) => {
  const toggle = block.querySelector(".category-toggle");
  const body = block.querySelector(".category-body");
  const chevron = block.querySelector(".category-chevron");

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    body.classList.toggle("hidden", isOpen);
    block.classList.toggle("is-open", !isOpen);
    chevron.textContent = isOpen ? "v" : "^";
  });
});

function getFilledCriteriaCount() {
  return searchInputs.filter((input) => input.value.trim().length > 0).length;
}

function updateCriteriaCounter() {
  const filled = getFilledCriteriaCount();
  criteriaCount.textContent = `${filled} critere${filled > 1 ? "s" : ""}`;
}

function switchView(target) {
  if (!Object.prototype.hasOwnProperty.call(viewMap, target)) {
    return;
  }

  if (target === currentView) {
    return;
  }

  const fromView = viewMap[currentView];
  const toView = viewMap[target];

  // Reset any previous transient animation styles/classes, then switch instantly.
  shell.classList.remove("is-switching", "switch-to-search", "switch-to-home");
  fromView.classList.remove("is-entering", "is-leaving", "is-active");
  toView.classList.remove("is-entering", "is-leaving");

  fromView.style.transition = "";
  toView.style.transition = "";
  fromView.style.opacity = "";
  fromView.style.transform = "";
  fromView.style.filter = "";
  toView.style.opacity = "";
  toView.style.transform = "";
  toView.style.filter = "";

  fromView.classList.add("is-hidden");
  toView.classList.remove("is-hidden");
  toView.classList.add("is-active");
  currentView = target;
}

homeView.classList.add("is-active");

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");

    const targetView = link.dataset.view;
    if (targetView) {
      switchView(targetView);
    }

    feedback.textContent = `Navigation active: ${link.textContent}.`;
  });
});

launchBtn.addEventListener("click", () => {
  switchView("search");
  navLinks.forEach((item) => item.classList.remove("active"));
  const searchLink = document.querySelector('.main-nav a[data-view="search"]');
  if (searchLink) {
    searchLink.classList.add("active");
  }
  feedback.textContent = "Recherche prete: module ouvert.";
});

discordBtn.addEventListener("click", () => {
  feedback.textContent = "Redirection vers Discord en preparation.";
});

telegramBtn.addEventListener("click", () => {
  feedback.textContent = "Redirection vers Telegram en preparation.";
});

searchRunBtn.addEventListener("click", async () => {
  const filled = getFilledCriteriaCount();
  if (!filled) {
    searchFeedback.textContent = "Ajoute au moins un critere pour lancer une recherche.";
    return;
  }

  searchRunBtn.disabled = true;
  searchFeedback.textContent = `Recherche lancee avec ${filled} critere${filled > 1 ? "s" : ""}...`;

  // Mapper les IDs des champs aux clés de l'API
  const fieldMapping = {
    fNom: "nom_famille",
    fPrenom: "prenom",
    fNomNaissance: "nom_naissance",
    fNomAffiche: "nom_affichage",
    fDateNaissance: "date_naissance",
    fAnneeNaissance: "annee_naissance",
    fLieuNaissance: "lieu_naissance",
    fEmail: "email",
    fTel: "telephone",
    fUser: "nom_utilisateur",
    fIp: "adresse_ip",
    fAdresse: "adresse",
    fCodePostal: "code_postal",
    fVille: "ville",
    fDepartement: "departement",
    fDiscord: "discord_id",
    fLicense: "fivem_license",
    fSteam: "steam_id"
  };

  // Construire la requête
  const payload = {};
  Object.entries(fieldMapping).forEach(([fieldId, apiKey]) => {
    const input = document.getElementById(fieldId);
    if (input && input.value.trim()) {
      payload[apiKey] = input.value.trim();
    }
  });

  try {
    const response = await fetch(getApiUrl("/search"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      searchFeedback.textContent = `Erreur: ${data.error || "Erreur inconnue"}`;
      searchRunBtn.disabled = false;
      return;
    }

    // Afficher les résultats
    displayResults(data);

    // Afficher les stats
    const remaining = response.headers.get("X-RateLimit-Remaining-Day");
    if (remaining) {
      searchFeedback.textContent = `Recherche complete. Requetes restantes: ${remaining}`;
    }
  } catch (error) {
    console.error("Error:", error);
    searchFeedback.textContent = `Erreur: ${error.message}`;
  } finally {
    searchRunBtn.disabled = false;
  }
});

function displayResults(data) {
  const resultsContainer = document.getElementById("resultsContainer");
  const resultsList = document.getElementById("resultsList");
  const resultsStats = document.getElementById("resultsStats");

  if (!data.data || !data.data.results || data.data.results.length === 0) {
    resultsList.innerHTML = "<p>Aucun resultat trouve.</p>";
    resultsStats.innerHTML = "";
    resultsContainer.classList.remove("hidden");
    return;
  }

  // Afficher les résultats
  resultsList.innerHTML = data.data.results
    .map((result) => `
      <div class="result-card">
        <div class="result-header">
          <h4>${result.prenom || ""} ${result.nom_famille || ""}</h4>
          <span class="confidence-badge">Confiance: ${result._confidence || 0}%</span>
        </div>
        <div class="result-body">
          ${result.email ? `<p><strong>Email:</strong> ${result.email}</p>` : ""}
          ${result.telephone ? `<p><strong>Telephone:</strong> ${result.telephone}</p>` : ""}
          ${result.adresse ? `<p><strong>Adresse:</strong> ${result.adresse}</p>` : ""}
          ${result.code_postal ? `<p><strong>Code postal:</strong> ${result.code_postal}</p>` : ""}
          ${result.ville ? `<p><strong>Ville:</strong> ${result.ville}</p>` : ""}
          ${result._sources ? `<p><strong>Sources:</strong> ${result._sources.join(", ")}</p>` : ""}
        </div>
      </div>
    `)
    .join("");

  // Afficher les stats
  const meta = data.meta || {};
  resultsStats.innerHTML = `
    <div class="stats">
      <p>Total: ${meta.total || 0} resultats | Page: ${meta.page || 1}/${meta.pages || 1} | Temps: ${meta.took_ms || 0}ms</p>
    </div>
  `;

  resultsContainer.classList.remove("hidden");
}

searchClearBtn.addEventListener("click", () => {
  searchInputs.forEach((input) => {
    input.value = "";
  });
  updateCriteriaCounter();
  searchFeedback.textContent = "Champs effaces.";
});

searchInputs.forEach((input) => {
  input.addEventListener("input", () => {
    updateCriteriaCounter();
  });
});

updateCriteriaCounter();
