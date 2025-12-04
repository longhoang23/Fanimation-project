let products = [];
let filteredList = [];
let currentPage = 1;
const perPage = 6;

function formatCurrency(num) {
  return num.toLocaleString("vi-VN") + "đ";
}

/* ================= PRODUCT DATA ================= */
fetch("assets/data/products2.json")
  .then((res) => res.json())
  .then((data) => {
    // Tạo bảng brand_id -> brand_name
    const brandMap = {};
    data.brands.forEach((b) => (brandMap[b.id] = b.name));

    // Đẩy tất cả product vào mảng chính
    data.categories.forEach((cat) => {
      cat.products.forEach((p) => {
        products.push({
          ...p,
          category: cat.name,
          brand: brandMap[p.brand_id], // <--- thêm tên brand
        });
      });
    });

    filteredList = products;
    renderProducts(products);
  });

/* ================= PAGINATION ================= */

/* ================= RENDER PRODUCTS ================= */
function renderProducts(list) {
  // Nếu không có sản phẩm
  if (list.length === 0) {
    document.getElementById("productList").innerHTML = `
      <div class="no-result">Không có sản phẩm phù hợp</div>
    `;
    document.getElementById("pagination").innerHTML = ""; // Ẩn pagination
    return;
  }

  const start = (currentPage - 1) * perPage;
  const show = list.slice(start, start + perPage);

  document.getElementById("productList").innerHTML = show
    .map(
      (p) => `
        <div class="product-card">
          <div class="product-image">
            <img src="${p.image}" alt="${p.name}" />
            ${p.sale ? `<span class="badge sale">${p.sale}</span>` : ""}
            <div class="product-actions">
              <button class="action-btn add-to-cart"
                data-name="${p.name}"
                data-price="${p.price}"
                data-image="${p.image}">
                <i class="fa-solid fa-cart-plus"></i>
              </button>
              <a href="product-details.html?id=${p.id}" class="action-btn">
                <i class="fa-solid fa-eye"></i>
              </a>
            </div>
          </div>

          <div class="product-info">
            <span class="product-category">${p.category}</span>
            <h3 class="product-name">${p.name}</h3>
            <div class="price-box">
              <span class="price">${formatCurrency(p.price)}</span>
              ${
                p.old_price
                  ? `<span class="old-price">${formatCurrency(
                      p.old_price
                    )}</span>`
                  : ""
              }
            </div>
            <div class="rating">
              ${"★".repeat(p.rating)}${"☆".repeat(5 - p.rating)}
            </div>
          </div>
        </div>
      `
    )
    .join("");

  renderPagination(list.length);
}

/* ================= PAGINATION ================= */
function renderPagination(total) {
  const totalPages = Math.ceil(total / perPage);
  let html = "";

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="${i === currentPage ? "active" : ""}" 
              onclick="goToPage(${i})">
        ${i}
      </button>`;
  }

  document.getElementById("pagination").innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  renderProducts(filteredList);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =============== FILTERS =============== */
document.querySelectorAll(".brandCheck").forEach((checkbox) => {
  checkbox.addEventListener("change", applyFilters);
});

document.getElementById("priceRange").addEventListener("input", function () {
  const maxPrice = Number(this.value);
  document.getElementById("maxLabel").textContent =
    maxPrice.toLocaleString("vi-VN") + "đ";
  applyFilters();
});

/* =============== APPLY FILTERS =============== */
function applyFilters() {
  let list = products;

  // Lấy danh sách brand được chọn
  const selectedBrands = [
    ...document.querySelectorAll(".brandCheck:checked"),
  ].map((c) => c.value); // Panasonic, LG, KDK...

  // Lọc theo brand
  if (selectedBrands.length > 0) {
    list = list.filter((p) => selectedBrands.includes(p.brand));
  }

  // Lọc theo giá
  const maxPrice = Number(document.getElementById("priceRange").value);
  list = list.filter((p) => p.price <= maxPrice);

  filteredList = list;
  currentPage = 1;
  renderProducts(filteredList);
}
