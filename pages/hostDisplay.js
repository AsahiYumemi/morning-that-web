const key = "morning-that";

window.addEventListener("DOMContentLoaded", () => {
  const data = localStorage.getItem(key);
  const userData = JSON.parse(data);

  const mode = userData.game_mode;

  document.querySelector(".all").classList.add(mode);
});

const backBtn = document.getElementById("back_btn");

backBtn.addEventListener("click", () => {
  window.location.href = "../index.html";
});
