const timer = {
  pomodoro: 1500,
  shortBreak: 300,
  longBreak: 900,
  longBreakInterval: 4,
  sessions: 0,
  mode: "pomodoro",
};

let interval;

const mainButton = document.getElementById("js-btn");
const decreaseButton = document.getElementById("js-decrease");
const increaseButton = document.getElementById("js-increase");
const fullscreenButton = document.getElementById("js-fullscreen");

const buttonSound = document.getElementById("button-sound");
const pomodoroEndSound = document.getElementById("pomodoro-end-sound");

mainButton.addEventListener("click", () => {
  playSound(buttonSound);
  const { action } = mainButton.dataset;
  if (action === "start") {
    startTimer();
  } else {
    stopTimer();
  }
});

decreaseButton.addEventListener("click", () => {
  playSound(buttonSound);
  adjustTimer(-300);
});

increaseButton.addEventListener("click", () => {
  playSound(buttonSound);
  adjustTimer(300);
});

fullscreenButton.addEventListener("click", () => {
  playSound(buttonSound);
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  switchMode("pomodoro");
});

const modeButtons = document.querySelector("#js-mode-buttons");
modeButtons.addEventListener("click", handleMode);

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  playSound(buttonSound);
  timer.mode = mode;
  switchMode(mode);
  stopTimer();
}

function switchMode(mode) {
  timer.remainingTime = {
    total: timer[mode],
    minutes: Math.floor(timer[mode] / 60),
    seconds: timer[mode] % 60,
  };

  document
    .querySelectorAll("button[data-mode]")
    .forEach((e) => e.classList.remove("active"));
  document.querySelector(`[data-mode="${mode}"]`).classList.add("active");

  document.body.className = mode; // Update the background based on the mode

  updateClock();
}

function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, "0");
  const seconds = `${remainingTime.seconds}`.padStart(2, "0");

  const min = document.getElementById("js-minutes");
  const sec = document.getElementById("js-seconds");
  min.textContent = minutes;
  sec.textContent = seconds;

  document.title = `${minutes}:${seconds} | Focus Timer`;
}

