// Detecta automaticamente se está em localhost ou no Render
const API = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : window.location.origin;

const TOKEN_KEY = "token";

// Helper para cabeçalhos de autenticação
function authHeader() {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    "Authorization": `Bearer ${token}`,
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

  try {
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
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Não foi possível conectar ao servidor.");
  }
}

async function loadRecipes() {
  try {
    const res = await fetch(`${API}/recipes`);
    const data = await res.json();

    if (!res.ok) throw new Error("Erro ao carregar receitas");

    const html = data
      .map(
        (recipe) => `
        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <img src="${recipe.image_url || 'https://via.placeholder.com/400x300?text=Sem+Imagem'}" alt="${recipe.title}" class="mb-4 h-48 w-full rounded-3xl object-cover" />
          <div class="mb-4">
            <h3 class="text-xl font-semibold text-slate-900">${recipe.title}</h3>
          </div>
          <button onclick="deleteRecipe(${recipe.id})" class="w-full rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 transition-colors">Deletar</button>
        </article>
      `
      )
      .join("");

    const listElement = document.getElementById("list");
    if (listElement) listElement.innerHTML = html;
  } catch (error) {
    console.error("Erro ao carregar receitas:", error);
  }
}

async function createRecipe() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];

  if (!title || !description) {
    alert("Título e descrição são obrigatórios");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  if (image) {
    formData.append("image", image);
  }

  try {
    const res = await fetch(`${API}/recipes`, {
      method: "POST",
      headers: authHeader(), // Usa o helper de autorização
      body: formData,
    });

    if (res.ok) {
      alert("Receita criada com sucesso!");
      window.location.href = "dashboard.html";
    } else {
      const data = await res.json();
      alert(data.detail || "Erro ao criar receita");
    }
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    alert("Falha na conexão com o servidor.");
  }
}

async function deleteRecipe(id) {
  if (!confirm("Tem certeza que deseja excluir esta receita?")) return;

  try {
    const res = await fetch(`${API}/recipes/${id}`, {
      method: "DELETE",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
    });

    if (res.ok) {
      loadRecipes();
    } else {
      const data = await res.json();
      alert(data.detail || "Erro ao deletar receita");
    }
  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "login.html";
}

// Inicialização baseada na página atual
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  
  if (path.includes("dashboard.html")) {
    ensureAuth();
    loadRecipes();
  }

  if (path.includes("create.html")) {
    ensureAuth();
  }
});
