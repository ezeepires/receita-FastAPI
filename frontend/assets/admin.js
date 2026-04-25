const API = "http://localhost:8000";
const TOKEN_KEY = "token";

function authHeader() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
  };
}

function ensureAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.href = "login.html";
  }
}

async function login() {
  const username = document.getElementById("user").value;
  const password = document.getElementById("pass").value;

  const res = await fetch(`${API}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok && data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
    window.location.href = "dashboard.html";
  } else {
    alert(data.detail || "Erro ao autenticar");
  }
}

async function loadRecipes() {
  const res = await fetch(`${API}/recipes`);
  const data = await res.json();

  const html = data
    .map(
      (recipe) => `
      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <img src="${recipe.image_url}" alt="${recipe.title}" class="mb-4 h-48 w-full rounded-3xl object-cover" />
        <div class="mb-4">
          <h3 class="text-xl font-semibold text-slate-900">${recipe.title}</h3>
          
        </div>
        <button onclick="deleteRecipe(${recipe.id})" class="w-full rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600">Deletar</button>
      </article>
    `
    )
    .join("");

  document.getElementById("list").innerHTML = html;
}

async function createRecipe() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  if (image) {
    formData.append("image", image);
  }

  const res = await fetch(`${API}/recipes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
    },
    body: formData,
  });

  if (res.ok) {
    alert("Receita criada com sucesso!");
    window.location.href = "dashboard.html";
  } else {
    const data = await res.json();
    alert(data.detail || "Erro ao criar receita");
  }
}

async function deleteRecipe(id) {
  const res = await fetch(`${API}/recipes/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (res.ok) {
    loadRecipes();
  } else {
    const data = await res.json();
    alert(data.detail || "Erro ao deletar receita");
  }
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "login.html";
}

if (window.location.pathname.endsWith("dashboard.html")) {
  ensureAuth();
  loadRecipes();
}

if (window.location.pathname.endsWith("create.html")) {
  ensureAuth();
}

