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
      <div class="p-6">
        <div class="flex items-center justify-between gap-4 mb-4">
          <h2 class="text-xl font-semibold text-slate-900">${recipe.title}</h2>
          <span class="text-orange-500 font-bold">R$ ${recipe.price.toFixed(2)}</span>
        </div>
        <p class="text-sm text-slate-600 mb-4">${recipe.description}</p>
        <a href="https://wa.me/${recipe.whatsapp_number}?text=${encodeURIComponent(recipe.whatsapp_message || `Quero comprar ${recipe.title}`)}" target="_blank" class="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">
          Comprar no WhatsApp
        </a>
      </div>
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
