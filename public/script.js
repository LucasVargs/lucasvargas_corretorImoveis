const grid = document.getElementById("property-grid");
const emptyState = document.getElementById("empty-state");

const formatCurrency = (value) => {
  if (!value) return "Sob consulta";
  const number = Number(value);
  if (Number.isNaN(number)) return "Sob consulta";
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
};

const fetchProperties = async () => {
  try {
    const response = await fetch("/api/properties");
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
};

const render = async () => {
  const properties = await fetchProperties();
  grid.innerHTML = "";

  if (properties.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  properties.forEach((property) => {
    const card = document.createElement("article");
    card.className = "property-card";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "property-image";

    if (property.image) {
      const image = document.createElement("img");
      image.src = property.image;
      image.alt = property.title || "Imóvel";
      imageWrapper.appendChild(image);
    } else {
      imageWrapper.textContent = "Imagem em breve";
    }

    const content = document.createElement("div");
    content.className = "property-content";

    const title = document.createElement("div");
    title.className = "property-title";
    title.textContent = property.title || "Imóvel";

    const meta = document.createElement("div");
    meta.className = "property-meta";
    meta.innerHTML = `
      <span>${property.type || "Residencial"}</span>
      <span>${property.location || "Localização"}</span>
      <span>${property.area ? property.area + " m²" : "Área"} </span>
      <span>${property.beds ? property.beds + " quartos" : "Quartos"}</span>
    `;

    const price = document.createElement("div");
    price.className = "property-price";
    price.textContent = formatCurrency(property.price);

    content.append(title, meta, price);
    card.append(imageWrapper, content);
    grid.appendChild(card);
  });
};

render();
