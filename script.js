// 質問数
const TOTAL_QUESTIONS = 7;
let currentQuestion = 1;

// 仮データ
const senpaiData = [
  { major: 'メディアイノベーション専攻', names: ['田中太郎', '佐藤花子'] },
  { major: 'メディアデザイン専攻', names: ['鈴木一郎', '高橋美咲'] },
  { major: 'メディアコミュニケーション専攻', names: ['山本健', '伊藤彩'] },
  { major: '音楽メディア専攻', names: ['小林大輝', '中村美咲'] }

];
const committeeData = [
  '広報',
  '企画',
  '会計',
  '当日運営',
  '技術（Web/システム）'
];

// 質問の表示切り替え
function showQuestion(index) {
  for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
    document.getElementById(`question-${i}`).classList.remove('active');
  }
  document.getElementById(`question-${index}`).classList.add('active');
  updateProgressBar(index);
  // 戻るボタンの表示制御
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.style.display = (index === 1) ? 'none' : '';
  });
}

// 進捗バー更新
function updateProgressBar(index) {
  const percent = ((index - 1) / TOTAL_QUESTIONS) * 100;
  document.getElementById('progress-bar').style.width = percent + '%';
}

// 専攻ごとの先輩リスト生成
function renderSenpaiList() {
  const container = document.getElementById('senpai-list');
  container.innerHTML = '';
  senpaiData.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'senpai-group';
    const title = document.createElement('div');
    title.textContent = group.major;
    title.style.fontWeight = 'bold';
    groupDiv.appendChild(title);
    group.names.forEach(name => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'senpai';
      input.value = name;
      label.appendChild(input);
      label.appendChild(document.createTextNode(name));
      groupDiv.appendChild(label);
    });
    container.appendChild(groupDiv);
  });
}

// ディスカッションスペース選択肢生成
function renderDiscussionChoices() {
  const container = document.getElementById('discussion-choices');
  container.innerHTML = '';
  const choices = [
    { id: 'ds-yes', value: 'yes', label: 'はい', required: true },
    { id: 'ds-no', value: 'no', label: 'いいえ', required: false }
  ];
  choices.forEach(choice => {
    const label = document.createElement('label');
    label.className = 'choice';
    const input = document.createElement('input');
    input.type = 'radio';
    input.id = choice.id;
    input.name = 'ds';
    input.value = choice.value;
    if (choice.required) input.required = true;
    label.appendChild(input);
    label.appendChild(document.createTextNode(choice.label));
    container.appendChild(label);
  });
}

// MediColle実行委員会「はい・いいえ」選択肢生成
function renderCommitteeChoices() {
  const container = document.getElementById('committee-choices');
  container.innerHTML = '';
  const choices = [
    { id: 'committee-yes', value: 'yes', label: 'ある', required: true },
    { id: 'committee-no', value: 'no', label: 'ない', required: false }
  ];
  choices.forEach(choice => {
    const label = document.createElement('label');
    label.className = 'choice';
    const input = document.createElement('input');
    input.type = 'radio';
    input.id = choice.id;
    input.name = 'committee';
    input.value = choice.value;
    if (choice.required) input.required = true;
    label.appendChild(input);
    label.appendChild(document.createTextNode(choice.label));
    container.appendChild(label);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  showQuestion(currentQuestion);
  renderSenpaiList();
  renderDiscussionChoices();
  renderCommitteeChoices();

  // 次へボタン
  document.querySelectorAll('.next-btn').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      // 必須入力チェック
      const qDiv = btn.closest('.question');
      const inputs = qDiv.querySelectorAll('input, textarea, select');
      let valid = true;
      inputs.forEach(input => {
        if (input.required && !input.value) valid = false;
        if (input.type === 'radio' && input.required) {
          const name = input.name;
          if (!qDiv.querySelector(`input[name="${name}"]:checked`)) valid = false;
        }
      });
      if (!valid) {
        alert('必須項目を入力してください');
        return;
      }
      if (currentQuestion < TOTAL_QUESTIONS) {
        currentQuestion++;
        showQuestion(currentQuestion);
      }
    });
  });

  // 戻るボタン
  document.querySelectorAll('.back-btn').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
      }
    });
  });

  // フォーム送信
  document.getElementById('survey-form').addEventListener('submit', e => {
    e.preventDefault();
    // ここで送信処理（例: データ収集やAPI送信）
    document.getElementById('survey-form').style.display = 'none';
    document.getElementById('progress-bar').style.width = '100%';
    document.getElementById('thanks-message').style.display = 'block';
  });
}); 