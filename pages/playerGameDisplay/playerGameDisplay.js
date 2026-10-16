import { db } from "../../firebase/firebase.js";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const key = "morning-that";
const data = localStorage.getItem(key);
const userData = JSON.parse(data);
const roomName = userData.room_name;

const roomRef = doc(db, "rooms", roomName);

window.addEventListener("DOMContentLoaded", async () => {
  const mode = userData.game_mode;

  document.querySelector(".all").classList.add(mode);
  const roomSnap = await getDoc(roomRef);

  const roomData = roomSnap.data();
  const players = roomData.players;
  const limit = roomData.thinkingTime;
  const playerNames = Object.values(players).map((player) => player.name);

  const memberBox = document.querySelector(".member_contents");

  // 一旦リセット
  memberBox.innerHTML = "";

  playerNames.forEach((name) => {
    memberBox.innerHTML += `
      <div class="member">${name}</div>
    `;
  });

  const limitBox = document.querySelector(".limit_contents");
  limitBox.innerHTML = limit;
});
const backBtn = document.getElementById("back_btn");

backBtn.addEventListener("click", () => {
  window.location.href = "../../index.html";
});

onSnapshot(roomRef, (snapshot) => {
  const roomData = snapshot.data();
  const players = roomData.players;

  const playerNames = Object.values(players).map((player) => player.name);

  const memberBox = document.querySelector(".member_contents");

  // 一旦リセット
  memberBox.innerHTML = "";

  playerNames.forEach((name) => {
    memberBox.innerHTML += `
      <div class="member">${name}</div>
    `;
  });
});
