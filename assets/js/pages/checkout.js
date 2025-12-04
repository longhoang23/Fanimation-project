document.addEventListener("DOMContentLoaded", function () {
  const orderContainer = document.querySelector(".order-summary");
  const totalElement = document.querySelector(".order-total");

  function formatCurrency(num) {
    return num.toLocaleString("vi-VN") + "đ";
  }

  function loadCheckoutCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    orderContainer.innerHTML = "";

    if (cart.length === 0) {
      orderContainer.innerHTML = `<p>Giỏ hàng của bạn hiện đang trống</p>`;
      totalElement.textContent = "Tổng cộng: 0đ";
      return;
    }

    let total = 0;

    cart.forEach((item) => {
      total += item.price * item.qty;

      const row = document.createElement("div");
      row.classList.add("order-item");

      row.innerHTML = `
        <div class="order-item-info">
          <img src="${item.image}" />
          <span>${item.name} (x${item.qty})</span>
        </div>
        <span>${formatCurrency(item.price)}</span>
      `;

      orderContainer.appendChild(row);
    });

    totalElement.textContent = "Tổng cộng: " + formatCurrency(total);
  }

  loadCheckoutCart();
});
