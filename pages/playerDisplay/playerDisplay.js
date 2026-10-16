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

window.addEventListener("DOMContentLoaded", async () => {
  const mode = userData.game_mode;

  document.querySelector(".all").classList.add(mode);
});
const backBtn = document.getElementById("back_btn");

backBtn.addEventListener("click", () => {
  window.location.href = "../../index.html";
});

const inRoom = document.getElementById("in_room");

inRoom.addEventListener("click", async () => {
  const roomName = document.getElementById("roomName").value;

  if (!roomName) {
    alert("入力漏れがあります。");
    return;
  }

  const roomRef = doc(db, "rooms", roomName);

  const roomSnap = await getDoc(roomRef);

  if (roomSnap.exists()) {
    console.log("部屋あり");

    const data = localStorage.getItem(key);
    const userData = JSON.parse(data);
    const userID = userData.user_ID;
    const playerName = userData.player_name;

    userData.room_name = roomName;
    localStorage.setItem(key, JSON.stringify(userData));

    const roomRef_addPlayer = doc(db, "rooms", roomName);

    await updateDoc(roomRef_addPlayer, {
      [`players.${userID}`]: {
        name: playerName,
        isHost: false,
      },
    });

    console.log("参加しました！");
  } else {
    console.log("部屋なし");
    alert("部屋名が存在しません。");
  }
});
