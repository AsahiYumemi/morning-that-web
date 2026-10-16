/**userID　search */
let userID;
let playerName;
let mode;
const key = "morning-that";

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem(key);

  if (saved) {
    const data = JSON.parse(saved);
    userID = data.user_ID;
    playerName = data.player_name;
    gameMode = data.game_mode;

    document.querySelector(".player_name").value = playerName;
    if (gameMode === "night") {
      document.querySelector(".all").classList.remove("morning");
      document.querySelector(".all").classList.add("night");
    }

    mode = gameMode;
  } else {
    userID = crypto.randomUUID();

    mode = "morning";
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
      game_mode: mode,
    };

    localStorage.setItem(key, JSON.stringify(userData));

    const clickedBtn = event.currentTarget;
    const id = clickedBtn.id;

    if (id === "host") {
      console.log("司会者として参加が選ばれた");
      window.location.href = "./pages/hostDisplay.html";
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

  if (mode === "morning") {
    mode = "night";
  } else {
    mode = "morning";
  }

  console.log(mode);
});
