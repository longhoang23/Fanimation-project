const thumbs = document.querySelectorAll(".thumb");
const mainImg = document.getElementById("mainImg");
thumbs.forEach((t) => t.addEventListener("click", () => (mainImg.src = t.src)));

const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    tabContents.forEach((c) => (c.style.display = "none"));
    document.getElementById(btn.dataset.target).style.display = "block";
  });
});
