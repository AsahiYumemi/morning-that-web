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
  const userID = userData.user_ID;

  const roomSnap = await getDoc(roomRef);
  const roomData = roomSnap.data();
  const players = roomData.players;
  const limit = roomData.thinkingTime;
  const post = players[userID].isHost;

  document.querySelector(".all").classList.add(mode);
  document
    .querySelector(".action")
    .classList.add(`${post === true ? "host" : "player"}`);
  updateMemberList(players);
  document.querySelector(".limit_contents").innerHTML = limit;
});

const backBtn = document.getElementById("back_btn");

backBtn.addEventListener("click", async () => {
  await deleteDoc(doc(db, "rooms", roomName));
  window.location.href = "../../index.html";
});

/**ゲーム自体の処理 */
import { questionListNormal } from "../../questionList/questionList.js";

/**お題の公開 */
const openQuestion = document.getElementById("openQuestion");

openQuestion.addEventListener("click", async () => {
  const firstText = document.getElementById("firstText").value;

  if (!firstText) return;

  const questionCount = questionListNormal.length;
  const questionText =
    questionListNormal[Math.floor(Math.random() * questionCount)];
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

/**回答を送信 */
const answerGo = document.getElementById("answerGo");

answerGo.addEventListener("click", async () => {
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

/**回答を表示 */
const answerOpen = document.getElementById("answerOpen");

answerOpen.addEventListener("click", async () => {
  const roomSnap = await getDoc(roomRef);

  const roomData = roomSnap.data();
  const players = roomData.players;

  const updates = {};

  Object.keys(players).forEach((userID) => {
    updates[`players.${userID}.answer_open`] = true;
  });

  await updateDoc(roomRef, updates);
});

/**回答一覧を閉じる */
const nextGame = document.getElementById("nextGame");

nextGame.addEventListener("click", async () => {
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

const memberBox = document.querySelector(".member_box");

memberBox.addEventListener("click", async (e) => {
  if (e.target.classList.contains("member_Btn")) {
    const memberID = e.target.id;
    const roomSnap = await getDoc(roomRef);

    const roomData = roomSnap.data();
    const players = roomData.players;

    const updates = {};

    Object.keys(players).forEach((userID) => {
      updates[`players.${userID}.isHost`] = false;
    });

    await updateDoc(roomRef, updates);

    const add_host = doc(db, "rooms", roomName);
    await updateDoc(add_host, {
      [`players.${memberID}.isHost`]: true,
    });
  }
});

/**Firebase監視 */
let prevPlayers = 0; /**プレイヤー変更の監視用 */
let prevQuestion = ""; /**お題変更の監視用 */
let prevTimerState = ""; /**タイマーの状態監視用 */
let prevAnswerOpen = ""; /**回答表示の監視用 */
let prevHost = true; /**ホストの状態監視用 */
let prevAnswerCount = 0; /**回答者数の監視用 */
onSnapshot(roomRef, (snapshot) => {
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
  const answerCount = Object.values(players).filter(
    (player) => player.answer,
  ).length;

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
      document.getElementById("firstText").value = "";
    } else {
      action.classList.remove("host");
      action.classList.add("player");
    }
    prevHost = host;
  }
  if (answerCount !== prevAnswerCount) {
    document.querySelector(".answered_player_contents").innerHTML = answerCount;
    prevAnswerCount = answerCount;
  }
});

/**memberList 更新 */
function updateMemberList(players) {
  const userID = userData.user_ID;
  const memberBox = document.querySelector(".member_contents");
  const playerObjects = Object.values(players);

  memberBox.innerHTML = "";
  playerObjects.forEach((playerObject) => {
    memberBox.innerHTML += `
      <div class="member ${playerObject.userID === userID ? "me" : "another"}">${playerObject.name}${playerObject.userID === userID ? "(自分)" : ""}<button class="member_Btn" id="${playerObject.userID}">指名</button></div>
    `;
  });
}
/**questionDisplay 更新 */
function updateQuestionDisplay(question) {
  const questionDisplays = document.querySelectorAll(".question_contents");
  if (question !== undefined) {
    questionDisplays.forEach((questionDisplay) => {
      questionDisplay.innerHTML = "";
      questionDisplay.innerHTML = question;
    });
  } else {
    questionDisplays.forEach((questionDisplay) => {
      questionDisplay.innerHTML = "";
    });
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
