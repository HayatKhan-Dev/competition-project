// Dashboard Elements
const totalTokensEl = document.getElementById("totalTokens");
const activeQueuesEl = document.getElementById("activeQueues");
const completedTodayEl = document.getElementById("completedToday");
const waitingUsersEl = document.getElementById("waitingUsers");

const queueTabs = document.querySelectorAll(".queue-tab");
const queueTitle = document.getElementById("queueTitle");
const currentToken = document.getElementById("currentToken");
const nextToken = document.getElementById("nextToken");

const tbody = document.getElementById("tbody");

const START_TOKEN = 21;

function getPrefix(queue) {
  const prefixes = {
    Bank: "B",
    Hospital: "H",
    "Government Office": "G",
    "Customer Support": "S",
  };
  return prefixes[queue];
}

function selectQueue(queue) {
  queueData.selectedQueue = queue;
  saveQueueData();
  updateDashboard();
  renderRecentTokens();
}

queueTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    queueTabs.forEach((btn) => btn.classList.remove("active"));
    tab.classList.add("active");
    selectQueue(tab.dataset.queue);
  });
});

let queueData = JSON.parse(localStorage.getItem("queueData")) || {
  selectedQueue: "Bank",

  nowServing: {
    Bank: 21,
    Hospital: 21,
    "Government Office": 21,
    "Customer Support": 21,
  },

  lastToken: {
    Bank: 21,
    Hospital: 21,
    "Government Office": 21,
    "Customer Support": 21,
  },

  waiting: {
    Bank: 0,
    Hospital: 0,
    "Government Office": 0,
    "Customer Support": 0,
  },

  completed: {
    Bank: 0,
    Hospital: 0,
    "Government Office": 0,
    "Customer Support": 0,
  },

  totalTokens: {
    Bank: 0,
    Hospital: 0,
    "Government Office": 0,
    "Customer Support": 0,
  },

  tokens: [],
  recentActivity: [],
  notifications: [],
};

function saveQueueData() {
  localStorage.setItem("queueData", JSON.stringify(queueData));
}

// Recent Activity Add ups & rendering
function addRecentActivity(icon, message) {
  queueData.recentActivity = queueData.recentActivity || [];
  queueData.recentActivity.unshift({
    icon,
    message,
  });
  // Keep only the latest 4 activities
  queueData.recentActivity = queueData.recentActivity.slice(0, 4);
  saveQueueData();
  // Notify other tabs/pages
  localStorage.setItem("adminUpdate", Date.now());
}

function renderRecentActivity() {
  const activityContainer = document.getElementById("recent-acitivity");

  // Remove old activity cards
  activityContainer
    .querySelectorAll(".admin-activity-item")
    .forEach((item) => item.remove());

  // Make sure recentActivity exists
  queueData.recentActivity = queueData.recentActivity || [];

  // Remove old string-based activities
  queueData.recentActivity = queueData.recentActivity.filter(
    (activity) =>
      activity &&
      typeof activity === "object" &&
      activity.icon &&
      activity.message,
  );

  queueData.recentActivity.forEach((activity) => {
    const div = document.createElement("div");

    div.className = "admin-activity-item";

    div.innerHTML = `
      <i class="${activity.icon}"></i>
      <p>${activity.message}</p>
    `;

    activityContainer.appendChild(div);
  });
}

function loadQueueData() {
  const savedQueue = localStorage.getItem("queueData");

  if (savedQueue) {
    queueData = JSON.parse(savedQueue);
  }
}

function updateDashboard() {
  const currentQueue = queueData.selectedQueue;
  const prefix = getPrefix(currentQueue);

  // Dashboard Cards
  totalTokensEl.textContent = queueData.totalTokens[currentQueue];
  waitingUsersEl.textContent = queueData.waiting[currentQueue];

  completedTodayEl.textContent = queueData.completed[currentQueue];
  activeQueuesEl.textContent = 4;

  // Queue Title
  queueTitle.textContent = `${currentQueue} Queue`;

  // Current Token
  currentToken.textContent = `${prefix}-${String(queueData.nowServing[currentQueue]).padStart(3, "0")}`;

  // Next Token
  nextToken.textContent = `${prefix}-${String(queueData.nowServing[currentQueue] + 1).padStart(3, "0")}`;
}

function renderRecentTokens() {
  tbody.innerHTML = "";
  const currentQueue = queueData.selectedQueue;
  const prefix = getPrefix(currentQueue);
  const currentNumber = queueData.nowServing[currentQueue];
  const MAX_ROWS = 4;

  for (let i = 0; i < MAX_ROWS; i++) {
    const tokenNumber = currentNumber + i;
    const token = `${prefix}-${String(tokenNumber).padStart(3, "0")}`;
    let status;
    if (i === 0) {
      status = `<span class="status serving">Serving</span>`;
    } else {
      status = `<span class="status waiting">Waiting</span>`;
    }
    const row = document.createElement("tr");
    row.innerHTML = `<td>${token}</td> <td>${currentQueue}</td> <td>${status}</td>`;
    tbody.appendChild(row);
  }
}

