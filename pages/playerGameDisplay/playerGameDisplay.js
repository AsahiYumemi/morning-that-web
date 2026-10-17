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

  updateMemberList(playerNames);

  const limitBox = document.querySelector(".limit_contents");
  limitBox.innerHTML = limit;
});
const backBtn = document.getElementById("back_btn");

backBtn.addEventListener("click", () => {
  window.location.href = "../../index.html";
});

/**Firebase監視 */
let prevPlayers = 0; /**プレイヤー変更の監視用 */
let prevQuestion = ""; /**お題変更の監視用 */
let prevTimerState = ""; /**タイマーの状態監視用 */
let prevAnswerOpen = ""; /**回答表示の監視用 */
onSnapshot(roomRef, (snapshot) => {
  const data = localStorage.getItem(key);
  const userData = JSON.parse(data);
  const userID = userData.user_ID;

  const roomData = snapshot.data();
  const players = roomData.players;

  /**各種データ取得 */
  const playerNames = Object.values(players).map((player) => player.name);
  const question = roomData.question;
  const timerState = roomData.timerState;
  const answerOpen = players[userID].answer_open;
  const limit = roomData.thinkingTime;

  if (playerNames.length !== prevPlayers) {
    updateMemberList(playerNames);
    prevPlayers = playerNames.length;
    console.log("メンバーリスト更新");
  }
  if (question !== prevQuestion) {
    updateQuestionDisplay(question);
    prevQuestion = question;
    console.log("お題更新");
  }
  if (timerState !== prevTimerState) {
    if (timerState === "strat") {
      timer(limit);
    }
    prevTimerState = timerState;
    console.log("タイマー更新");
  }
  if (answerOpen !== prevAnswerOpen) {
    if (answerOpen === true) {
      openAnswer(players);
    }
    prevAnswerOpen = answerOpen;
    console.log("anwerOpen更新");
  }
});

/**memberList 更新 */
function updateMemberList(playerNames) {
  const memberBox = document.querySelector(".member_contents");

  memberBox.innerHTML = "";
  playerNames.forEach((name) => {
    memberBox.innerHTML += `
      <div class="member">${name}</div>
    `;
  });
}
/**questionDisplay 更新 */
function updateQuestionDisplay(question) {
  const questionDisplay = document.querySelector(".question_contents");
  if (question !== undefined) {
    questionDisplay.innerHTML = "";
    questionDisplay.innerHTML = question;
  } else {
    questionDisplay.innerHTML = "";
  }
}
/**タイマー */
let timerId = null;

function timer(time) {
  let remaining = Number(time);

  const display = document.querySelector(".limit_contents");

  display.textContent = remaining;

  timerId = setInterval(async () => {
    remaining--;

    display.textContent = remaining;

    if (remaining <= 0) {
      clearInterval(timerId);
      await updateDoc(roomRef, {
        timerState: "stop",
      });
      display.textContent = time;
      alert("時間です！");
    }
  }, 1000);
}
/**回答一覧更新 */
function openAnswer(players) {
  const answerListID = document.getElementById("answerList");
  const answerListClass = document.querySelector(".answerList");

  answerListClass.classList.add("open");
  answerListID.innerHTML = "";

  Object.values(players).forEach((player) => {
    answerListID.innerHTML += `
        <div class="answerBox">
          <div class="nameBox">${player.name}</div>
          <div class="answeredBox">${player.answer}</div>
        </div>
    `;
  });
}
