const queueName = document.getElementById("queueName");
const queueStatus = document.getElementById("queueStatus");

const userToken = document.getElementById("userToken");
const servingToken = document.getElementById("servingToken");

const peopleAhead = document.getElementById("peopleAhead");
const waitTime = document.getElementById("waitTime");

// journey section variables
const stepGenerated = document.getElementById("stepGenerated");
const stepWaiting = document.getElementById("stepWaiting");
const stepServing = document.getElementById("stepServing");
const stepCompleted = document.getElementById("stepCompleted");

const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const line3 = document.getElementById("line3");

// 3rd Section
const insightPeople = document.getElementById("insightPeople");
const insightWait = document.getElementById("insightWait");
const insightPosition = document.getElementById("insightPosition");
const insightStatus = document.getElementById("insightStatus");

// Notification center
const notificationContainer = document.getElementById("notificationContainer");

function updateUserDashboard() {
  const tokenData = JSON.parse(localStorage.getItem("tokenData"));
  const queueData = JSON.parse(localStorage.getItem("queueData"));
  if (!tokenData || !queueData) return;
  const currentQueue = tokenData.queue;
  const serving = queueData.nowServing[currentQueue];
  const prefix = tokenData.token.split("-")[0];
  const tokenNumber = Number(tokenData.token.split("-")[1]);
  const ahead = Math.max(0, tokenNumber - serving);
  // ==============================
  // Live Insights
  // ==============================

  insightPeople.textContent = ahead;
  insightWait.textContent = ahead >= 20 ? "40 mins+" : `${ahead * 2} mins`;
  insightPosition.textContent = `#${ahead + 1}`;

  if (serving < tokenNumber) {
    insightStatus.textContent = "Waiting";
    insightStatus.style.color = "#f59e0b";
  } else if (serving === tokenNumber) {
    insightStatus.textContent = "Serving";
    insightStatus.style.color = "#3b82f6";
  } else {
    insightStatus.textContent = "Completed";
    insightStatus.style.color = "#22c55e";
  }

  queueName.textContent = `${currentQueue} Queue`;
  userToken.textContent = tokenData.token;
  servingToken.textContent = `${prefix}-${String(serving).padStart(3, "0")}`;
  peopleAhead.textContent = ahead;
  waitTime.textContent = ahead >= 20 ? "40 mins+" : `${ahead * 2} mins`;
  if (serving >= tokenNumber) {
    queueStatus.textContent = "Completed";
    queueStatus.style.background = "#16a34a";
  } else {
    queueStatus.textContent = "Waiting";
    queueStatus.style.background = "#f59e0b";
  }
  updateJourney(serving, tokenNumber);
}

updateUserDashboard();
renderNotifications();

function updateJourney(serving, tokenNumber) {
  stepGenerated.className = "journey-step completed";
  line1.classList.add("completed");

  if (serving < tokenNumber) {
    stepWaiting.className = "journey-step completed";
    line2.classList.remove("completed");
    stepServing.className = "journey-step waiting";
    stepCompleted.className = "journey-step";
  }

  if (serving === tokenNumber) {
    line2.classList.add("completed");
    stepServing.className = "journey-step completed";
    line3.classList.remove("completed");
  }

  if (serving > tokenNumber) {
    line3.classList.add("completed");
    stepCompleted.className = "journey-step completed";
  }
}

function renderNotifications() {
  const queueData = JSON.parse(localStorage.getItem("queueData"));
  if (!queueData) return;
  notificationContainer.innerHTML = "";
  if (!queueData.notifications || queueData.notifications.length === 0) {
    notificationContainer.innerHTML = `<p>No notifications yet.</p>`;
    return;
  }
  queueData.notifications.forEach((notification) => {
    let icon = "fa-solid fa-bell";
    let color = "#3b82f6";
    if (notification.type === "warning") {
      icon = "fa-solid fa-triangle-exclamation";
      color = "#f59e0b";
    }
    if (notification.type === "success") {
      icon = "fa-solid fa-circle-check";
      color = "#22c55e";
    }
    if (notification.type === "danger") {
      icon = "fa-solid fa-circle-xmark";
      color = "#ef4444";
    }
    notificationContainer.innerHTML += `
        <div class="notification-item">
            <i class="${icon}" style="color:${color};"></i>
            <div>
                <h4>${notification.type.toUpperCase()}</h4>
                <p>${notification.message}</p>
            </div>
        </div>`;
  });
}

window.addEventListener("storage", () => {
  updateUserDashboard();
  renderNotifications();
});
