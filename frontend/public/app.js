const API = "http://localhost:8000";

async function fetchRecipes() {
  const response = await fetch(`${API}/recipes`);
  return response.ok ? response.json() : [];
}

function renderRecipes(recipes) {
  const container = document.getElementById("recipes");
  const emptyState = document.getElementById("empty-state");
  
  if (!recipes || recipes.length === 0) {
    container.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }
  
  emptyState.classList.add("hidden");
  
  container.innerHTML = recipes.map((recipe, index) => {
    const maxChars = 120;
    const isLong = recipe.description.length > maxChars;
    const shortDesc = isLong 
      ? recipe.description.substring(0, maxChars) + "..." 
      : recipe.description;
    
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
          <p class="text-sm text-slate-600 mb-4 whitespace-pre-line full-desc hidden leading-relaxed">${recipe.description.replace(/\\n/g, '\n')}</p>
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
    recipe.title.toLowerCase().includes(lowerQuery) ||
    recipe.description.toLowerCase().includes(lowerQuery)
  );
}

async function initPage() {
  const recipes = await fetchRecipes();
  const search = document.getElementById("search");

  renderRecipes(recipes);

  search.addEventListener("input", () => {
    renderRecipes(filterRecipes(recipes, search.value));
  });
}

window.addEventListener("DOMContentLoaded", initPage);
