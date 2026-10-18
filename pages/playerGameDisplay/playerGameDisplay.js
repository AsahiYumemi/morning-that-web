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

/**回答を送信 */
const answerGo = document.getElementById("answerGo");

answerGo.addEventListener("click", async () => {
  const data = localStorage.getItem(key);
  const userData = JSON.parse(data);
  const userID = userData.user_ID;

  const answer = document.getElementById("answer").value;

  if (!answer) return;

  const add_answer = doc(db, "rooms", roomName);
  await updateDoc(add_answer, {
    [`players.${userID}.answer`]: answer,
  });
  alert("回答が送信されました！");
  answerGo.classList.add("answered");
});

/**回答一覧を閉じる */
const nextGame = document.getElementById("nextGame");

nextGame.addEventListener("click", async () => {
  const data = localStorage.getItem(key);
  const userData = JSON.parse(data);
  const userID = userData.user_ID;

  const answerListClass = document.querySelector(".answerList");
  const answerListID = document.getElementById("answerList");
  const answer = document.getElementById("answer");
  const answerGo = document.getElementById("answerGo");

  answerListClass.classList.remove("open");
  answerListID.innerHTML = "";
  answer.value = "";
  answerGo.classList.remove("answered");

  const reset_game = doc(db, "rooms", roomName);
  await updateDoc(reset_game, {
    [`players.${userID}.answer`]: "",
    [`players.${userID}.answer_open`]: false,
  });
});

/**Firebase監視 */
let prevPlayers = 0; /**プレイヤー変更の監視用 */
let prevQuestion = ""; /**お題変更の監視用 */
let prevTimerState = ""; /**タイマーの状態監視用 */
let prevAnswerOpen = ""; /**回答表示の監視用 */
let prevHost = true; /**ホストの状態監視用 */
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
  const host = players[userID].isHost;

  if (playerNames.length !== prevPlayers) {
    updateMemberList(players);
    prevPlayers = playerNames.length;
  }
  if (question !== prevQuestion) {
    updateQuestionDisplay(question);
    prevQuestion = question;
  }
  if (timerState !== prevTimerState) {
    if (timerState === "strat") {
      timer(limit);
    }
    prevTimerState = timerState;
  }
  if (answerOpen !== prevAnswerOpen) {
    if (answerOpen === true) {
      openAnswer(players);
    }
    prevAnswerOpen = answerOpen;
  }
  if (host !== prevHost) {
    const action = document.querySelector(".action");
    if (host === true) {
      action.classList.add("host");
      action.classList.remove("player");
    } else {
      action.classList.remove("host");
      action.classList.add("player");
    }
    prevHost = host;
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
