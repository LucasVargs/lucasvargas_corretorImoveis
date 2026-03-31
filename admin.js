const storageKey = "lv_properties";

const form = document.getElementById("property-form");
const list = document.getElementById("property-list");
const emptyAdmin = document.getElementById("empty-admin");
const clearAll = document.getElementById("clear-all");
const cancelBtn = document.getElementById("cancel-btn");

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

const getProperties = () => {
  const data = localStorage.getItem(storageKey);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveProperties = (properties) => {
  localStorage.setItem(storageKey, JSON.stringify(properties));
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

const renderList = () => {
  const properties = getProperties();
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
        <h3>${property.title || "Imóvel"}</h3>
        <small>${property.type || "Residencial"}</small>
      </div>
      <small>${property.location || "Localização não informada"}</small>
      <small>${property.area ? property.area + " m²" : "Área não informada"}</small>
      <div class="item-actions">
        <button data-action="edit" data-id="${property.id}">Editar</button>
        <button class="delete" data-action="delete" data-id="${property.id}">Excluir</button>
      </div>
    `;
    list.appendChild(item);
  });
};

const upsertProperty = (payload) => {
  const properties = getProperties();
  const index = properties.findIndex((item) => item.id === payload.id);

  if (index >= 0) {
    properties[index] = payload;
  } else {
    properties.unshift(payload);
  }

  saveProperties(properties);
  renderList();
  resetForm();
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = {
    id: fields.id.value || crypto.randomUUID(),
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

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;
  const properties = getProperties();
  const property = properties.find((item) => item.id === id);

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
    const filtered = properties.filter((item) => item.id !== id);
    saveProperties(filtered);
    renderList();
    resetForm();
  }
});

clearAll.addEventListener("click", () => {
  saveProperties([]);
  renderList();
  resetForm();
});

cancelBtn.addEventListener("click", resetForm);

resetForm();
renderList();
