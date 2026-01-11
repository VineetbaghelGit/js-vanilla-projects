// ===== CONFIG =====
const MODES = {
  WORK: 25 * 60, // 25 minutes
  SHORT_BREAK: 5 * 60, // 5 minutes
  LONG_BREAK: 15 * 60, // 15 minutes
};

// ===== STATE =====
let timeLeft = MODES.WORK;
let intervalId = null;
let mode = "WORK";
let workCount = 0;

// ===== ELEMENTS =====
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("stop"); // renamed logically
const resetBtn = document.getElementById("reset");
const timeEl = document.getElementById("time");
const modeEl = document.getElementById("mode");

// ===== EVENT LISTENERS =====
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// ===== FUNCTIONS =====
function startTimer() {
  if (intervalId) return; // Already running, do nothing

  intervalId = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      switchMode();
    }

    updateUI();
  }, 1000);
}

function pauseTimer() {
  if (!intervalId) return; // Not running
  clearInterval(intervalId);
  intervalId = null; // Pause!
}

function resetTimer() {
  clearInterval(intervalId);
  intervalId = null;
  mode = "WORK";
  timeLeft = MODES.WORK;
  workCount = 0;
  updateUI();
}

function switchMode() {
  clearInterval(intervalId);
  intervalId = null;

  if (mode === "WORK") {
    workCount++;
    if (workCount < 4) {
      mode = "SHORT_BREAK";
      timeLeft = MODES.SHORT_BREAK;
    } else {
      mode = "LONG_BREAK";
      timeLeft = MODES.LONG_BREAK;
      workCount = 0;
    }
  } else {
    mode = "WORK";
    timeLeft = MODES.WORK;
  }

  startTimer(); // auto-start next session
}

function updateUI() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  modeEl.textContent = mode;

  startBtn.textContent = intervalId ? "Running..." : "Start / Continue";
  pauseBtn.textContent = intervalId ? "Pause" : "Paused";
}


// ===== INIT =====
updateUI();
