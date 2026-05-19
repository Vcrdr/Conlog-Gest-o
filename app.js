const profiles = {
  funcionario: {
    name: "Marina Costa",
    role: "Funcionaria administrativa",
    defaultView: "dashboard",
  },
  gestor: {
    name: "Carlos Mendes",
    role: "Gestor administrativo",
    defaultView: "gestor",
  },
  rh: {
    name: "Ana Ribeiro",
    role: "RH/Admin",
    defaultView: "admin",
  },
};

const competencies = [
  { name: "Comunicacao", score: 3.2 },
  { name: "Organizacao", score: 4.7 },
  { name: "Trabalho em equipe", score: 4.1 },
  { name: "Lideranca", score: 3.6 },
  { name: "Resolucao de problemas", score: 2.9 },
  { name: "Gestao de tempo", score: 4.4 },
];

const questions = [
  {
    category: "Comunicacao",
    text: "Voce consegue se comunicar bem com outros setores?",
    answer: 3,
  },
  {
    category: "Comunicacao",
    text: "Voce entende claramente suas tarefas antes de inicia-las?",
    answer: 4,
  },
  {
    category: "Organizacao",
    text: "Voce consegue manter suas atividades organizadas?",
    answer: 5,
  },
  {
    category: "Trabalho em equipe",
    text: "Voce coopera com colegas para resolver problemas?",
    answer: 4,
  },
  {
    category: "Resolucao de problemas",
    text: "Voce tenta resolver dificuldades antes de repassar a demanda?",
    answer: 3,
  },
  {
    category: "Gestao de tempo",
    text: "Seus prazos costumam ser cumpridos?",
    answer: 4,
  },
];

const monthlyEvolution = [
  { month: "Jan", value: 62 },
  { month: "Fev", value: 66 },
  { month: "Mar", value: 71 },
  { month: "Abr", value: 75 },
  { month: "Mai", value: 78 },
  { month: "Jun", value: 82 },
];

const team = [
  { name: "Marina Costa", area: "Administrativo", score: 4.1, status: "Bom" },
  { name: "Joao Almeida", area: "Financeiro", score: 4.4, status: "Bom" },
  { name: "Patricia Lima", area: "Comercial", score: 3.2, status: "Atencao" },
  { name: "Rafael Souza", area: "Operacoes", score: 3.8, status: "Bom" },
];

const pageTitles = {
  dashboard: "Dashboard",
  questionario: "Questionario",
  resultado: "Resultado",
  gestor: "Painel do gestor",
  admin: "Painel administrativo",
};

const navButtons = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const pageTitle = document.querySelector("#pageTitle");
const profileSelect = document.querySelector("#profileSelect");
const activeUserName = document.querySelector("#activeUserName");
const activeUserRole = document.querySelector("#activeUserRole");
const toast = document.querySelector("#toast");

function showView(viewId) {
  views.forEach((view) => view.classList.toggle("active-view", view.id === viewId));
  navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  pageTitle.textContent = pageTitles[viewId];
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function renderMonthlyChart() {
  const chart = document.querySelector("#monthlyChart");
  chart.innerHTML = monthlyEvolution
    .map(
      (item) => `
        <div class="bar">
          <div class="bar-fill" style="height: ${item.value}%"></div>
          <span>${item.month}</span>
        </div>
      `,
    )
    .join("");
}

function renderCompetencies() {
  const list = document.querySelector("#competencyList");
  list.innerHTML = competencies
    .map(
      (item) => `
        <div class="competency-row">
          <div class="competency-top">
            <strong>${item.name}</strong>
            <span>${item.score.toFixed(1)} / 5</span>
          </div>
          <div class="meter">
            <div class="meter-fill" style="width: ${(item.score / 5) * 100}%"></div>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderQuestions() {
  const list = document.querySelector("#questionList");
  list.innerHTML = questions
    .map(
      (question, questionIndex) => `
        <article class="question-row">
          <div class="question-top">
            <div>
              <span class="eyebrow">${question.category}</span>
              <strong>${question.text}</strong>
            </div>
            <span>Nota ${question.answer}</span>
          </div>
          <div class="rating" data-question="${questionIndex}">
            ${[1, 2, 3, 4, 5]
              .map(
                (value) => `
                  <button class="${value === question.answer ? "selected" : ""}" data-value="${value}" aria-label="Nota ${value}">
                    ${value}
                  </button>
                `,
              )
              .join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderTeam() {
  const table = document.querySelector("#teamTable");
  const rows = team
    .map(
      (person) => `
        <div class="team-row">
          <strong>${person.name}</strong>
          <span>${person.area}</span>
          <span>${person.score.toFixed(1)} / 5</span>
          <span class="status ${person.status === "Bom" ? "good" : "attention"}">${person.status}</span>
        </div>
      `,
    )
    .join("");

  table.innerHTML = `
    <div class="team-row header">
      <span>Funcionario</span>
      <span>Setor</span>
      <span>Media</span>
      <span>Status</span>
    </div>
    ${rows}
  `;
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

profileSelect.addEventListener("change", (event) => {
  const profile = profiles[event.target.value];
  activeUserName.textContent = profile.name;
  activeUserRole.textContent = profile.role;
  showView(profile.defaultView);
  showToast(`Login demonstrativo: ${profile.role}`);
});

document.querySelector("#questionList").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-value]");
  if (!button) return;

  const rating = button.closest(".rating");
  const questionIndex = Number(rating.dataset.question);
  questions[questionIndex].answer = Number(button.dataset.value);
  renderQuestions();
});

document.querySelector("#saveAnswers").addEventListener("click", () => {
  showToast("Respostas salvas na demonstracao. Proximo passo: ligar ao banco de dados.");
});

renderMonthlyChart();
renderCompetencies();
renderQuestions();
renderTeam();
