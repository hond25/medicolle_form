document.addEventListener("DOMContentLoaded", () => {
  const TOTAL_QUESTIONS = document.querySelectorAll(".question").length;
  let currentQuestion = 1;
  
  const headerBackBtn = document.getElementById("header-back-btn");
  const surveyForm = document.getElementById("survey-form");

  // 質問表示切替
  function showQuestion(index) {
    document.querySelectorAll(".question").forEach((q, i) => {
      q.classList.toggle("active", i + 1 === index);
    });
    
    updateProgressBar(index);

    // 戻るボタンを1問目では非表示に
    headerBackBtn.style.display = index === 1 ? "none" : "block";
  }

  // プログレスバー更新
  function updateProgressBar(index) {
    const percent = (index / TOTAL_QUESTIONS) * 100;
    document.getElementById("progress-bar").style.width = percent + "%";
  }

  // 学籍番号入力の自動大文字化・バリデーション
  const studentIdInput = document.getElementById("student-id");
  if (studentIdInput) {
    studentIdInput.addEventListener("input", function () {
      let v = this.value.toUpperCase();
      let arr = v.split("");
      for (let i = 0; i < arr.length; i++) {
        arr[i] = i === 3 ? arr[i].replace(/[^A-Z]/g, "") : arr[i].replace(/[^0-9]/g, "");
      }
      this.value = arr.join("");
    });
  }
  
  // 現在の質問フォームの必須チェック関数
  function validateCurrentQuestionInputs() {
    const container = document.querySelector(".question.active");
    if (!container) return false;
    
    const elements = container.querySelectorAll("input, textarea, select");
    for (const el of elements) {
      if (el.required) {
        if (el.type === "radio") {
          const checked = container.querySelector(`input[name="${el.name}"]:checked`);
          if (!checked) return false;
        } else if (!el.value.trim()) {
          return false;
        }
      }
    }
    return true;
  }
  
  // 「次へ」ボタン押下時の処理
  document.querySelectorAll(".next-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!validateCurrentQuestionInputs()) {
        alert("必須項目を正しく入力してください。");
        return;
      }
      if (currentQuestion < TOTAL_QUESTIONS) {
        currentQuestion++;
        showQuestion(currentQuestion);
      }
    });
  });

  // ヘッダーの「戻る」ボタン押下時の処理
  headerBackBtn.addEventListener("click", () => {
    if (currentQuestion > 1) {
      currentQuestion--;
      showQuestion(currentQuestion);
    }
  });

  // フォーム送信時の処理
  surveyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateCurrentQuestionInputs()) {
      alert("必須項目を正しく入力してください。");
      return;
    }
    
    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "送信中...";
    
    document.getElementById("loading-spinner").style.display = "block";
    
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbx1jHz8cXkfGWsGEM-kbCHPCVh-Qh2Kc6yqkxzobVJAFogkolwHQ2A5gEMm2FK3lOr2/exec';
    const formData = new FormData(e.target);
    
    fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
    .then(response => {
      document.getElementById("loading-spinner").style.display = "none";
      document.getElementById("survey-form").style.display = "none";
      document.getElementById("progress-bar-container").style.display = "none";
      document.getElementById("thanks-message").style.display = "block";
      document.getElementById("event-announcement").style.display = "block";
      
      // ▼▼▼ ここを追記 ▼▼▼
      headerBackBtn.style.display = "none";
      document.querySelector("h1").style.display = "none";
      document.querySelector(".timetable-link").style.display = "none";
    })
    .catch(error => {
      console.error("送信エラー:", error);
      submitBtn.disabled = false;
      submitBtn.textContent = "送信";
      document.getElementById("loading-spinner").style.display = "none";
      alert("送信中にエラーが発生しました。もう一度お試しください。");
    });
  });

  // --- Enterキーで次へ進む処理 ---
  surveyForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      // デフォルトの送信動作をキャンセル
      e.preventDefault();
      
      const activeQuestion = document.querySelector('.question.active');
      if (!activeQuestion) return;

      // 表示中の質問にあるボタンを探す
      const nextBtn = activeQuestion.querySelector('.next-btn');
      const submitBtn = activeQuestion.querySelector('.submit-btn');

      if (nextBtn) {
        // 「次へ」ボタンがあればクリック
        nextBtn.click();
      } else if (submitBtn) {
        // 「送信」ボタンがあればクリック
        submitBtn.click();
      }
    }
  });

  // 初期表示
  showQuestion(currentQuestion);
});






