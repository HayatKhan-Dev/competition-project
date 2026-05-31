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

  loaderTl.add(() => {
    const tl = gsap.timeline();

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
    tl.from(
      ".queue-row",
      { duration: 1, y: 50, opacity: 0, ease: "power2.out" },
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
        scrub: 3,
        snap: 1 / (sections.length - 1),
        toggleActions: "play none none reset",
        end: () =>
          "+=" + document.querySelector(".horizontal-wrapper").offsetWidth,
      },
    });

    gsap.from(".about-heading", {
      x: 200,
      opacity: 0,
      duration: 1.5,
      scrollTrigger: {
        trigger: ".aboutS",
        containerAnimation: horizontalScroll,
        start: "left 60%",
        toggleActions: "restart none none reset",
        invalidateOnRefresh: true,
        once: false,
      },
    });

    gsap.from(".about-left", {
      x: -100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".aboutS",
        containerAnimation: horizontalScroll,
        start: "left 60%",
        toggleActions: "restart none none reset",
        invalidateOnRefresh: true,
        once: false,
      },
    });

    gsap.from(".about-right", {
      x: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".aboutS",
        containerAnimation: horizontalScroll,
        start: "left 50%",
        toggleActions: "restart none none reset",
        invalidateOnRefresh: true,
        once: false,
      },
    });
  }

  // other animations after scrll trigger
  gsap.to(".queue-card", {
    y: -12,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });
});
