// Google Apps Script
function doPost(e) {
    Logger.log(JSON.stringify(e.parameter));
    var sheet = SpreadsheetApp.openById('1ttEaBa5Ad0RCvYgWHpvmyBxblw_tTSkCTYYH3yRBKmA').getSheetByName('シート1');
    var rowData = [];
    rowData.push(new Date());
    rowData.push(e.parameter["student-id"]);
    rowData.push(e.parameter["session-number"]);
    rowData.push(e.parameter["session-reason"]);
    rowData.push(e.parameter["work-number"]);
    rowData.push(e.parameter["interest-major"]);
    rowData.push(e.parameter["satisfaction"]);
    rowData.push(e.parameter["free-comment"]);
    rowData.push(e.parameter["venue-atmosphere"]);
    rowData.push(e.parameter["improvement"]);
    rowData.push(e.parameter["prize-idea"]);
    sheet.appendRow(rowData);
    return ContentService.createTextOutput("Success");
  }
const TOTAL_QUESTIONS = 9;
let currentQuestion = 1;

// 質問表示切替
function showQuestion(index) {
  for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
    document.getElementById(`question-${i}`).classList.remove("active");
  }
  document.getElementById(`question-${index}`).classList.add("active");
  updateProgressBar(index);

  // 戻るボタンを1問目非表示に制御
  document.querySelectorAll(".back-btn").forEach((btn) => {
    btn.style.display = index === 1 ? "none" : "";
  });
}

// プログレスバー更新
function updateProgressBar(index) {
  const percent = (index / TOTAL_QUESTIONS) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
}

// 学籍番号入力の自動大文字化・半角英数字のみ許容
document.addEventListener("DOMContentLoaded", () => {
  const studentIdInput = document.getElementById("student-id");
  if (studentIdInput) {
    studentIdInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    });
  }
});

// 現在の質問フォームの必須チェック関数
function validateCurrentQuestionInputs(container) {
  const elements = container.querySelectorAll("input, textarea, select");
  for (const el of elements) {
    if (el.type === "radio") {
      // ラジオは同名でのチェック確認
      const checked = container.querySelector(
        `input[name="${el.name}"]:checked`
      );
      if (el.required && !checked) return false;
    } else if (!el.checkValidity()) {
      return false;
    }
  }
  return true;
}

// ラジオボタンの選択状態を視覚化（5段階評価の.rating用）
function setupRatingRadio() {
  document.querySelectorAll('.rating input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      const group = this.name;
      // すべてのラベルからactiveを外す
      document
        .querySelectorAll(`.rating input[name="${group}"] + label`)
        .forEach((label) => label.classList.remove("active"));
      // 選択されたラベルにactiveを付与
      const selectedLabel = this.nextElementSibling;
      if (selectedLabel) selectedLabel.classList.add("active");
    });
  });
}
setupRatingRadio();

document.addEventListener("DOMContentLoaded", () => {
  showQuestion(currentQuestion);

  // 「次へ」ボタン押下時の処理
  document.querySelectorAll(".next-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const qDiv = btn.closest(".question");
      if (!validateCurrentQuestionInputs(qDiv)) {
        alert("必須項目を正しく入力してください。");
        return;
      }
      if (currentQuestion < TOTAL_QUESTIONS) {
        currentQuestion++;
        showQuestion(currentQuestion);
      }
    });
  });

  // 「戻る」ボタン押下時の処理
  document.querySelectorAll(".back-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
      }
    });
  });

  // --- Enterキーの全要素対応処理 ---
  const formElements = document.querySelectorAll(
    "#survey-form input, #survey-form textarea, #survey-form select"
  );
  formElements.forEach((element) => {
    element.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const currentQDiv = document.querySelector(".question.active");
        if (!currentQDiv) return;
        if (!validateCurrentQuestionInputs(currentQDiv)) {
          alert("必須項目を正しく入力してください。");
          return;
        }
        if (currentQuestion < TOTAL_QUESTIONS) {
          currentQuestion++;
          showQuestion(currentQuestion);
        }
      }
    });
  });

  // フォーム送信時の処理
  document.getElementById("survey-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const currentQDiv = document.querySelector(".question.active");
    if (!validateCurrentQuestionInputs(currentQDiv)) {
      alert("必須項目を正しく入力してください。");
      return;
    }
    const form = e.target;
    const formData = new FormData(form);
    const params = new URLSearchParams();
    for (const pair of formData.entries()) {
      params.append(pair[0], pair[1]);
    }
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzwCrnJIupHiddKRBpmu0CgThagi_1tty-qf26pPSEERdQyvW7L83rcawqVyix0tHJi/exec';
    fetch(WEB_APP_URL, {
      method: 'POST',
      body: params.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      mode: 'no-cors'
    })
    .then(response => {
      document.getElementById("survey-form").style.display = "none";
      document.getElementById("progress-bar").style.width = "100%";
      document.getElementById("thanks-message").style.display = "block";
      document.getElementById("event-announcement").style.display = "block";
    })
    .catch(error => {
      console.error("Error!", error.message);
      alert("送信中にエラーが発生しました。もう一度お試しください。");
    });
  });
});