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
  return array.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);
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
    return { ...q, shuffled: options };
  });

  document.getElementById("errorBox").textContent = ""; // Clear error
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
    btn.textContent = q.number;
    btn.onclick = () => {
      currentIndex = i;
      renderQuestion();
    };
    sidebar.appendChild(btn);
  });
}

function renderQuestion() {
  const q = quizQuestions[currentIndex];
  if (!q) {
    showError(`No question found at index ${currentIndex}`);
    return;
  }

  const container = document.getElementById("questionBox");
  container.innerHTML = `
    <h3>Q${currentIndex + 1} (Ref #${q.number}): ${q.question}</h3>
    ${q.shuffled.map(opt => `
      <label class="option">
        <input type="radio" name="q${currentIndex}" value="${opt}" ${getSelectedAnswer(currentIndex) === opt ? "checked" : ""}>
        ${opt}. ${q[opt]}
      </label>
    `).join("")}
  `;
}

function getSelectedAnswer(idx) {
  const selected = document.querySelector(`input[name="q${idx}"]:checked`);
  return selected ? selected.value : null;
}

function nextQuestion() {
  if (currentIndex < quizQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

function submitQuiz() {
  let correct = 0;
  quizQuestions.forEach((q, i) => {
    const selected = getSelectedAnswer(i);
    if (selected === q.correct) correct++;
  });
  document.getElementById("result").textContent = `You got ${correct} out of ${quizQuestions.length} correct.`;
}

// Call loadQuestions on page load
loadQuestions();
