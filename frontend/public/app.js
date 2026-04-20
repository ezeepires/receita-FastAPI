const API = "http://localhost:8000";

async function fetchRecipes() {
  const response = await fetch(`${API}/recipes`);
  return response.ok ? response.json() : [];
}

function renderRecipes(recipes) {
  const container = document.getElementById("recipes");
  container.innerHTML = recipes.map(recipe => `
    <article class="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
      <img src="${recipe.image_url}" alt="${recipe.title}" class="w-full h-56 object-cover" />
      <div class="p-6 h-auto">
        <div class="flex items-center justify-between gap-4 mb-4">
          <h2 class="text-xl font-semibold text-slate-900">${recipe.title}</h2>
        </div>
        <p class="text-sm text-slate-600 mb-4">${recipe.description}</p>
    </article>
  `).join("");
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
