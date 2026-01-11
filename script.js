// Project data stored in localStorage
const STORAGE_KEY = "jsProjects";

// Default projects
const defaultProjects = [
  {
    id: 1,
    name: "Memory Card Game",
    emoji: "🂠",
    description:
      "A classic memory matching game where you flip cards to find matching pairs.",
    file: "memory-card-game/index.html",
    jsFile: "memory-card-game/memory-card.js",
    tags: ["Game", "Match", "Interactive"],
  },
  {
    id: 2,
    name: "Snake Game",
    emoji: "🐍",
    description:
      "Classic snake game where you control a snake and eat food to grow longer.",
    file: "snake-game/index.html",
    jsFile: "snake-game/snake-game.js",
    tags: ["Game", "Arcade", "Interactive"],
  },
  {
    id: 3,
    name: "Pomodoro Timer",
    emoji: "⏱️",
    description:
      "Classic snake game where you control a snake and eat food to grow longer.",
    file: "pomodoro-timer/index.html",
    jsFile: "pomodoro-timer/pomodoro-timer.js",
    tags: ["Game", "Arcade", "Interactive"],
  },
];

// Initialize
let projects = loadProjects();

const projectsGrid = document.getElementById("projectsGrid");
const emptyState = document.getElementById("emptyState");
const projectModal = document.getElementById("projectModal");
const addProjectModal = document.getElementById("addProjectModal");
const closeBtn = document.getElementById("closeBtn");
const closeAddBtn = document.getElementById("closeAddBtn");

// Initialize page
init();

// ========== FUNCTIONS ==========
function init() {
  renderProjects();
  attachEventListeners();
}

function loadProjects() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultProjects;
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function renderProjects() {
  projectsGrid.innerHTML = "";

  if (projects.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  projects.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.className = "project-card";
    projectCard.innerHTML = `
            <div class="project-header">
                <span class="project-emoji">${project.emoji}</span>
                <h3 class="project-title">${project.name}</h3>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-footer">
                <button class="btn btn-primary" onclick="openProject(${project.id})">View Code</button>
            </div>
        `;
    projectsGrid.appendChild(projectCard);
  });
}

async function openProject(id) {
  const project = projects.find((p) => p.id === id);
  if (project) {
    const modalBody = document.getElementById("modalBody");

    // Load HTML file content
    let htmlContent = "// HTML file not found or unable to load";
    let jsContent = "// JavaScript file not found or unable to load";

    try {
      const htmlResponse = await fetch(project.file);
      if (htmlResponse.ok) {
        htmlContent = await htmlResponse.text();
      }
    } catch (error) {
      console.log("Could not load HTML file:", error);
    }

    try {
      const jsResponse = await fetch(project.jsFile);
      if (jsResponse.ok) {
        jsContent = await jsResponse.text();
      }
    } catch (error) {
      console.log("Could not load JS file:", error);
    }

    // Escape HTML special characters for display
    const escapeHtml = (text) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return text.replace(/[&<>"']/g, (m) => map[m]);
    };

    modalBody.innerHTML = `
      <div class="code-viewer">
        <div class="project-info">
          <h3>${project.emoji} ${project.name}</h3>
            <a href="${
            project.file
          }" target="_blank" class="">View Output</a>
        </div>

        <div class="code-tabs">
          <button class="code-tab active" onclick="switchTab(event, 'html-tab')">📄 HTML</button>
          <button class="code-tab" onclick="switchTab(event, 'js-tab')">⚙️ JavaScript</button>
        </div>

        <div id="html-tab" class="code-content active">
          <pre><code class="language-html">${escapeHtml(
            htmlContent
          )}</code></pre>
        </div>

        <div id="js-tab" class="code-content">
          <pre><code class="language-javascript">${escapeHtml(
            jsContent
          )}</code></pre>
        </div>

       
      </div>
    `;

    projectModal.classList.add("show");

    // Apply syntax highlighting
    setTimeout(() => {
      document.querySelectorAll("code").forEach((el) => {
        window.hljs.highlightElement(el);
      });
    }, 0);
  }
}

function switchTab(event, tabId) {
  // Hide all code content
  document.querySelectorAll(".code-content").forEach((el) => {
    el.classList.remove("active");
  });

  // Remove active class from all tabs
  document.querySelectorAll(".code-tab").forEach((el) => {
    el.classList.remove("active");
  });

  // Show selected tab content
  document.getElementById(tabId).classList.add("active");

  // Add active class to clicked tab
  event.target.classList.add("active");

  // Re-highlight code
  setTimeout(() => {
    document.querySelectorAll("code").forEach((el) => {
      window.hljs.highlightElement(el);
    });
  }, 0);
}

function copyToClipboard(tabId) {
  const codeElement = document.querySelector(`#${tabId} code`);
  const text = codeElement.textContent;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Code copied to clipboard!");
    })
    .catch(() => {
      alert("Failed to copy code");
    });
}

function closeModal() {
  projectModal.classList.remove("show");
}

function attachEventListeners() {
  closeBtn.addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === projectModal) closeModal();
  });
}
