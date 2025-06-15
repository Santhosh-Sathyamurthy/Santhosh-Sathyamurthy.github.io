// Custom cursor
function initCursor() {
  if (window.innerWidth <= 768) return;

  const cursor = document.querySelector(".cursor");
  const cursorTrail = document.querySelector(".cursor-trail");
  let cursorX = 0,
    cursorY = 0;
  let trailX = 0,
    trailY = 0;

  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  function animateCursor() {
    trailX += (cursorX - trailX) * 0.1;
    trailY += (cursorY - trailY) * 0.1;

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";
    cursorTrail.style.left = trailX + "px";
    cursorTrail.style.top = trailY + "px";

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor interactions
  const interactives = document.querySelectorAll(
    "button, .skill-item, .info-card, .tech-badge, .contact-link"
  );
  interactives.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "scale(2)";
      cursor.style.background = "linear-gradient(45deg, #ec4899, #6366f1)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "scale(1)";
      cursor.style.background = "linear-gradient(45deg, #6366f1, #ec4899)";
    });
  });
}

// Floating particles
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 8 + "s";
    particle.style.animationDuration = Math.random() * 3 + 5 + "s";
    particlesContainer.appendChild(particle);
  }
}

// Smooth scroll animations with stagger
function animateOnScroll() {
  const elements = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 100);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// Enhanced parallax with mouse movement
function handleParallax() {
  let mouseX = 0,
    mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;

    const shapes = document.querySelectorAll(".shape");
    const bgLayers = document.querySelectorAll(".bg-layer-1, .bg-layer-2");

    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 20;
      const x = mouseX * speed;
      const y = mouseY * speed;
      shape.style.transform += ` translate(${x}px, ${y}px)`;
    });

    bgLayers.forEach((layer, index) => {
      const speed = (index + 1) * 5;
      const x = mouseX * speed;
      const y = mouseY * speed;
      layer.style.transform += ` translate(${x}px, ${y}px)`;
    });
  });
}

// Registration handler with excitement
function handleRegistration() {
  const messages = [
    "🎉 YESSS! You're about to join something AMAZING!\n\nRegistration opens soon and when it does, you'll be the first to know. Get ready for the most transformative coding experience of your life!\n\n✨ Epic projects await you!",
    "🚀 INCREDIBLE CHOICE! You're on the fast track to coding mastery!\n\nWe're putting the finishing touches on this mind-blowing workshop. You'll get exclusive early access to registration!\n\n🔥 Your coding superpowers are loading...",
    "⚡ BOOM! You just made the smartest decision of your coding journey!\n\nThis workshop is going to be absolutely legendary. We'll notify you the MOMENT registration opens!\n\n🌟 Prepare to be amazed!",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  alert(randomMessage);

  // Add some visual flair
  document.body.style.background =
    "radial-gradient(circle, rgba(99,102,241,0.1), rgba(0,0,0,1))";
  setTimeout(() => {
    document.body.style.background = "#000000";
  }, 2000);
}

// Tech badge magnetic effect
function initTechBadges() {
  const badges = document.querySelectorAll(".tech-badge");
  badges.forEach((badge) => {
    badge.addEventListener("mouseenter", () => {
      badge.style.boxShadow = "0 10px 30px rgba(99, 102, 241, 0.6)";

      // Repel nearby badges
      badges.forEach((otherBadge) => {
        if (otherBadge !== badge) {
          const rect1 = badge.getBoundingClientRect();
          const rect2 = otherBadge.getBoundingClientRect();
          const distance = Math.sqrt(
            Math.pow(rect1.x - rect2.x, 2) + Math.pow(rect1.y - rect2.y, 2)
          );

          if (distance < 200) {
            const angle = Math.atan2(rect2.y - rect1.y, rect2.x - rect1.x);
            const pushX = Math.cos(angle) * 10;
            const pushY = Math.sin(angle) * 5;
            otherBadge.style.transform = `translate(${pushX}px, ${pushY}px) scale(0.95)`;
          }
        }
      });
    });

    badge.addEventListener("mouseleave", () => {
      badge.style.boxShadow = "none";
      badges.forEach((otherBadge) => {
        otherBadge.style.transform = "translate(0, 0) scale(1)";
      });
    });
  });
}

// Sound effects (visual feedback)
function addSoundEffects() {
  const buttons = document.querySelectorAll("button, .skill-item, .info-card");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.style.transform += " scale(0.95)";
      setTimeout(() => {
        btn.style.transform = btn.style.transform.replace(" scale(0.95)", "");
      }, 150);
    });
  });
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  initCursor();
  createParticles();
  animateOnScroll();
  handleParallax();
  initTechBadges();
  addSoundEffects();
});

// Smooth scrolling
document.documentElement.style.scrollBehavior = "smooth";

// Performance optimization
let ticking = false;
function requestTick() {
  if (!ticking) {
    requestAnimationFrame(() => {
      ticking = false;
    });
    ticking = true;
  }
}
