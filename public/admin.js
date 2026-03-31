const form = document.getElementById("property-form");
const list = document.getElementById("property-list");
const emptyAdmin = document.getElementById("empty-admin");
const clearAll = document.getElementById("clear-all");
const cancelBtn = document.getElementById("cancel-btn");
const loginCard = document.getElementById("login-card");
const loginBtn = document.getElementById("login-btn");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginError = document.getElementById("login-error");

const fields = {
  id: document.getElementById("property-id"),
  title: document.getElementById("title"),
  type: document.getElementById("type"),
  location: document.getElementById("location"),
  price: document.getElementById("price"),
  area: document.getElementById("area"),
  beds: document.getElementById("beds"),
  image: document.getElementById("image"),
};

const getToken = () => localStorage.getItem("lv_token");
const setToken = (token) => localStorage.setItem("lv_token", token);
const clearToken = () => localStorage.removeItem("lv_token");

const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(path, { ...options, headers });
  if (response.status === 401) {
    clearToken();
    toggleLogin(true);
  }
  return response;
};

const resetForm = () => {
  fields.id.value = "";
  fields.title.value = "";
  fields.type.value = "";
  fields.location.value = "";
  fields.price.value = "";
  fields.area.value = "";
  fields.beds.value = "";
  fields.image.value = "";
  cancelBtn.style.display = "none";
};

const renderList = async () => {
  const response = await apiFetch("/api/properties");
  const properties = response.ok ? await response.json() : [];
  list.innerHTML = "";

  if (properties.length === 0) {
    emptyAdmin.style.display = "block";
    return;
  }

  emptyAdmin.style.display = "none";

  properties.forEach((property) => {
    const item = document.createElement("div");
    item.className = "property-item";
    item.innerHTML = `
      <div class="property-item-header">
        <h3>${property.title || "Imovel"}</h3>
        <small>${property.type || "Residencial"}</small>
      </div>
      <small>${property.location || "Localizacao nao informada"}</small>
      <small>${property.area ? property.area + " m2" : "Area nao informada"}</small>
      <div class="item-actions">
        <button data-action="edit" data-id="${property.id}">Editar</button>
        <button class="delete" data-action="delete" data-id="${property.id}">Excluir</button>
      </div>
    `;
    list.appendChild(item);
  });
};

const upsertProperty = async (payload) => {
  const isEdit = Boolean(payload.id);
  const path = isEdit ? `/api/properties/${payload.id}` : "/api/properties";
  const method = isEdit ? "PUT" : "POST";

  const response = await apiFetch(path, {
    method,
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    await renderList();
    resetForm();
  }
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = {
    id: fields.id.value || null,
    title: fields.title.value.trim(),
    type: fields.type.value.trim(),
    location: fields.location.value.trim(),
    price: fields.price.value.trim(),
    area: fields.area.value.trim(),
    beds: fields.beds.value.trim(),
    image: fields.image.value.trim(),
  };

  upsertProperty(payload);
});

list.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;
  const response = await apiFetch("/api/properties");
  const properties = response.ok ? await response.json() : [];
  const property = properties.find((item) => String(item.id) === String(id));

  if (!property) return;

  if (action === "edit") {
    fields.id.value = property.id;
    fields.title.value = property.title || "";
    fields.type.value = property.type || "";
    fields.location.value = property.location || "";
    fields.price.value = property.price || "";
    fields.area.value = property.area || "";
    fields.beds.value = property.beds || "";
    fields.image.value = property.image || "";
    cancelBtn.style.display = "inline-flex";
  }

  if (action === "delete") {
    const deleteResponse = await apiFetch(`/api/properties/${id}`, {
      method: "DELETE",
    });
    if (deleteResponse.ok) {
      await renderList();
      resetForm();
    }
  }
});

clearAll.addEventListener("click", async () => {
  const response = await apiFetch("/api/properties");
  const properties = response.ok ? await response.json() : [];
  await Promise.all(
    properties.map((item) =>
      apiFetch(`/api/properties/${item.id}`, { method: "DELETE" })
    )
  );
  await renderList();
  resetForm();
});

cancelBtn.addEventListener("click", resetForm);

const toggleLogin = (show) => {
  loginCard.style.display = show ? "grid" : "none";
  form.style.display = show ? "none" : "grid";
  list.parentElement.style.display = show ? "none" : "grid";
  clearAll.style.display = show ? "none" : "inline-flex";
};

loginBtn.addEventListener("click", async () => {
  loginError.textContent = "";
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    loginError.textContent = "Email ou senha incorretos.";
    return;
  }

  const data = await response.json();
  setToken(data.token);
  toggleLogin(false);
  renderList();
});

const init = () => {
  resetForm();
  if (getToken()) {
    toggleLogin(false);
    renderList();
  } else {
    toggleLogin(true);
  }
};

init();
