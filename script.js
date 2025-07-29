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
    rowData.push(e.parameter["work-reason"]);
    rowData.push(e.parameter["interest-major"]);
    rowData.push(e.parameter["satisfaction"]);
    rowData.push(e.parameter["free-comment"]);
    rowData.push(e.parameter["venue-atmosphere"]);
    rowData.push(e.parameter["improvement"]);
    sheet.appendRow(rowData);
    return ContentService.createTextOutput("Success");
  }
const TOTAL_QUESTIONS = 8;
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

// 学籍番号入力の自動大文字化・4文字目以外数字、4文字目だけ大文字アルファベット
document.addEventListener("DOMContentLoaded", () => {
  const studentIdInput = document.getElementById("student-id");
  if (studentIdInput) {
    studentIdInput.addEventListener("input", function () {
      let v = this.value.toUpperCase();
      let arr = v.split("");
      for (let i = 0; i < arr.length; i++) {
        if (i === 3) {
          // 4文字目はA-Zのみ
          arr[i] = arr[i].replace(/[^A-Z]/g, "");
        } else {
          // それ以外は0-9のみ
          arr[i] = arr[i].replace(/[^0-9]/g, "");
        }
      }
      this.value = arr.join("");
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
    } else if (el.required && !el.checkValidity()) {
      // 必須項目のみバリデーション
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
    
    // 送信ボタンを無効化
    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "送信中...";
    submitBtn.style.opacity = "0.6";
    submitBtn.style.cursor = "not-allowed";
    
    // ローディングスピナーを表示
    document.getElementById("loading-spinner").style.display = "block";
    
    const form = e.target;
    const formData = new FormData(form);
    const params = new URLSearchParams();
    for (const pair of formData.entries()) {
      params.append(pair[0], pair[1]);
    }
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbx1jHz8cXkfGWsGEM-kbCHPCVh-Qh2Kc6yqkxzobVJAFogkolwHQ2A5gEMm2FK3lOr2/exec';
    fetch(WEB_APP_URL, {
      method: 'POST',
      body: params.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      mode: 'no-cors'
    })
    .then(response => {
      // ローディングスピナーを非表示
      document.getElementById("loading-spinner").style.display = "none";
      
      // フォームを非表示にしてthanksメッセージを表示
      document.getElementById("survey-form").style.display = "none";
      document.getElementById("progress-bar").style.width = "100%";
      document.getElementById("thanks-message").style.display = "block";
      document.getElementById("event-announcement").style.display = "block";
    })
    .catch(error => {
      console.error("Error!", error.message);
      
      // エラー時はボタンを元に戻す
      submitBtn.disabled = false;
      submitBtn.textContent = "送信";
      submitBtn.style.opacity = "1";
      submitBtn.style.cursor = "pointer";
      
      // ローディングスピナーを非表示
      document.getElementById("loading-spinner").style.display = "none";
      
      alert("送信中にエラーが発生しました。もう一度お試しください。");
    });
  });
});