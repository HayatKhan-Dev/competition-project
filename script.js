const themeToggle = document.getElementById("themeToggle");
gsap.registerPlugin(ScrollTrigger);
const sections = gsap.utils.toArray(".horizontal-wrapper > *");

// Load saved theme
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
  }
});

// Toggle theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
});

// Responsive Navbar Code
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.querySelector(".mobile-menu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove("active");
  }
});

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
});

// Chatbot Toggle Code
const chatBtn = document.querySelector(".contact-cta");
const chatOverlay = document.querySelector(".chat-overlay");
const chatPanel = document.querySelector(".chat-panel-div");
const closeChatBtn = document.querySelector(".close-chat-btn");

chatBtn.addEventListener('click', () => {
  chatOverlay.classList.add("active");
  chatPanel.classList.add("active");
});

closeChatBtn.addEventListener('click', () => {
  chatOverlay.classList.remove("active");
  chatPanel.classList.remove("active");
});

chatOverlay.addEventListener('click', () => {
  chatOverlay.classList.remove("active");
  chatPanel.classList.remove('active')
});

// Dynamic Message Creation For Chatbot And User
const chatInput = document.getElementById('chat-input');
const sendBtn = document.querySelector('.send-btn');
const messageArea = document.querySelector(".message-area")

const sendMessage = () => {
let userChatValue = chatInput.value.trim();
  if (userChatValue === undefined || userChatValue === "") {
    userChatValue = "";
  } else {
    let userDiv = document.createElement('div');
    userDiv.textContent = userChatValue;
    userDiv.classList.add("user-message");
    messageArea.appendChild(userDiv);
    // Bot Typing Affect
    let typingDiv = document.createElement('div');
    typingDiv.textContent = "QueueX is typing...";
    typingDiv.classList.add("bot-message");
    messageArea.appendChild(typingDiv);
    messageArea.scrollTop = messageArea.scrollHeight;

    setTimeout(() => {
      typingDiv.remove();
      let botResponse = getBotResponse(userChatValue.toLowerCase());
      let botDiv = document.createElement("div");
      botDiv.textContent = botResponse;
      botDiv.classList.add('bot-message');
      messageArea.appendChild(botDiv);
    }, 1000);

    chatInput.value = ""
  }
}

function getBotResponse (userMessage) {
  if (userMessage.includes("hello") || userMessage.includes("hi") || userMessage.includes("hey")) {
    return "Hello, Welcome To The QueueX, How Can I Help You Today!"
  } else if (userMessage.includes("you")) {
    return "I'm doing great. Thanks for asking, How you doing!!"
  } else if (userMessage.includes("great") || userMessage.includes("fine")) {
    return "Good to hear that, What can i assist you with!"
  } else if (userMessage.includes("token")) {
    return "You can get the token by clicking on the get token button in homepage"
  } else if (userMessage.includes("queue")) {
    return "You can join the queue directly from the dashboard"
  } else if (userMessage.includes("track")) {
    return "You can track your queue position in real time using QueueX."
  } else if (userMessage.includes("contact", "support", "help")) {
    return "Our support team is available to assist you with any issues."
  } else {
    return "I'm sorry, I didn't understand that question. Try asking about tokens, queues, or tracking."
  }
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Token Modal


// GSAP Animations
document.addEventListener("DOMContentLoaded", () => {
  const loaderTl = gsap.timeline();

  loaderTl.to(".loader-bar", {
    width: "100%",
    duration: 1.5,
    ease: "bounce.out",
  });

  loaderTl.to(".loader", {
    y: "-100%",
    duration: 0.8,
    ease: "power3.inOut",
  });

  loaderTl.set(".loader", {
    display: "none",
  });

  loaderTl.from(".navbar", {
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
  });

  loaderTl.from(".hero", {
    opacity: 0,
    duration: 0.5,
    ease: "bounce.out",
  });

  loaderTl.add(() => {
    const tl = gsap.timeline();

    tl.from(".navbar", { duration: 1, y: -30, opacity: 0, ease: "power2.out" });

    tl.from(".logo", { duration: 1, y: -50, opacity: 0, ease: "bounce.out" });
    tl.from(
      ".hero-content",
      { duration: 1, y: 50, opacity: 0, ease: "power2.out" },
      "-=0.5",
    );
    tl.from(
      ".hero-content h1, .hero-content p",
      { duration: 1, x: -100, opacity: 0, ease: "power2.out" },
      "-=0.5",
    );
    tl.from(
      ".hero-preview",
      { duration: 1, y: 50, opacity: 0, ease: "power2.out" },
      "-=0.5",
    );
    tl.from(".live-queue", {
      duration: 0.5,
      y: 20,
      opacity: 0,
      ease: "power2.out",
    },"-=0.5");
    tl.from(
      ".queue-row",
      { duration: 1, x: 50, opacity: 0, ease: "power2.out", stagger: 0.2 },
      "-=0.5",
    );
  });

  // Scroll-triggered animations
  if (window.innerWidth > 768) {
    const horizontalScroll = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".horizontal-wrapper",
        pin: true,
        scrub: 2,
        snap: 1 / (sections.length - 1),
        toggleActions: "play none none reset",
        end: () =>
          "+=" + document.querySelector(".horizontal-wrapper").offsetWidth,
      },
    });

    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".aboutS",
        containerAnimation: horizontalScroll,
        start: "left 60%",
        toggleActions: "play none none reset",
      }
    })

    aboutTl.from(".about-heading", {
      y: 50,
      opacity: 0,
      duration: 0.8,
    });

    aboutTl.from(".about-left", {
      x: -200,
      opacity: 0,
      duration: 0.7,
    });

    aboutTl.from(".about-intro", {
      y: 50,
      opacity: 0,
      duration: 0.5,
    });

    aboutTl.from(".about-points", {
      y: 30,
      opacity: 0,
      duration: 0.5,
    })

    aboutTl.from(".point-icon", {
      x: 30,
      opacity: 0,
      duration: 0.5,
    });

    aboutTl.from(".point-text", {
      x: -60,
      opacity: 0,
      duration: 0.5,
    }, "-=0.5");

    aboutTl.from(".about-right", {
      x: 100,
      opacity: 0,
      duration: 0.7,
    });

    aboutTl.from(".dasboard-stats", {
      y: 30,
      opacity: 0,
      duration: 0.5,
    })
  }

  // other animations after scrll trigger
  gsap.to(".queue-card", {
    y: -12,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });

  // Contact Us Page Animation
  const contactTl = gsap.timeline({
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 60%",
      toggleActions: "play none none reset",
    }
  });

  contactTl.from(".contact-title", {
    y: 50,
    opacity: 0,
    duration: 0.8,
  });

  contactTl.from(".contact-desc",{
    y: 30,
    opacity: 0,
    duration: 0.5,
  },"-=0.5");

  contactTl.from(".info-item", {
    x: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
  }, "-=0.5");

  contactTl.from(".contact-dashboard", {
    x: 100,
    opacity: 0,
    duration: 0.7,
  }, "-=0.5");
  
  contactTl.from(".contact-header", {
    y: 30,
    opacity: 0,
    duration: 0.5,
  })
});
