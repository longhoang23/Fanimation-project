// Load header/footer
async function loadComponent(id, file) {
  const element = document.getElementById(id);
  const response = await fetch(file);
  const html = await response.text();
  element.innerHTML = html;
}

// Format tiền
function formatPrice(num) {
  return num.toLocaleString("vi-VN") + "đ";
}

// Load sản phẩm từ JSON
async function loadProducts() {
  const wrapper = document.getElementById("product-wrapper");
  // if (!wrapper) return console.error("#product-wrapper không tồn tại!");

  try {
    const res = await fetch("assets/data/products.json");
    const data = await res.json();

    wrapper.innerHTML = "";

    data.categories.forEach((category) => {
      let sectionHTML = `<h2 class="section-title">${category.name}</h2><div class="product-grid">`;

      category.products.forEach((p) => {
        sectionHTML += `
          <div class="product-card">
            <div class="product-image">
              <img src="${p.image}" alt="${p.name}">
              <span class="badge sale">${p.sale}</span>
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
              <span class="product-category">${category.name}</span>
              <h3 class="product-name">${p.name}</h3>
              <div class="price-box">
                <span class="price">${formatPrice(p.price)}</span>
                <span class="old-price">${formatPrice(p.old_price)}</span>
              </div>
              <div class="rating">${"★".repeat(p.rating)}</div>
            </div>
          </div>
        `;
      });

      sectionHTML += "</div>";
      wrapper.innerHTML += sectionHTML;
    });
  } catch (err) {
    console.error("Lỗi load products.json:", err);
  }
}

// Giỏ hàng
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cartItemsEl = document.querySelector(".cart-items");
  const subtotalEl = document.querySelector(".subtotal-price");
  const cartTotalEl = document.getElementById("cart-total");
  const topSubtotal = document.querySelector(".top-subtotal");
  const btnCheckout = document.querySelector(".btn-checkout");

  if (!cartItemsEl) return; // tránh lỗi khi DOM chưa có

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart">Không có sản phẩm nào trong giỏ hàng</p>`;
    topSubtotal && (topSubtotal.style.display = "none");
    btnCheckout && (btnCheckout.style.display = "none");
  } else {
    topSubtotal && (topSubtotal.style.display = "block");
    btnCheckout && (btnCheckout.style.display = "block");

    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.qty;
      cartItemsEl.innerHTML += `
        <li class="cart-item">
          <img src="${item.image}" class="cart-thumb" />
          <div class="cart-info">
            <p class="product-name">${item.name}</p>
            <span class="price">${formatPrice(item.price)}</span>
            <div class="qty-box">
              <button class="qty-btn decrease" data-index="${index}">-</button>
              <span class="qty">${item.qty}</span>
              <button class="qty-btn increase" data-index="${index}">+</button>
            </div>
          </div>
          <button class="remove-item" data-index="${index}">×</button>
        </li>
      `;
    });

    subtotalEl && (subtotalEl.textContent = formatPrice(total));
    cartTotalEl &&
      (cartTotalEl.textContent = cart.reduce((sum, i) => sum + i.qty, 0));
  }

  saveCart();
}

function addToCart(product) {
  const existing = cart.find((x) => x.name === product.name);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });

  renderCart();
}

// Event delegation cho giỏ hàng và add-to-cart
document.addEventListener("click", (e) => {
  // Add to cart
  const addBtn = e.target.closest(".add-to-cart");
  if (addBtn) {
    addToCart({
      name: addBtn.dataset.name,
      price: Number(addBtn.dataset.price),
      image: addBtn.dataset.image,
    });
    return;
  }

  // Tăng/giảm/xóa sản phẩm trong giỏ
  const index = e.target.dataset.index;
  if (index !== undefined) {
    if (e.target.classList.contains("increase")) cart[index].qty++;
    else if (e.target.classList.contains("decrease") && cart[index].qty > 1)
      cart[index].qty--;
    else if (e.target.classList.contains("remove-item")) cart.splice(index, 1);

    renderCart();
  }
});

// Load header/footer + products + render cart
async function initPage() {
  await loadComponent("header", "components/header.html");
  await loadComponent("footer", "components/footer.html");

  renderCart(); // render giỏ hàng từ localStorage
  await loadProducts(); // load sản phẩm
}

initPage();
