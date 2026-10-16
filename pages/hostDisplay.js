import { db } from "../firebase/firebase.js";

import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

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

const inRoom = document.getElementById("in_room");

inRoom.addEventListener("click", async () => {
  const playerCount = document.getElementById("player").value;
  const thinkingTime = document.getElementById("thinkingTime").value;
  const roomName = document.getElementById("roomName").value;

  if (!playerCount || !thinkingTime || !roomName) {
    alert("入力漏れがあります。");
    return;
  }

  const roomRef = doc(db, "rooms", roomName);

  const roomSnap = await getDoc(roomRef);

  if (roomSnap.exists()) {
    console.log("部屋あり");
    alert("部屋名が既に存在します。");
  } else {
    console.log("部屋なし");

    const data = localStorage.getItem(key);
    const userData = JSON.parse(data);
    const userID = userData.user_ID;
    const playerName = userData.player_name;

    userData.room_name = roomName;
    localStorage.setItem(key, JSON.stringify(userData));

    await setDoc(roomRef, {
      playerCount: playerCount,
      thinkingTime: thinkingTime,
      players: {
        [userID]: {
          name: playerName,
          isHost: true,
        },
      },
    });

    window.location.href = "./hostGameDisplay.html";
  }
});
