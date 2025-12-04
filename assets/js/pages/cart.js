// Lấy giỏ hàng từ localStorage hoặc khởi tạo rỗng
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Lưu giỏ hàng
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Format số thành tiền VNĐ
function formatCurrency(num) {
  return num.toLocaleString("vi-VN") + "đ";
}

// Render giỏ hàng
function renderCart() {
  const cartItemsEl = document.querySelector(".cart-items");
  const subtotalEl = document.querySelector(".subtotal-price");
  const cartTotalEl = document.getElementById("cart-total");
  const topSubtotal = document.querySelector(".top-subtotal");
  const btnCheckout = document.querySelector(".btn-checkout");

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart">Không có sản phẩm nào trong giỏ hàng</p>`;
    topSubtotal.style.display = "none";
    btnCheckout.style.display = "none";
  } else {
    topSubtotal.style.display = "block";
    btnCheckout.style.display = "block";

    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.qty;

      cartItemsEl.innerHTML += `
        <li class="cart-item">
          <img src="${item.image}" class="cart-thumb" />
          <div class="cart-info">
            <p class="product-name">${item.name}</p>
            <span class="price">${formatCurrency(item.price)}</span>
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

    subtotalEl.textContent = formatCurrency(total);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartTotalEl.textContent = totalItems;
  }

  saveCart();
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
  const existing = cart.find((x) => x.name === product.name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

// Event delegation cho toàn bộ document
document.addEventListener("click", (e) => {
  // Xử lý Add to cart
  const addBtn = e.target.closest(".add-to-cart");
  if (addBtn) {
    addToCart({
      name: addBtn.dataset.name,
      price: Number(addBtn.dataset.price),
      image: addBtn.dataset.image,
    });
    return;
  }

  // Xử lý tăng/giảm số lượng và xóa
  const index = e.target.dataset.index;
  if (index !== undefined) {
    if (e.target.classList.contains("increase")) {
      cart[index].qty++;
    } else if (e.target.classList.contains("decrease")) {
      if (cart[index].qty > 1) cart[index].qty--;
    } else if (e.target.classList.contains("remove-item")) {
      cart.splice(index, 1);
    }
    renderCart();
  }
});

// Render lần đầu
renderCart();
