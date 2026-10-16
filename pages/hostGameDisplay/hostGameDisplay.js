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
  const playerNames = Object.values(players).map((players) => players.name);

  const limitBox = document.querySelector(".limit_contents");

  updateMemberList(playerNames);
  limitBox.innerHTML = limit;
});

const backBtn = document.getElementById("back_btn");

backBtn.addEventListener("click", async () => {
  await deleteDoc(doc(db, "rooms", roomName));
  window.location.href = "../../index.html";
});

/**ゲーム自体の処理 */
const questionList = [
  "困ったときに頼りになるもの",
  "手元にあったら嬉しいもの",
  "いつも頼んでしまうもの",
  "信頼できる人",
  "大切なもの",
  "あったら困るもの",
  "みんな大好きなもの",
  "縁起の良いもの",
  "縁起の悪いもの",
  "偉人",
];

/**お題の公開 */
const openQuestion = document.getElementById("openQuestion");

openQuestion.addEventListener("click", async () => {
  const firstText = document.getElementById("firstText").value;

  if (!firstText) return;

  const questionCount = questionList.length;
  const questionText = questionList[Math.floor(Math.random() * questionCount)];
  const question = firstText + "から始まる" + questionText;

  const add_question = doc(db, "rooms", roomName);
  await updateDoc(add_question, {
    question: question,
  });
});

/**タイマー起動 */
const timerState = document.getElementById("start");

timerState.addEventListener("click", async () => {
  const add_timerState = doc(db, "rooms", roomName);
  await updateDoc(add_timerState, {
    timerState: "strat",
  });
});

/**Firebase監視 */
let prevPlayers = 0; /**プレイヤー変更の監視用 */
let prevQuestion = ""; /**お題変更の監視用 */
let prevTimerState = "";
onSnapshot(roomRef, (snapshot) => {
  const roomData = snapshot.data();
  const players = roomData.players;

  /**各種データ取得 */
  const playerNames = Object.values(players).map((player) => player.name);
  const question = roomData.question;
  const timerState = roomData.timerState;
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
