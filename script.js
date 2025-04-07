let allQuestions = [];
let quizQuestions = [];
let currentIndex = 0;

function showError(message) {
  const errorBox = document.getElementById("errorBox");
  errorBox.textContent = message;
  console.error("BZF QUIZ ERROR:", message);
}

async function loadQuestions() {
  try {
    const res = await fetch("BZF_E_Questions_Cleaned.json");
    if (!res.ok) {
      showError(`Failed to load questions JSON. Status: ${res.status}`);
      return;
    }
    allQuestions = await res.json();
    console.log("Loaded", allQuestions.length, "questions.");
  } catch (err) {
    showError("Could not load questions. " + err.message);
  }
}

function shuffle(array) {
  return array.map(v => [Math.random(), v])
              .sort((a, b) => a[0] - b[0])
              .map(v => v[1]);
}

function startQuiz() {
  if (allQuestions.length === 0) {
    showError("No questions loaded. Please check that the JSON file is present and named correctly.");
    return;
  }

  const count = parseInt(document.getElementById("questionCount").value);
  if (isNaN(count) || count <= 0) {
    showError("Invalid number of questions selected.");
    return;
  }

  quizQuestions = shuffle(allQuestions).slice(0, count).map(q => {
    const options = shuffle(["A", "B", "C", "D"]);
    return { ...q, shuffled: options, userAnswer: null };
  });

  document.getElementById("errorBox").textContent = "";
  renderSidebar();
  currentIndex = 0;
  renderQuestion();
  document.getElementById("quizArea").style.display = "block";
}

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = "";
  quizQuestions.forEach((q, i) => {
    const btn = document.createElement("button");
    btn.textContent = `Q${i + 1}`;
    btn.onclick = () => {
      saveAnswer();
      currentIndex = i;
      renderQuestion();
    };

    if (i === currentIndex) {
      btn.style.backgroundColor = "#007bff";
      btn.style.color = "white";
    } else if (q.userAnswer) {
      btn.style.backgroundColor = "#28a745";
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = "#ccc";
      btn.style.color = "black";
    }

    sidebar.appendChild(btn);
  });
}

function renderQuestion() {
  const q = quizQuestions[currentIndex];
  const container = document.getElementById("questionBox");
  container.innerHTML = `
    <h3>Q${currentIndex + 1} (Ref #${q.number}): ${q.question}</h3>
    ${q.shuffled.map(opt => `
      <label class="option">
        <input type="radio" name="q${currentIndex}" value="${opt}" ${q.userAnswer === opt ? "checked" : ""}>
        ${opt}. ${q[opt]}
      </label>
    `).join("")}
  `;
  renderSidebar(); // Update highlighting
}

function getSelectedAnswer(idx) {
  const selected = document.querySelector(`input[name="q${idx}"]:checked`);
  return selected ? selected.value : null;
}

function saveAnswer() {
  const selected = getSelectedAnswer(currentIndex);
  quizQuestions[currentIndex].userAnswer = selected;
}

function nextQuestion() {
  saveAnswer();
  if (currentIndex < quizQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  saveAnswer();
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

function submitQuiz() {
  saveAnswer();
  let correct = 0;
  quizQuestions.forEach((q) => {
    if (q.userAnswer === q.correct) correct++;
  });
  document.getElementById("result").textContent = `You got ${correct} out of ${quizQuestions.length} correct.`;
}
