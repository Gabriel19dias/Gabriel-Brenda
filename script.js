document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('./python/produtos.json');

    if (!response.ok) throw new Error('Erro ao carregar produtos.json');
    const produtosExcel = await response.json();

    const products = produtosExcel.map(p => ({
      name: p.Nome || "Produto sem nome",
      price: Number(
        (p.Preço || "0").replace("R$", "").replace(".", "").replace(",", ".")
      ) || 0,
      category: p.Categoria || "outros",
      img: p.Imagem || "images/default.jpg",
      link: p.Link || "#"
    }));

    const grid = document.getElementById('gift-grid');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');

    function renderProducts(list) {
      grid.innerHTML = '';

      if (list.length === 0) {
        grid.innerHTML = '<p class="no-results">Nenhum presente encontrado.</p>';
        return;
      }

      list.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
          <img src="${product.img}" alt="${product.name}">
          <div class="card-body">
            <h3 class="product-name">${product.name}</h3>
            <div class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            <a class="btn" href="${product.link}" target="_blank" rel="noopener noreferrer">Presentear</a>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function filterProducts() {
      const search = searchInput.value.trim().toLowerCase();
      const category = categoryFilter.value;

      const filtered = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(search);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesName && matchesCategory;
      });

      renderProducts(filtered);
    }

    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);

    renderProducts(products);

  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    const grid = document.getElementById('gift-grid');
    grid.innerHTML = '<p class="no-results">Erro ao carregar os presentes.</p>';
  }
});