// Next Token Button
const nextTokenBtn = document.getElementById("next-btn");

nextTokenBtn.addEventListener("click", () => {
  const currentQueue = queueData.selectedQueue;
  const prefix = getPrefix(currentQueue);
  // Token currently being served
  const completedToken = `${prefix}-${String(queueData.nowServing[currentQueue]).padStart(3, "0")}`;
  // Find user
  const completedUser = queueData.tokens.find(
    (token) => token.token === completedToken,
  );
  if (completedUser) {
    completedUser.status = "Completed";
  }
  // Move to next token
  queueData.nowServing[currentQueue]++;
  if (queueData.waiting[currentQueue] > 0) {
    queueData.waiting[currentQueue]--;
  }
  queueData.completed[currentQueue]++;
  // New serving token
  const servingToken = `${prefix}-${String(queueData.nowServing[currentQueue]).padStart(3, "0")}`;
  // Recent Activity
  addRecentActivity(
    "fa-solid fa-circle-check",
    completedUser
      ? `${completedUser.name} completed (${completedToken})`
      : `${completedToken} completed`,
  );
  addRecentActivity("fa-solid fa-play", `${servingToken} is now serving`);
  saveQueueData();
  updateDashboard();
  renderRecentTokens();
  renderRecentActivity();
  localStorage.setItem("adminUpdate", Date.now());
});

// Skip Token Button

skipTokenBtn.addEventListener("click", () => {
  const currentQueue = queueData.selectedQueue;
  const prefix = getPrefix(currentQueue);
  // Token being skipped
  const skippedToken = `${prefix}-${String(queueData.nowServing[currentQueue]).padStart(3, "0")}`;

  const skippedUser = queueData.tokens.find(
    (token) => token.token === skippedToken,
  );
  if (skippedUser) {
    skippedUser.status = "Skipped";
  }
  // Move queue
  queueData.nowServing[currentQueue]++;
  if (queueData.waiting[currentQueue] > 0) {
    queueData.waiting[currentQueue]--;
  }
  // New serving token
  const servingToken = `${prefix}-${String(queueData.nowServing[currentQueue]).padStart(3, "0")}`;
  // Recent Activity
  addRecentActivity(
    "fa-solid fa-forward",
    skippedUser
      ? `${skippedUser.name} skipped (${skippedToken})`
      : `${skippedToken} skipped`,
  );
  addRecentActivity("fa-solid fa-play", `${servingToken} is now serving`);
  saveQueueData();
  updateDashboard();
  renderRecentTokens();
  renderRecentActivity();
  localStorage.setItem("adminUpdate", Date.now());
});

// Reset Queue Button
const resetQueueBtn = document.getElementById("resetQueueBtn");
resetQueueBtn.addEventListener("click", () => {
  const confirmReset = confirm(
    "Are you sure you want to reset the queue? This action cannot be undone.",
  );
  if (confirmReset) {
    queueData.nowServing = {
      Bank: 21,
      Hospital: 21,
      "Government Office": 21,
      "Customer Support": 21,
    };

    queueData.waiting = {
      Bank: 0,
      Hospital: 0,
      "Government Office": 0,
      "Customer Support": 0,
    };

    queueData.completed = {
      Bank: 0,
      Hospital: 0,
      "Government Office": 0,
      "Customer Support": 0,
    };

    queueData.totalTokens = {
      Bank: 0,
      Hospital: 0,
      "Government Office": 0,
      "Customer Support": 0,
    };
    queueData.recentActivity = [];
    addRecentActivity("fa-solid fa-rotate-left", "Queue Reset");
    addRecentActivity("fa-solid fa-rotate-left", "Queue has been reset");
  }
  saveQueueData();
  updateDashboard();
});

// Notification Button
const notifyUsersBtn = document.getElementById("notify-btn");
const notifyOverlay = document.querySelector(".notify-overlay");
const notifyModal = document.querySelector(".notify-modal");
const closeNotifyBtn = document.querySelector(".close-notify-btn");
const sendNotificationBtn = document.getElementById("sendNotificationBtn");
const notificationMessage = document.getElementById("notificationMessage");
const notificationType = document.getElementById("notificationType");

notifyUsersBtn.addEventListener("click", () => {
  notifyOverlay.classList.add("active");
  gsap.fromTo(
    notifyModal,
    {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: "back.out(1.7)",
    },
  );
});

function closeNotifyModal() {
  gsap.to(notifyModal, {
    opacity: 0,
    scale: 0.8,
    y: 20,
    duration: 0.3,
    onComplete() {
      notifyOverlay.classList.remove("active");
    },
  });
}

closeNotifyBtn.addEventListener("click", closeNotifyModal);
notifyOverlay.addEventListener("click", (e) => {
  if (e.target === notifyOverlay) {
    closeNotifyModal();
  }
});

