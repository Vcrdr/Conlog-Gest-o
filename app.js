const profiles = {
  funcionario: {
    name: "Marina Costa",
    role: "Funcionaria administrativa",
    defaultView: "dashboard",
    allowedViews: ["dashboard", "questionario", "resultado"],
  },
  gestor: {
    name: "Carlos Mendes",
    role: "Gestor administrativo",
    defaultView: "gestor",
    allowedViews: ["dashboard", "gestor", "resultado"],
  },
  rh_admin: {
    name: "Ana Ribeiro",
    role: "RH/Admin",
    defaultView: "admin",
    allowedViews: ["dashboard", "questionario", "resultado", "gestor", "admin"],
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

let questions = [
  {
    id: null,
    category: "Comunicacao",
    text: "Voce consegue se comunicar bem com outros setores?",
    answer: 3,
  },
  {
    id: null,
    category: "Comunicacao",
    text: "Voce entende claramente suas tarefas antes de inicia-las?",
    answer: 4,
  },
  {
    id: null,
    category: "Organizacao",
    text: "Voce consegue manter suas atividades organizadas?",
    answer: 5,
  },
  {
    id: null,
    category: "Trabalho em equipe",
    text: "Voce coopera com colegas para resolver problemas?",
    answer: 4,
  },
  {
    id: null,
    category: "Resolucao de problemas",
    text: "Voce tenta resolver dificuldades antes de repassar a demanda?",
    answer: 3,
  },
  {
    id: null,
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
const activeUserName = document.querySelector("#activeUserName");
const activeUserRole = document.querySelector("#activeUserRole");
const toast = document.querySelector("#toast");
const appShell = document.querySelector("#appShell");
const loginScreen = document.querySelector("#loginScreen");
const loginForm = document.querySelector("#loginForm");
const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");
const loginMessage = document.querySelector("#loginMessage");
const logoutButton = document.querySelector("#logoutButton");
const sessionEmail = document.querySelector("#sessionEmail");
const supabaseConfig = window.GESTAO_ADM_SUPABASE;
const hasSupabaseConfig =
  Boolean(supabaseConfig?.url) &&
  Boolean(supabaseConfig?.publishableKey) &&
  supabaseConfig.publishableKey !== "COLE_AQUI_SUA_PUBLISHABLE_KEY";
const database =
  hasSupabaseConfig && window.supabase
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey)
    : null;
let currentProfile = null;

function showView(viewId) {
  if (currentProfile && !currentProfile.allowedViews.includes(viewId)) {
    showToast("Seu perfil nao tem acesso a esta area.");
    return;
  }

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
  if (!questions.length) {
    list.innerHTML = `
      <div class="analysis-card">
        <strong>Nenhuma pergunta encontrada</strong>
        <p>Confira se o seed.sql foi executado e se as politicas de leitura foram criadas no Supabase.</p>
      </div>
    `;
    return;
  }

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

function getProfileLabel(role) {
  const labels = {
    funcionario: "Funcionario",
    gestor: "Gestor",
    rh_admin: "RH/Admin",
  };

  return labels[role] || "Usuario";
}

function normalizeProfile(profile) {
  const fallback = profiles[profile.role] || profiles.funcionario;

  return {
    ...fallback,
    id: profile.id,
    name: profile.name,
    email: profile.email,
    roleKey: profile.role,
    role: profile.job_title || getProfileLabel(profile.role),
  };
}

function updateNavigationForRole() {
  navButtons.forEach((button) => {
    const canAccess = currentProfile.allowedViews.includes(button.dataset.view);
    button.hidden = !canAccess;
  });
}

function openAuthenticatedApp(profile) {
  currentProfile = normalizeProfile(profile);
  activeUserName.textContent = currentProfile.name;
  activeUserRole.textContent = currentProfile.role;
  sessionEmail.textContent = currentProfile.email;
  loginMessage.textContent = "";
  loginForm.reset();
  document.body.classList.add("authenticated");
  appShell.classList.remove("is-hidden");
  loginScreen.classList.add("is-hidden");
  updateNavigationForRole();
  showView(currentProfile.defaultView);
}

function closeAuthenticatedApp() {
  currentProfile = null;
  document.body.classList.remove("authenticated");
  appShell.classList.add("is-hidden");
  loginScreen.classList.remove("is-hidden");
  navButtons.forEach((button) => {
    button.hidden = false;
  });
}

async function loadProfileByEmail(email) {
  const { data, error } = await database
    .from("profiles")
    .select("id, name, email, role, job_title")
    .eq("email", email)
    .single();

  if (error) {
    throw new Error("Login feito, mas nao encontrei um perfil cadastrado para este e-mail.");
  }

  return data;
}

async function handleLogin(event) {
  event.preventDefault();
  loginMessage.textContent = "";

  if (!database) {
    loginMessage.textContent = "Configure a Publishable key do Supabase em supabase-config.js.";
    return;
  }

  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  const submitButton = loginForm.querySelector("button");
  submitButton.disabled = true;
  submitButton.textContent = "Entrando...";

  try {
    const { data, error } = await database.auth.signInWithPassword({ email, password });
    if (error) throw new Error("E-mail ou senha invalidos.");

    const profile = await loadProfileByEmail(data.user.email);
    openAuthenticatedApp(profile);
    showToast("Login realizado com sucesso.");
  } catch (error) {
    loginMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Entrar";
  }
}

async function handleLogout() {
  if (database) {
    await database.auth.signOut();
  }

  closeAuthenticatedApp();
  showToast("Sessao encerrada.");
}

function ensureCanSaveAnswers() {
  if (!database) {
    throw new Error("Configure a Publishable key do Supabase em supabase-config.js.");
  }

  if (!currentProfile) {
    throw new Error("Entre na plataforma antes de salvar respostas.");
  }

  if (!questions.every((question) => question.id)) {
    throw new Error("As perguntas precisam ser carregadas do Supabase antes de salvar.");
  }
}

async function saveAnswers() {
  ensureCanSaveAnswers();

  const now = new Date();
  const title = `Autoavaliacao - ${now.toLocaleDateString("pt-BR")}`;
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

  const { data: evaluation, error: evaluationError } = await database
    .from("evaluations")
    .insert({
      employee_id: currentProfile.id,
      evaluator_id: currentProfile.id,
      title,
      status: "submitted",
      period_start: periodStart,
      period_end: periodEnd,
      submitted_at: now.toISOString(),
    })
    .select("id")
    .single();

  if (evaluationError) {
    throw new Error("Nao consegui criar a avaliacao no banco.");
  }

  const answers = questions.map((question) => ({
    evaluation_id: evaluation.id,
    question_id: question.id,
    score: question.answer,
  }));

  const { error: answersError } = await database.from("answers").insert(answers);

  if (answersError) {
    throw new Error("A avaliacao foi criada, mas nao consegui salvar as respostas.");
  }

  return evaluation.id;
}

async function restoreSession() {
  if (!database) return;

  const { data } = await database.auth.getSession();
  const user = data.session?.user;
  if (!user?.email) return;

  try {
    const profile = await loadProfileByEmail(user.email);
    openAuthenticatedApp(profile);
  } catch (error) {
    await database.auth.signOut();
    closeAuthenticatedApp();
    loginMessage.textContent = error.message;
  }
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

loginForm.addEventListener("submit", handleLogin);
logoutButton.addEventListener("click", handleLogout);

document.querySelector("#questionList").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-value]");
  if (!button) return;

  const rating = button.closest(".rating");
  const questionIndex = Number(rating.dataset.question);
  questions[questionIndex].answer = Number(button.dataset.value);
  renderQuestions();
});

document.querySelector("#saveAnswers").addEventListener("click", async () => {
  const button = document.querySelector("#saveAnswers");
  button.disabled = true;
  button.textContent = "Salvando...";

  try {
    await saveAnswers();
    showToast("Respostas salvas no banco com sucesso.");
    showView("resultado");
  } catch (error) {
    showToast(error.message);
  } finally {
    button.disabled = false;
    button.textContent = "Salvar respostas";
  }
});

async function loadQuestionsFromDatabase() {
  if (!database) return;

  const { data, error } = await database
    .from("questions")
    .select("id, question_text, competencies(name)")
    .eq("active", true)
    .order("question_text");

  if (error) {
    console.error("Erro ao buscar perguntas no Supabase:", error);
    showToast("Nao consegui carregar o banco. Mantive os dados demonstrativos.");
    return;
  }

  questions = data.map((item) => ({
    id: item.id,
    category: item.competencies?.name || "Competencia",
    text: item.question_text,
    answer: 3,
  }));

  renderQuestions();
  showToast("Perguntas carregadas do Supabase.");
}

async function startApp() {
  renderMonthlyChart();
  renderCompetencies();
  renderQuestions();
  renderTeam();
  await loadQuestionsFromDatabase();
  await restoreSession();
}

startApp();
