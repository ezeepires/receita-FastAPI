// Detecta automaticamente se está em produção ou desenvolvimento
const API = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : window.location.origin;

async function fetchRecipes() {
  try {
    const response = await fetch(`${API}/recipes`);
    // Se a resposta for ok (200), retorna o JSON, senão retorna lista vazia
    if (!response.ok) {
      console.error("Erro na resposta da API:", response.status);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar receitas (Verifique se o backend está rodando):", error);
    return [];
  }
}

function renderRecipes(recipes) {
  const container = document.getElementById("recipes");
  const emptyState = document.getElementById("empty-state");
  
  if (!recipes || recipes.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }
  
  if (emptyState) emptyState.classList.add("hidden");
  
  container.innerHTML = recipes.map((recipe, index) => {
    const maxChars = 120;
    // Garante que a descrição existe para evitar erro de .length
    const desc = recipe.description || "";
    const isLong = desc.length > maxChars;
    const shortDesc = isLong 
      ? desc.substring(0, maxChars) + "..." 
      : desc;
    
    const imageStyle = recipe.image_url 
      ? `background-image: url('${recipe.image_url}'); background-size: cover; background-position: center;`
      : `background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);`;
    
    return `
    <article class="recipe-card fade-in bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100" style="animation-delay: ${index * 0.1}s">
      <div class="h-56 w-full relative" style="${imageStyle}">
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      <div class="p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-3 line-clamp-2">${recipe.title}</h2>
        <div class="recipe-content">
          <p class="text-sm text-slate-600 mb-4 whitespace-pre-line short-desc leading-relaxed">${shortDesc.replace(/\\n/g, '\n')}</p>
          <p class="text-sm text-slate-600 mb-4 whitespace-pre-line full-desc hidden leading-relaxed">${desc.replace(/\\n/g, '\n')}</p>
          ${isLong ? `<button class="text-orange-500 font-semibold text-sm hover:underline toggle-btn" onclick="toggleRecipe(this)">Ver tudo</button>` : ''}
        </div>
      </div>
    </article>
  `}).join("");
}

function toggleRecipe(btn) {
  const content = btn.parentElement;
  const shortDesc = content.querySelector(".short-desc");
  const fullDesc = content.querySelector(".full-desc");
  
  if (fullDesc.classList.contains("hidden")) {
    shortDesc.classList.add("hidden");
    fullDesc.classList.remove("hidden");
    btn.textContent = "Ver menos";
  } else {
    shortDesc.classList.remove("hidden");
    fullDesc.classList.add("hidden");
    btn.textContent = "Ver tudo";
  }
}

function filterRecipes(recipes, query) {
  if (!query) return recipes;
  const lowerQuery = query.toLowerCase();
  return recipes.filter(recipe =>
    (recipe.title && recipe.title.toLowerCase().includes(lowerQuery)) ||
    (recipe.description && recipe.description.toLowerCase().includes(lowerQuery))
  );
}

async function initPage() {
  const recipes = await fetchRecipes();
  const search = document.getElementById("search");

  renderRecipes(recipes);

  if (search) {
    search.addEventListener("input", () => {
      renderRecipes(filterRecipes(recipes, search.value));
    });
  }
}

window.addEventListener("DOMContentLoaded", initPage);