sendNotificationBtn.addEventListener("click", () => {
  const message = notificationMessage.value.trim();
  if (message === "") {
    alert("Please write a notification.");
    return;
  }
  queueData.notifications = queueData.notifications || [];
  queueData.notifications.push({
    id: Date.now(),
    type: notificationType.value,
    message: message,
  });
  addRecentActivity("fa-solid fa-bell", "Notification sent to users");
  saveQueueData();
  localStorage.setItem("adminUpdate", Date.now());
  notificationMessage.value = "";
  closeNotifyModal();
});

loadQueueData();
updateDashboard();
renderRecentTokens();
renderRecentActivity();

window.addEventListener("storage", () => {
  loadQueueData();
  updateDashboard();
  renderRecentTokens();
  renderRecentActivity();
});

// Search functionality for the admin panel --> could've done better :(
const adminSearch = document.getElementById("adminSearch");
const enterSearch = document.getElementById("enterSearch");

const searchItems = [
  {
    keywords: ["bank", "bank queue"],
    element: document.querySelector('[data-queue="Bank"]'),
    action: () => document.querySelector('[data-queue="Bank"]').click(),
  },
  {
    keywords: ["hospital"],
    element: document.querySelector('[data-queue="Hospital"]'),
    action: () => document.querySelector('[data-queue="Hospital"]').click(),
  },
  {
    keywords: ["government", "office"],
    element: document.querySelector('[data-queue="Government Office"]'),
    action: () =>
      document.querySelector('[data-queue="Government Office"]').click(),
  },
  {
    keywords: ["customer", "support"],
    element: document.querySelector('[data-queue="Customer Support"]'),
    action: () =>
      document.querySelector('[data-queue="Customer Support"]').click(),
  },
  {
    keywords: ["reset"],
    element: document.getElementById("resetQueueBtn"),
  },
  {
    keywords: ["skip"],
    element: document.getElementById("skipTokenBtn"),
  },
  {
    keywords: ["next-token"],
    element: document.getElementById("nextToken"),
  },
  {
    keywords: ["current token"],
    element: document.getElementById("currentToken"),
  },
  {
    keywords: ["notify", "notification"],
    element: document.getElementById("notify-btn"),
  },
  {
    keywords: ["recent activity"],
    element: document.getElementById("recent-acitivity"),
  },
  {
    keywords: ["recent tokens"],
    element: document.getElementById("tbody"),
  },
];

function highlightElement(element) {
  if (!element) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  element.style.transition = "0.3s";
  element.style.boxShadow = "0 0 20px #00d4ff";

  setTimeout(() => {
    element.style.boxShadow = "";
  }, 1500);
}

// search token report modal
const searchOverlay = document.getElementById("searchOverlay");
const closeSearchCard = document.getElementById("closeSearchCard");

const searchToken = document.getElementById("searchToken");
const searchName = document.getElementById("searchName");
const searchPhone = document.getElementById("searchPhone");
const searchQueue = document.getElementById("searchQueue");
const searchStatus = document.getElementById("searchStatus");

function searchDashboard(query) {
  query = query.toLowerCase().trim();
  if (query === "") return;
  // Search Dashboard UI

  const uiResult = searchItems.find((item) =>
    item.keywords.some((keyword) => keyword.includes(query)),
  );

  if (uiResult) {
    highlightElement(uiResult.element);

    if (uiResult.action) {
      uiResult.action();
    }
    return;
  }

  const tokenResult = queueData.tokens.find(
    (token) =>
      token.token.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      token.phone.toLowerCase().includes(query) ||
      token.queue.toLowerCase().includes(query) ||
      token.status.toLowerCase().includes(query),
  );

  if (tokenResult) {
    searchToken.textContent = tokenResult.token;

    searchName.textContent = tokenResult.name;

    searchPhone.textContent = tokenResult.phone;

    searchQueue.textContent = tokenResult.queue;

    searchStatus.textContent = tokenResult.status;

    searchStatus.className = "";

    switch (tokenResult.status.toLowerCase()) {
      case "waiting":
        searchStatus.classList.add("status-waiting");
        break;

      case "serving":
        searchStatus.classList.add("status-serving");
        break;

      case "completed":
        searchStatus.classList.add("status-completed");
        break;

      case "skipped":
        searchStatus.classList.add("status-skipped");
        break;
    }

    searchOverlay.classList.add("active");

    return;
    return;
  }
  alert("No Results Found.");
}

enterSearch.addEventListener("click", () => {
  searchDashboard(adminSearch.value);
});

adminSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchDashboard(adminSearch.value);
  }
});

closeSearchCard.addEventListener("click", () => {
  searchOverlay.classList.remove("active");
});

searchOverlay.addEventListener("click", (e) => {
  if (e.target === searchOverlay) {
    searchOverlay.classList.remove("active");
  }
});

// logout logic
const logoutBtn = document.getElementById("logoutBtn");
const logoutOverlay = document.getElementById("logoutOverlay");

logoutBtn.addEventListener("click", () => {
  logoutOverlay.classList.add("active");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1800);
});
