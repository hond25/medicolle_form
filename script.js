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
        // フォーム送信のデフォルト動作を止める
        e.preventDefault();

        const currentQDiv = document.querySelector(".question.active");
        if (!currentQDiv) return;

        if (!validateCurrentQuestionInputs(currentQDiv)) {
          alert("必須項目を正しく入力してください。");
          return;
        }

        // 最終質問なら送信ボタンを押す（以下は省略して簡易対応、必要なら実装）
        if (currentQuestion < TOTAL_QUESTIONS) {
          currentQuestion++;
          showQuestion(currentQuestion);
        } else {
          // 最終質問／送信ボタンにフォーカスしてクリック なども可能
          // 例: document.querySelector('.submit-btn').click();
          // ここでは何もしません。
        }
      }
    });
  });

  // フォーム送信時の処理
  document.getElementById("survey-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // ※ 本番ではここでサーバー送信やAPI呼び出しなど行う

    // 送信成功として画面切り替え
    document.getElementById("survey-form").style.display = "none";
    document.getElementById("progress-bar").style.width = "100%";
    document.getElementById("thanks-message").style.display = "block";
    document.getElementById("event-announcement").style.display = "block";
  });
});