function startTimer() {
  const { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  mainButton.dataset.action = "stop";
  mainButton.textContent = "Stop";
  mainButton.classList.add("active");

  interval = setInterval(function () {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    if (timer.remainingTime.total <= 0) {
      clearInterval(interval);
      playSound(pomodoroEndSound);
      handleTimerCompletion();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  mainButton.dataset.action = "start";
  mainButton.textContent = "Start";
  mainButton.classList.remove("active");
}

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;
  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);
  return {
    total,
    minutes,
    seconds,
  };
}

function adjustTimer(amount) {
  const mode = timer.mode;
  if (timer[mode] + amount > 0) {
    timer[mode] += amount;
    if (timer.mode === mode) {
      switchMode(mode);
    }
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function handleTimerCompletion() {
  switch (timer.mode) {
    case "pomodoro":
      timer.sessions++;
      if (timer.sessions % timer.longBreakInterval === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
      break;
    default:
      switchMode("pomodoro");
  }
  stopTimer(); // Ensure the timer stops and the button is not automatically pressed
}

document.addEventListener("DOMContentLoaded", () => {
  const todoToggle = document.getElementById("js-todo-toggle");
  const todoList = document.getElementById("js-todo-list");
  const taskInput = document.getElementById("taskInput");
  const addTaskButton = document.getElementById("addTaskButton");
  const tasksUl = document.getElementById("tasks");
  const clearTasksButton = document.getElementById("clear-tasks");

  todoToggle.addEventListener("click", () => {
    todoList.style.display =
      todoList.style.display === "none" || todoList.style.display === ""
        ? "block"
        : "none";
  });

  addTaskButton.addEventListener("click", function () {
    addTaskFromInput();
  });

  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTaskFromInput();
    }
  });

  function addTaskFromInput() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      addTask(taskText);
      taskInput.value = "";
    }
  }

  function addTask(taskText) {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="task-text">${taskText}</span>
      <input type="checkbox" class="task-checkbox"/>
      <button class="delete-task"><i class="fas fa-trash-alt"></i></button>
    `;
    tasksUl.appendChild(li);
  }

  tasksUl.addEventListener("click", function (e) {
    if (
      e.target &&
      e.target.nodeName === "INPUT" &&
      e.target.type === "checkbox"
    ) {
      const taskText = e.target.previousElementSibling;
      taskText.style.textDecoration = e.target.checked
        ? "line-through"
        : "none";
    }

    if (
      e.target &&
      (e.target.classList.contains("fa-trash-alt") ||
        e.target.classList.contains("delete-task"))
    ) {
      e.target.closest("li").remove();
    }
  });

  clearTasksButton.addEventListener("click", () => {
    tasksUl.innerHTML = "";
  });

  // Digital clock
  function updateDigitalClock() {
    const clock = document.getElementById("digital-clock");
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const timeString = `${hours}:${minutes} <span class="ampm">${ampm}</span>`;

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = days[now.getDay()];
    const month = now.toLocaleString("default", { month: "long" });
    const day = now.getDate();
    const year = now.getFullYear();
    const dateString = `${dayName} - ${month} ${day}, ${year}`;

    clock.innerHTML = `<span class="time">${timeString}</span><span class="day-date">${dateString}</span>`;
  }

  setInterval(updateDigitalClock, 1000);
  updateDigitalClock();
  
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return; // ignore typing in text boxes

    switch (e.code) {
      case "Space":
        e.preventDefault();
        mainButton.dataset.action === "start" ? startTimer() : stopTimer();
        break;

      case "ArrowRight":
        changeMode(1); // next mode
        break;

      case "ArrowLeft":
        changeMode(-1); // previous mode
        break;
    }
  });

  function changeMode(delta) {
    const modes = ["pomodoro", "shortBreak", "longBreak"];
    const next =
      (modes.indexOf(timer.mode) + delta + modes.length) % modes.length;
    timer.mode = modes[next];
    switchMode(timer.mode);
    stopTimer();
  }

  // === Enhanced Music Panel Logic ===
  const musicToggle = document.getElementById("js-music-toggle");
  const volumeToggle = document.getElementById("js-volume-toggle");
  const musicOptions = document.getElementById("js-music-options");
  const volumeControl = document.getElementById("js-volume-control");
  const volumeSlider = document.getElementById("js-volume-slider");
  const audioPlayer = document.getElementById("js-audio-player");
  
  let currentTrack = null;
  let isExpanded = false;
  let isVolumeVisible = false;

  // Your local audio files - update these paths to match your file locations
  const tracks = {
    1: "Hollow Knight Lofi.mp3", // Replace with your first music file
    2: "Halo Lofi.mp3", // Replace with your second music file
    3: "Star Wars Lofi.mp3", // Replace with your third music file
    4: "Silksong Lofi.mp3", // Replace with your fourth music file
  };

  // Set initial volume
  audioPlayer.volume = 0.5;
  volumeSlider.value = 50;

  // Toggle music panel expansion
  musicToggle.addEventListener("click", () => {
    playSound(buttonSound);
    isExpanded = !isExpanded;
    
    if (isExpanded) {
      musicOptions.classList.add("show");
      volumeToggle.classList.add("show");
      musicToggle.classList.add("active");
    } else {
      musicOptions.classList.remove("show");
      volumeToggle.classList.remove("show");
      volumeControl.classList.remove("show");
      isVolumeVisible = false;
      musicToggle.classList.remove("active");
    }
  });

  // Toggle volume slider visibility
  volumeToggle.addEventListener("click", () => {
    playSound(buttonSound);
    isVolumeVisible = !isVolumeVisible;
    
    if (isVolumeVisible) {
      volumeControl.classList.add("show");
      volumeToggle.classList.add("active");
    } else {
      volumeControl.classList.remove("show");
      volumeToggle.classList.remove("active");
    }
  });

  // Handle playlist button clicks
  document.querySelectorAll(".music-option").forEach(btn => {
    btn.addEventListener("click", () => {
      playSound(buttonSound);
      const trackId = btn.dataset.track;
      
      // If clicking the same track that's playing, pause it
      if (currentTrack === trackId && !audioPlayer.paused) {
        audioPlayer.pause();
        btn.classList.remove("playing");
        currentTrack = null;
      } else {
        // Remove playing state from all buttons
        document.querySelectorAll(".music-option").forEach(b => 
          b.classList.remove("playing")
        );
        
        // Play the new track
        audioPlayer.src = tracks[trackId];
        audioPlayer.loop = true; // Loop the playlist
        audioPlayer.play();
        btn.classList.add("playing");
        currentTrack = trackId;
      }
    });
  });

  // Volume slider control
  volumeSlider.addEventListener("input", (e) => {
    audioPlayer.volume = e.target.value / 100;
    
    // Update volume icon based on level
    const volumeIcon = volumeToggle.querySelector("i");
    const volumeLevel = e.target.value;
    
    if (volumeLevel == 0) {
      volumeIcon.className = "fas fa-volume-mute";
    } else if (volumeLevel < 50) {
      volumeIcon.className = "fas fa-volume-down";
    } else {
      volumeIcon.className = "fas fa-volume-up";
    }
  });

  // Handle audio ending (in case loop fails)
  audioPlayer.addEventListener("ended", () => {
    if (currentTrack) {
      audioPlayer.play(); // Restart the track
    }
  });
});