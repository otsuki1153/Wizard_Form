const PAGE_ORDER = ["index","habitos","impacto","acoes","conclusao"]; 
const STORAGE_KEY = "sustentabilidade_por_pagina";
const PAGE_KEY = "actualPage"; 

function getCurrentPageId() {

  return document.body.getAttribute("data-page") || "index";
}

function loadAllPagesData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

function saveAllPagesData(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function updateProgressBar() {
  const progressEl = document.querySelector(".progress");
  if (!progressEl) return;

  const pageId = getCurrentPageId();
  const idx = PAGE_ORDER.indexOf(pageId);
  const totalSteps = PAGE_ORDER.length - 1; 
  const percent = idx <= 0 ? 0 : Math.round((idx / totalSteps) * 100);
  progressEl.style.width = percent + "%";

  localStorage.setItem(PAGE_KEY, idx + 1); 
}

// Lê selects & textareas da página e retorna um array com valores numéricos e textuais
function readValuesFromPage() {
  const values = [];

  // 🔹 Lê todos os selects (respostas com pontuação)
  const selects = Array.from(document.querySelectorAll("select"));
  selects.forEach(s => {
    const v = Number(s.value);
    values.push(isNaN(v) ? 0 : v);
  });

  // 🔹 Lê todos os textareas (respostas abertas)
  const texts = Array.from(document.querySelectorAll("textarea"));
  texts.forEach(t => {
    const content = t.value.trim();
    if (content.length > 0) values.push(content); // salva o texto como string
  });

  return values;
}

function savePageAnswers() {
  const pageId = getCurrentPageId();
  const data = loadAllPagesData();
  const values = readValuesFromPage();
  data[pageId] = values; // substitui toda a página
  saveAllPagesData(data);
  console.log(`Salvo page "${pageId}":`, values);
  return data;
}

function aggregateAnswers() {
  const data = loadAllPagesData();
  const pages = PAGE_ORDER;
  const all = [];
  pages.forEach(pid => {
    const arr = Array.isArray(data[pid]) ? data[pid] : [];
    // push each numeric value
    arr.forEach(v => all.push(Number(v) || 0));
  });
  return all;
}

function wireNavigationButtons() {
  document.querySelectorAll(".next-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      // salva a página atual
      savePageAnswers();
      const href = btn.getAttribute("href");
      if (href) {
        
        setTimeout(() => window.location.href = href, 50);
      }
    });
  });

  document.querySelectorAll(".prev-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      
      savePageAnswers();
      const href = btn.getAttribute("href");
      if (href) {
        setTimeout(() => window.location.href = href, 50);
      }
    });
  });
}

function wireFinalButton() {
  const final = document.querySelector(".final-btn");
  if (!final) return;
  final.addEventListener("click", e => {
    e.preventDefault();
    savePageAnswers();
    const href = final.getAttribute("href") || "resultado.html";
    setTimeout(() => window.location.href = href, 50);
  });
}

function controlNextButtonState() {
  const next = document.querySelector(".next-btn");
  if (!next) return;
  const inputs = Array.from(document.querySelectorAll("select, textarea"));

  const check = () => {
    let ok = true;
    inputs.forEach(inp => {
      if (inp.tagName === "SELECT" && (inp.value === "" || inp.value === null)) ok = false;
      if (inp.tagName === "TEXTAREA" && inp.hasAttribute("required") && inp.value.trim() === "") ok = false;
    });
    if (ok) {
      next.style.opacity = "1";
      next.style.pointerEvents = "auto";
    } else {
      next.style.opacity = "0.4";
      next.style.pointerEvents = "none";
    }
  };

  inputs.forEach(i => {
    i.addEventListener("change", check);
    i.addEventListener("input", check);
  });

  check();
}

function computeResultAndRender() {
  const answers = aggregateAnswers(); 
  console.log("Aggregate answers:", answers);

  // If no answers, exit
  if (!answers.length) {
    console.log("Nenhuma resposta encontrada.");
    return {percent:0, total:0, max:0};
  }

  const maxPer = Math.max(4, ...answers) >= 4 ? 4 : 3; 

  const total = answers.reduce((s,v)=> s + (isNaN(v) ? 0 : v), 0);

  const any4 = answers.some(v => Number(v) === 4);
  const max = answers.length * (any4 ? 4 : 3);
  const percent = max > 0 ? Math.round((total / max) * 100) : 0;

  return {percent, total, max};
}

function fullReset() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PAGE_KEY);
  console.log("Storage limpo");
}


document.addEventListener("DOMContentLoaded", () => {
  updateProgressBar();
  wireNavigationButtons();
  wireFinalButton();
  controlNextButtonState();

  if (getCurrentPageId() === "resultado") {
    const res = computeResultAndRender();
    const scoreEl = document.querySelector(".score");
    const levelEl = document.querySelector(".level");
    const msgEl = document.querySelector(".message");

    if (scoreEl) scoreEl.textContent = `Pontuação: ${res.percent}%`;
    let nivel="", msg="";
    if (res.percent <= 40) {
      nivel = "🌾 Iniciante Verde";
      msg = "Você está começando sua jornada sustentável! Pequenas mudanças farão a diferença.";
    } else if (res.percent <= 70) {
      nivel = "🌿 Consciente Ambiental";
      msg = "Você já tem boas práticas — continue evoluindo!";
    } else if (res.percent <= 90) {
      nivel = "🌳 Guardião do Planeta";
      msg = "Excelente! Você é exemplo de sustentabilidade.";
    } else {
      nivel = "🌎 Herói da Terra";
      msg = "Uau! Você vive de forma alinhada à sustentabilidade.";
    }
    if (levelEl) levelEl.textContent = `Nível: ${nivel}`;
    if (msgEl) msgEl.textContent = msg;
  }
});
