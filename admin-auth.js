const adminPanelBtn = document.getElementById("adminPanelBtn");
const adminOverlay = document.getElementById("adminLoginOverlay");
const adminModal = document.querySelector(".form-container");
const closeAdminBtn = document.getElementById("closeAdminLogin");

const adminLoginForm = document.getElementById("adminLoginForm");
const adminUsername = document.getElementById("adminUsername");
const adminPassword = document.getElementById("adminPassword");

// OPEN MODAL
adminPanelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  adminOverlay.classList.add("active");
  gsap.fromTo(
    adminModal,
    {
      opacity: 0,
      scale: 0.75,
      y: 40,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.45,
      ease: "back.out(1.7)",
    },
  );
});

function closeAdminModal() {
  gsap.to(adminModal, {
    opacity: 0,
    scale: 0.8,
    y: 40,
    duration: 0.3,
    ease: "power2.in",
    onComplete() {
      adminOverlay.classList.remove("active");
    },
  });
}

closeAdminBtn.addEventListener("click", closeAdminModal);

adminOverlay.addEventListener("click", (e) => {
  if (e.target === adminOverlay) {
    closeAdminModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && adminOverlay.classList.contains("active")) {
    closeAdminModal();
  }
});

// Login form validation
adminLoginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = adminUsername.value.trim();
  const password = adminPassword.value.trim();
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "queuex123";
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    adminUsername.value = "";
    adminPassword.value = "";
    window.location.href = "admin.html";
  } else {
    showToast("Incorrect Username or Password", "error");
  }
});


