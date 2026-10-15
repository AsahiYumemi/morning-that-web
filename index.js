/**userID　search */
let userID;
let playerName;
const key = "morning-that";

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem(key);

  if (saved) {
    const data = JSON.parse(saved);
    userID = data.user_ID;
    playerName = data.player_name;

    document.querySelector(".player_name").value = playerName;
  } else {
    userID = crypto.randomUUID();
  }
});

/**botton click */
const Btns = document.querySelectorAll(".in_game");

Btns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    playerName = document.querySelector(".player_name").value;

    if (!playerName) return;

    const userData = {
      user_ID: userID,
      player_name: playerName,
    };

    localStorage.setItem(key, JSON.stringify(userData));

    const clickedBtn = event.currentTarget;
    const id = clickedBtn.id;

    if (id === "host") {
      console.log("司会者として参加が選ばれた");
      // 司会者用の処理を書く
    } else if (id === "player") {
      console.log("回答者として参加が選ばれた");
      // 回答者用の処理を書く
    }
  });
});

/**hamburgerMenu */
const hamburgerMenuBtn = document.querySelector(".hamburgerMenu_line");
const hambutgerMenu = document.querySelector(".hamburgerMenu");

hamburgerMenuBtn.addEventListener("click", () => {
  hamburgerMenuBtn.classList.toggle("open");
  hambutgerMenu.classList.toggle("open");
});

/**toggleButton */
const toggle = document.querySelector(".toggle");
const all = document.querySelector(".all");

toggle.addEventListener("click", () => {
  all.classList.toggle("morning");
  all.classList.toggle("night");
});
