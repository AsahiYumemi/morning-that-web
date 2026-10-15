const hamburgerMenuBtn = document.querySelector(".hamburgerMenu_line");
const hambutgerMenu = document.querySelector(".hamburgerMenu");

hamburgerMenuBtn.addEventListener("click", () => {
  hamburgerMenuBtn.classList.toggle("open");
  hambutgerMenu.classList.toggle("open");
});

const toggle = document.querySelector(".toggle");
const all = document.querySelector(".all");

toggle.addEventListener("click", () => {
  all.classList.toggle("morning");
  all.classList.toggle("night");
});
